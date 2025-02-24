import express from "express";
import { getMetrics } from "../middlewares";

const router = express.Router();

router.get("/metrics", getMetrics);

export default router;
