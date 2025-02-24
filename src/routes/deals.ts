import express from "express";
import { getDeals, postDeals, updateDeal, } from "../api/deals";

const router = express.Router();

router.get("/deals", getDeals);
router.post("/deals", postDeals);
router.put("/deals/:id", updateDeal);

export default router;