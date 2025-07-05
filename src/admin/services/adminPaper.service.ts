import { PaperCollection } from '../../models/paper.model';

export const deletePaperById = async (id: string) => {
  return await PaperCollection.findByIdAndDelete(id);
};

export const getAllPapers = async () => {
  return await PaperCollection.find();
};
