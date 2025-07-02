
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
  getUserSearchHistoryService,
  getSingleSearchHistoryService,
  addUserSearchHistoryService,
  deleteSingleSearchHistoryService
} from '../services/userHistory.service';

 // retrieves the last 10 search history entries for the authenticated user.

export const getUserSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const history = await getUserSearchHistoryService(userId);
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching user search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


 // retrieves a single search history entry by its ID for the authenticated user.
 
export const getSingleSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const { historyId } = req.params;
    const entry = await getSingleSearchHistoryService(userId, historyId);
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

 // saves a new search query to the authenticated user's history.

 export const addUserSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ message: "Query is required" });
      return;
    }
    const newHistory = await addUserSearchHistoryService(userId, query);
    res.status(201).json(newHistory);
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 // deletes a specific search history entry by its ID for the authenticated user.

 export const deleteSingleSearchHistory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { historyId } = req.params;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized: User ID not found" });
      return;
    }
    const deleted = await deleteSingleSearchHistoryService(userId, historyId);
    if (!deleted) {
      res.status(404).json({ message: "History entry not found" });
      return;
    }
    res.status(200).json({ success: true, message: "History entry deleted" });
  } catch (error) {
    console.error("Error deleting search history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};