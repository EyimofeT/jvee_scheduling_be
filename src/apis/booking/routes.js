import express from "express";
// import {
// } from "./middleware.js";
import {
    get_services, post_leads , get_available_time , post_newsletter, reserve_available_time
} from "./controller.js";

const router = express.Router();

router.get("/services", get_services)
router.post("/leads", post_leads)

router.post("/available_time", get_available_time)
router.post("/available_time/book", reserve_available_time)

router.post("/newsletter", post_newsletter)

export default router;

