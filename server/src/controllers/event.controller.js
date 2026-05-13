import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Event } from '../models/event.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
        organizer: req.user._id
    });

    return res.status(201).json(
        new ApiResponse(201, event, "Event created successfully")
    );
});
const getAllEvents = asyncHandler(async (req, res) => {
    const { search, category, department, location, startDate, endDate } = req.query;
    let query = {};
    
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
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

    if (req.query.myEvents === 'true' && req.user) {
        if (req.user.role === 'teacher') {
            query.organizer = req.user._id;
        } else if (req.user.role === 'student') {
            query.attendees = req.user._id;
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

    if (event.attendees.includes(req.user._id)) {
        throw new ApiError(400, "You have already joined this event");
    }

    event.attendees.push(req.user._id);
    await event.save();

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

    if (!event.attendees.includes(req.user._id)) {
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

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.coverImage = coverImageUrl;

    await event.save();

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
