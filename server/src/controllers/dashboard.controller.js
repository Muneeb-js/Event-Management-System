import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { Event } from '../models/event.model.js';
import { Alert } from '../models/alert.model.js';
import { User } from '../models/user.model.js';

const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);

  if (user.role === 'admin') {
    const allEvents = await Event.find({}).populate('organizer', 'fullName email avatar');
    const allUsers = await User.find({});

    const totalEvents = allEvents.length;
    const totalAttendees = allEvents.reduce((acc, event) => acc + (event.attendees?.length || 0), 0);
    const totalStudents = allUsers.filter(u => u.role === 'student').length;
    const totalTeachers = allUsers.filter(u => u.role === 'teacher').length;
    const pendingEvents = allEvents.filter(e => e.status === 'pending');
    const approvedEvents = allEvents.filter(e => e.status === 'approved');

    // Build real attendee management table data
    const populatedEvents = await Event.find({})
      .populate('attendees', 'fullName email avatar role')
      .populate('organizer', 'fullName');

    const attendeeManagement = [];
    populatedEvents.slice(0, 4).forEach(event => {
      event.attendees.slice(0, 3).forEach(attendee => {
        attendeeManagement.push({
          _id: attendee._id,
          name: attendee.fullName,
          email: attendee.email,
          avatar: attendee.avatar,
          role: attendee.role?.toUpperCase(),
          eventTitle: event.title,
          status: 'REGISTERED',
          time: new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        });
      });
    });

    // Category breakdown
    const categoryMap = {};
    allEvents.forEach(event => {
      const cat = event.category || 'GENERAL';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalEvents) * 100)
    }));

    // Recent events for events table
    const recentEvents = [...allEvents]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    // Registration trends grouped by month
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const trendMap = {};
    allEvents.forEach(event => {
      const month = new Date(event.date).getMonth();
      trendMap[month] = (trendMap[month] || 0) + (event.attendees?.length || 1);
    });
    const maxTrend = Math.max(...Object.values(trendMap), 1);
    const registrationTrends = months.map((month, idx) => ({
      month,
      count: trendMap[idx] || 0,
      percentage: Math.round(((trendMap[idx] || 0) / maxTrend) * 100),
      highlighted: idx === new Date().getMonth()
    }));

    const now = new Date();
    const quarter = Math.ceil((now.getMonth() + 1) / 3);
    const quarterNames = ['Spring', 'Summer', 'Autumn', 'Winter'];
    const activeQuarter = `${quarterNames[quarter - 1]} ${now.getFullYear()}`;

    return res.status(200).json(
      new ApiResponse(200, {
        role: 'admin',
        totalEvents,
        totalAttendees,
        totalStudents,
        totalTeachers,
        totalUsers: allUsers.length,
        approvedCount: approvedEvents.length,
        pendingCount: pendingEvents.length,
        activeQuarter,
        pendingEvents,
        recentEvents,
        registrationTrends,
        categoryBreakdown,
        attendeeManagement
      }, "Admin dashboard data fetched successfully")
    );
  }

  // Student/Teacher Dashboard Logic
  const attendedEvents = await Event.find({ attendees: userId });
  const now = new Date();
  let eventsAttendedCount = 0;
  let upcomingCount = 0;
  const calendarEvents = [];

  attendedEvents.forEach(event => {
    const eventDate = new Date(event.date);
    if (eventDate < now) {
      eventsAttendedCount++;
    } else {
      upcomingCount++;
    }
    if (eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear()) {
      calendarEvents.push({
        date: eventDate.getDate(),
        title: event.title,
        category: event.category || 'General'
      });
    }
  });

  const recentAlerts = await Alert.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
  const recommendedEvents = await Event.find({ attendees: { $ne: userId } }).limit(3);

  return res.status(200).json(
    new ApiResponse(200, {
      role: 'student',
      eventsAttendedCount,
      upcomingCount,
      calendarEvents,
      recentAlerts,
      recommendedEvents
    }, "Dashboard data fetched successfully")
  );
});

const approveEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin') throw new ApiError(403, 'Only admins can approve events');

  const event = await Event.findByIdAndUpdate(
    id,
    { status: 'approved' },
    { new: true }
  ).populate('organizer', 'fullName email');

  if (!event) throw new ApiError(404, 'Event not found');
  return res.status(200).json(new ApiResponse(200, event, 'Event approved successfully'));
});

const rejectEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== 'admin') throw new ApiError(403, 'Only admins can reject events');

  const event = await Event.findByIdAndUpdate(
    id,
    { status: 'rejected' },
    { new: true }
  ).populate('organizer', 'fullName email');

  if (!event) throw new ApiError(404, 'Event not found');
  return res.status(200).json(new ApiResponse(200, event, 'Event rejected successfully'));
});

export { getDashboardData, approveEvent, rejectEvent };
