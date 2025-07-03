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
      res.status(401).json({ 
        success: false, 
        message: "unauthorized: user id not found" 
      });
      return;
    }
    
    const history = await getUserSearchHistoryService(userId);
    res.status(200).json({
      success: true,
      message: "search history retrieved successfully",
      data: history
    });
  } catch (error) {
    console.error("Error fetching user search history:", error);
    res.status(500).json({ 
      success: false, 
      message: "internal server error" 
    });
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
      res.status(401).json({ 
        success: false, 
        message: "unauthorized: user id not found" 
      });
      return;
    }
    
    const { historyId } = req.params;
    if (!historyId) {
      res.status(400).json({ 
        success: false, 
        message: "history id is required" 
      });
      return;
    }
    
    const entry = await getSingleSearchHistoryService(userId, historyId);
    if (!entry) {
      res.status(404).json({ 
        success: false, 
        message: "history entry not found" 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: "search history entry retrieved successfully",
      data: entry
    });
  } catch (error) {
    console.error("Error fetching single search history:", error);
    res.status(500).json({ 
      success: false, 
      message: "internal server error" 
    });
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
      res.status(401).json({ 
        success: false, 
        message: "unauthorized: user id not found" 
      });
      return;
    }
    
    const { query, results } = req.body;
    if (!query) {
      res.status(400).json({ 
        success: false, 
        message: "query is required" 
      });
      return;
    }
    
    const newHistory = await addUserSearchHistoryService(userId, query, results);
    
    if (!newHistory) {
      res.status(400).json({ 
        success: false, 
        message: "failed to save search history" 
      });
      return;
    }
    
    res.status(201).json({
      success: true,
      message: "search history saved successfully",
      data: newHistory
    });
  } catch (error) {
    console.error("Error saving search history:", error);
    res.status(500).json({ 
      success: false, 
      message: "internal server error" 
    });
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
      res.status(401).json({ 
        success: false, 
        message: "unauthorized: user id not found" 
      });
      return;
    }
    
    if (!historyId) {
      res.status(400).json({ 
        success: false, 
        message: "history id is required" 
      });
      return;
    }
    
    const deleted = await deleteSingleSearchHistoryService(userId, historyId);
    if (!deleted) {
      res.status(404).json({ 
        success: false, 
        message: "history entry not found" 
      });
      return;
    }
    
    res.status(200).json({ 
      success: true, 
      message: "history entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting search history:", error);
    res.status(500).json({ 
      success: false, 
      message: "internal server error" 
    });
  }
};