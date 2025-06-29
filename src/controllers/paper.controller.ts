import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { Paper, IPaper } from "../models/papers.model";

export const getPapers = async (req: Request, res: Response): Promise<void> => {
  try {
    const papers = await Paper.find();
    res.status(200).json({ success: true, data: papers });
  } catch (error) {
    console.error("Get papers error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPaperById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }
    res.status(200).json({ success: true, data: paper });
  } catch (error) {
    console.error("Get paper by id error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createOrFindPaper = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const paperData: Partial<IPaper> = req.body;

    if (!paperData.doi && !paperData.title) {
      res.status(400).json({ success: false, message: "DOI or title is required" });
      return;
    }

    const query: any = paperData.doi ? { doi: paperData.doi } : { title: paperData.title };
    let existing = await Paper.findOne(query);

    if (existing) {
      res.status(200).json({ success: true, message: "Paper already exists", data: existing });
      return;
    }

    const requiredFields = ["title", "authors", "publicationDate", "journal", "summary", "pdfLink", "sourceLink"];
    for (const field of requiredFields) {
      if (!paperData[field as keyof IPaper]) {
        res.status(400).json({ success: false, message: `Missing field: ${field}` });
        return;
      }
    }

    const paper = new Paper(paperData);
    await paper.save();

    res.status(201).json({ success: true, message: "Paper saved", data: paper });
  } catch (error) {
    console.error("Create or find paper error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatePaper = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updated = await Paper.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Paper updated successfully", data: updated });
  } catch (error) {
    console.error("Update paper error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deletePaper = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const deleted = await Paper.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Paper not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Paper deleted successfully" });
  } catch (error) {
    console.error("Delete paper error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};