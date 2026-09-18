import {Router} from "express"
import authorize from "../middlewares/auth.middleware.js";
import { addTestimonial, deleteTestimonial, getActiveTestimonials, getAllTestimonials, updateTestimonial } from "../controllers/testimonial.controller.js";

const testimonialRouter = new Router();

testimonialRouter.get('/active', getActiveTestimonials);

testimonialRouter.get('/', authorize,  getAllTestimonials);

testimonialRouter.post('/', authorize,  addTestimonial);

testimonialRouter.put('/:id', authorize,  updateTestimonial);

testimonialRouter.delete('/:id', authorize,  deleteTestimonial);

export default testimonialRouter;