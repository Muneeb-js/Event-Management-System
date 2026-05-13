import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Event } from '../models/event.model.js';
import { Review } from '../models/review.model.js';

const addReview = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
        throw new ApiError(400, "Rating and comment are required");
    }

    const event = await Event.findById(eventId);
    if (!event) {
        throw new ApiError(404, "Event not found");
    }


    if (!event.attendees.includes(req.user._id)) {
        throw new ApiError(403, "You must attend the event to review it");
    }


    const eventDateTime = new Date(`${event.date.toISOString().split('T')[0]}T${event.time}`);
    const now = new Date();

    

    const eventDateStr = event.date.toISOString().split('T')[0];
    const eventFullDateTime = new Date(`${eventDateStr}T${event.time}`);
    

    if (eventFullDateTime > now) {
         throw new ApiError(400, "You can only review after the event has happened");
    }

    const existingReview = await Review.findOne({ event: eventId, user: req.user._id });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this event");
    }

    const review = await Review.create({
        event: eventId,
        user: req.user._id,
        rating,
        comment
    });

    return res.status(201).json(
        new ApiResponse(201, review, "Review added successfully")
    );
});

const getEventReviews = asyncHandler(async (req, res) => {
    const { eventId } = req.params;
    
    const reviews = await Review.find({ event: eventId })
        .populate('user', 'fullName avatar')
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, reviews, "Reviews fetched successfully")
    );
});

export { addReview, getEventReviews };
