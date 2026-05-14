import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Event } from '../models/event.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { Alert } from '../models/alert.model.js';
import { emitNotification } from '../socket.js';

const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, time, location } = req.body;

    if ([title, description, date, time, location].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        throw new ApiError(403, "Only teachers or admins can create events");
    }

    let coverImageUrl = "";
    if (req.file) {
        const coverImageLocalPath = req.file.path;
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (coverImage) {
            coverImageUrl = coverImage.url;
        }
    }

    const event = await Event.create({
        title,
        description,
        date,
        time,
        location,
        coverImage: coverImageUrl,
        organizer: req.user._id,
        status: req.user.role === 'admin' ? 'approved' : 'pending'
    });

    return res.status(201).json(
        new ApiResponse(201, event, "Event created successfully")
    );
});
const getAllEvents = asyncHandler(async (req, res) => {
    const { search, category, department, location, startDate, endDate } = req.query;
    let query = { status: 'approved' }; 
    
    if (req.query.myEvents === 'true' && req.user) {
        query = {}; 
        if (req.user.role === 'teacher') {
            query.organizer = req.user._id;
        } else if (req.user.role === 'student') {
            query.attendees = req.user._id;
        }
    }

    if (search) {
        const searchPattern = search.length <= 3 ? `\\b${search}\\b` : search;
        query.$or = [
            { title: { $regex: searchPattern, $options: 'i' } },
            { description: { $regex: searchPattern, $options: 'i' } }
        ];
    }

    if (category && category !== 'ALL') {
        query.category = category;
    }

    if (department && department !== 'All Departments') {
        query.department = department;
    }

    if (location && location !== 'All Venues') {
        query.location = location;
    }

    if (startDate || endDate) {
        query.date = {};
        if (startDate) {
            query.date.$gte = new Date(startDate);
        }
        if (endDate) {
            query.date.$lte = new Date(endDate);
        }
    }

    const events = await Event.find(query).populate('organizer', 'fullName email');
    
    return res.status(200).json(
        new ApiResponse(200, events, "Events fetched successfully")
    );
});

const getEventById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id).populate('organizer', 'fullName email').populate('attendees', 'fullName email');

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    // Restrict access to unapproved events
    if (event.status !== 'approved' && req.user?.role !== 'admin' && event.organizer._id.toString() !== req.user?._id?.toString()) {
        throw new ApiError(403, "This event is pending approval and is not public yet");
    }

    return res.status(200).json(
        new ApiResponse(200, event, "Event fetched successfully")
    );
});

const joinEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'student') {
        throw new ApiError(403, "Only students can join events");
    }

    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.attendees.some(attendeeId => attendeeId.toString() === req.user._id.toString())) {
        throw new ApiError(400, "You have already joined this event");
    }

    event.attendees.push(req.user._id);
    await event.save();

    // Create a notification for the student
    const alert = await Alert.create({
        user: req.user._id,
        event: event._id,
        category: "registration",
        title: "Registration Successful",
        message: `You have successfully registered for the event: "${event.title}".`,
        type: "success"
    });

    // Emit real-time notification
    emitNotification(req.user._id, alert);

    return res.status(200).json(
        new ApiResponse(200, event, "Successfully joined the event")
    );
});

const leaveEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (!event.attendees.some(attendeeId => attendeeId.toString() === req.user._id.toString())) {
        throw new ApiError(400, "You have not joined this event");
    }

    event.attendees = event.attendees.filter(userId => userId.toString() !== req.user._id.toString());
    await event.save();

    return res.status(200).json(
        new ApiResponse(200, event, "Successfully left the event")
    );
});

const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin' && req.user.role !== 'teacher') {
        throw new ApiError(403, "You are not authorized to delete this event");
    }

    await Event.findByIdAndDelete(id);

    return res.status(200).json(
        new ApiResponse(200, {}, "Event deleted successfully")
    );
});

const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, date, time, location } = req.body;

    const event = await Event.findById(id);

    if (!event) {
        throw new ApiError(404, "Event not found");
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to update this event");
    }

    let coverImageUrl = event.coverImage;
    if (req.file) {
        const coverImageLocalPath = req.file.path;
        const coverImage = await uploadOnCloudinary(coverImageLocalPath);
        if (coverImage) {
            coverImageUrl = coverImage.url;
        }
    }

    const dateChanged = date && new Date(date).getTime() !== new Date(event.date).getTime();
    const timeChanged = time && time !== event.time;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.coverImage = coverImageUrl;

    await event.save();

    // Notify registered students if date or time changed
    if ((dateChanged || timeChanged) && event.attendees.length > 0) {
        const notifications = event.attendees.map(userId => ({
            user: userId,
            event: event._id,
            category: 'update',
            title: "Event Schedule Changed",
            message: `The schedule for "${event.title}" has been updated to ${new Date(event.date).toLocaleDateString()} at ${event.time}.`,
            type: "warning"
        }));
        const alerts = await Alert.insertMany(notifications);
        
        // Emit notifications to each student
        alerts.forEach(alert => {
            emitNotification(alert.user, alert);
        });
    }

    return res.status(200).json(
        new ApiResponse(200, event, "Event updated successfully")
    );
});

export {
    createEvent,
    getAllEvents,
    getEventById,
    joinEvent,
    leaveEvent,
    deleteEvent,
    updateEvent
};
