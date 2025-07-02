import { UserHistory } from '../models/userHistory.model';

// get the last 10 search history entries for a user
export async function getUserSearchHistoryService(userId: string) {
  return await UserHistory.find({ userId })
    .populate('retrievedPaperIds')
    .sort({ searchedAt: -1 })
    .limit(10);
}

// get a single search history entry by its ID for a user
export async function getSingleSearchHistoryService(
  userId: string,
  historyId: string
) {
  return await UserHistory.findOne({ _id: historyId, userId }).populate('retrievedPaperIds');
}

// add a new search history entry for a user
export async function addUserSearchHistoryService(
  userId: string,
  query: string
) {
  return await UserHistory.create({
    userId,
    query,
    retrievedPaperIds: [],
  });
}

// delete a specific search history entry by its ID for a user
export async function deleteSingleSearchHistoryService(
  userId: string,
  historyId: string
) {
  return await UserHistory.findOneAndDelete({
    _id: historyId,
    userId,
  });
}
