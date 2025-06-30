import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserHistory } from "../models/userHistory.model";

/**
 * Get search history for the authenticated user
 */
export const getUserSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const history = await UserHistory.find({ userId })
      .sort({ searchedAt: -1 })
      .limit(20);

    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching user search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Save a new search query
 */
export const addUserSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const { query } = req.body;

    if (!query) {
      res.status(400).json({ message: "Query is required" });
      return;
    }

    const newHistory = await UserHistory.create({
      userId,
      query,
      retrievedPaperIds: [],
    });

    res.status(201).json(newHistory);
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
