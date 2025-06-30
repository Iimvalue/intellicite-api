import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserHistory } from "../models/userHistory.model";

/**
 * Retrieves the last 20 search history entries for the authenticated user.
 * Useful for showing user's recent search queries.
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
 * Retrieves a single search history entry by its ID for the authenticated user.
 * Useful for viewing details of a specific past search.
 */
export const getSingleSearchHistory = async (
    req: AuthRequest,
    res: Response
  ): Promise<void> => {
    try {
        const userId = req.user?.id;
        const { historyId } = req.params;
  
      const entry = await UserHistory.findOne({ _id: historyId, userId });
  
      if (!entry) {
        res.status(404).json({ message: "History entry not found" });
        return;
      }
  
      res.status(200).json(entry);
    } catch (error) {
      console.error("Error fetching single search history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

/**
 * Saves a new search query to the authenticated user's history.
 * This helps keep track of user's search activity for later retrieval.
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
    res.status(500).json({  message: "Internal server error" });
  }
};

/**
 * Deletes a specific search history entry by its ID for the authenticated user.
 * Allows user to remove unwanted or outdated search records.
 */
export const deleteSingleSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { historyId } = req.params;

    const deleted = await UserHistory.findOneAndDelete({
      _id: historyId,
      userId,
    });

    if (!deleted) {
      res.status(404).json({ message: "History entry not found" });
      return;
    }

    res.status(200).json({success: true, message: "History entry deleted" });
  } catch (error) {
    console.error("Error deleting search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};