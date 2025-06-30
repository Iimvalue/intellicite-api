// routes/userHistory.routes.ts
import express from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getUserSearchHistory,
  addUserSearchHistory,
  deleteSingleSearchHistory,
} from "../controllers/userHistory.controller";

const router = express.Router();

router.get("/", authenticate, getUserSearchHistory);
router.post("/", authenticate, addUserSearchHistory);
router.delete("/:historyId", authenticate, deleteSingleSearchHistory);

export default router;
