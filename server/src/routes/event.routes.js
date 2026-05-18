import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    createEvent, 
    getAllEvents, 
    getEventById, 
    joinEvent,
    leaveEvent, 
    deleteEvent,
    updateEvent,
    checkInEvent,
    getLobbyMessages
} from "../controllers/event.controller.js";
import { addReview, getEventReviews } from "../controllers/review.controller.js";

const router = Router();


router.route('/').get(getAllEvents);
router.route('/:id').get(getEventById);
router.route('/:eventId/reviews').get(getEventReviews);

router.use(verifyJWT);

router.route('/').post(upload.single('coverImage'), createEvent);
router.route('/:id/join').post(joinEvent);
router.route('/:id/leave').post(leaveEvent);
router.route('/:id/checkin').post(checkInEvent);
router.route('/:id/lobby').get(getLobbyMessages);
router.route('/:id').delete(deleteEvent).patch(upload.single('coverImage'), updateEvent);
router.route('/:eventId/reviews').post(addReview);

export default router;
