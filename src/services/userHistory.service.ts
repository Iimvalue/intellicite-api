import { UserHistory } from '../models/userHistory.model';

// get the last 10 search history entries for a user
export async function getUserSearchHistoryService(userId: string) {
  try {
    return await UserHistory.find({ userId })
      .populate('results')
      .sort({ createdAt: -1 })
      .limit(10);
  } catch (error) {
    console.error('Error in getting user search history:', error);
    throw error;
  }
}

// get a single search history entry by its ID for a user
export async function getSingleSearchHistoryService(
  userId: string,
  historyId: string
) {
  try {
    return await UserHistory.findOne({ _id: historyId, userId })
      .populate('results');
  } catch (error) {
    console.error('Error in getting single search history:', error);
    throw error;
  }
}

// add a new search history entry for a user
export async function addUserSearchHistoryService(
  userId: string,
  query: string,
  results?: any[]
) {
  try {
    return await UserHistory.create({
      userId,
      query,
      results: results || [],
    });
  } catch (error) {

    console.error('Error in adding user search history:', error);
    throw error;
  }
}

// delete a specific search history entry by its ID for a user
export async function deleteSingleSearchHistoryService(
  userId: string,
  historyId: string
) {
  try {
    return await UserHistory.findOneAndDelete({
      _id: historyId,
      userId,
    });
  } catch (error) {


    console.error('Error in deleting single search history:', error);
    throw error;
  }
}
