import { SavedPaper, ISavedPaper } from '../models/savedPaper.model';

export const savePaper = async (
  userId: string,
  paperId: string,
  personalNotes: string
): Promise<ISavedPaper> => {
  const existing = await SavedPaper.findOne({ userId, paperId });
  if (existing) {
    existing.personalNotes = personalNotes;
    await existing.save();
    return existing;
  }
// no need to cast the id as object mongoose does this on its own
  const savedPaper = new SavedPaper({ userId, paperId, personalNotes });

  return await savedPaper.save();
};

export const removeSavedPaper = async (
  userId: string,
  paperId: string
): Promise<boolean> => {
  const result = await SavedPaper.deleteOne({ userId, paperId });
  return result.deletedCount === 1;
};

export const getSavedPapersByUser = async (
  userId: string
): Promise<ISavedPaper[]> => {
  return await SavedPaper.find({ userId }).populate('paperId').sort({ savedAt: -1 }).lean();
};

export const updatePersonalNotes = async (
  userId: string,
  paperId: string,
  personalNotes: string
): Promise<ISavedPaper | null> => {
  const savedPaper = await SavedPaper.findOne({ userId, paperId });
  if (!savedPaper) return null;

  savedPaper.personalNotes = personalNotes;
  return await savedPaper.save();
};
