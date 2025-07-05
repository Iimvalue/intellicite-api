import { PaperReport } from '../../models/paperReport.model';

export const getAllPaperReports = async () => {
  return await PaperReport.find().populate('userId', 'name email').populate('paperId', 'title');
};
