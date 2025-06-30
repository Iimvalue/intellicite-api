import { CiteCheck } from '../models/citeCheck.model';

export const saveCiteCheckResult = async (data: {
  userId: string;
  query: string;
  paperId: string;
  score: number;
  aiSummary: string;
}) => {
  return await CiteCheck.create(data);
};

export const getCiteCheckById = async (userId: string, checkId: string) => {
  return await CiteCheck.findOne({ _id: checkId, userId }).populate('paperId');
};

export const getUserCiteChecks = async (userId: string) => {
  return await CiteCheck.find({ userId }).sort({ checkedAt: -1 }).populate('paperId');
};