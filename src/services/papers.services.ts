import { Paper, IPaper } from '../models/papers.model';

export const findOrCreatePaper = async (paperData: Partial<IPaper>): Promise<IPaper> => {
  const query: any = {};
  if (paperData.doi) query.doi = paperData.doi;
  else if (paperData.title) query.title = new RegExp(`^${paperData.title}$`, 'i');

  let paper = await Paper.findOne(query);
  if (paper) return paper;

  paper = new Paper(paperData);
  return await paper.save();
};

export const getAllPapers = async (): Promise<IPaper[]> => {
  return await Paper.find();
};

export const getPaperById = async (id: string): Promise<IPaper | null> => {
  return await Paper.findById(id);
};

export const updatePaperById = async (
  id: string,
  update: Partial<IPaper>
): Promise<IPaper | null> => {
  return await Paper.findByIdAndUpdate(id, update, { new: true });
};

export const deletePaperById = async (id: string): Promise<boolean> => {
  const result = await Paper.findByIdAndDelete(id);
  return result !== null;
};