import { Bookmark, IBookmark } from '../models/bookmark.model';

export const saveBookmark = async (
  userId: string,
  paperId: string,
  personalNotes: string
): Promise<IBookmark> => {
  const existing = await Bookmark.findOne({ userId, paperId });
  if (existing) {
    existing.personalNotes = personalNotes;
    await existing.save();
    return existing;
  }
  // no need to cast the id as object mongoose does this on its own
  const bookmark = new Bookmark({ userId, paperId, personalNotes });
  return await bookmark.save();
};

export const removeBookmark = async (
  userId: string,
  paperId: string
): Promise<boolean> => {
  const result = await Bookmark.deleteOne({ userId, paperId });
  return result.deletedCount === 1;
};

export const getBookmarksByUser = async (
  userId: string
): Promise<IBookmark[]> => {
  return await Bookmark.find({ userId }).populate('paperId').sort({ createdAt: -1 }).lean();
};

export const updateBookmarkNotes = async (
  userId: string,
  paperId: string,
  personalNotes: string
): Promise<IBookmark | null> => {
  const bookmark = await Bookmark.findOne({ userId, paperId });
  if (!bookmark) return null;

  bookmark.personalNotes = personalNotes;
  return await bookmark.save();
};
