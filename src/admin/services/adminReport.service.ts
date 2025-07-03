import { PaperReport } from '../../models/PaperReport.model';

export const getAllPaperReports = async () => {
  return await PaperReport.find().populate('userId', 'name email').populate('paperId', 'title');
};
