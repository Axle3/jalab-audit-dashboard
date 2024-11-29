import { saveAs } from 'file-saver';

export interface RecordData {
  date: string;
  department: string;
  cash?: number;
  pos?: number;
  transfer?: number;
  total?: number;
}

export const generateCSV = (data: RecordData[], filename: string) => {
  const headers = ['Date', 'Department', 'Cash', 'POS', 'Transfer', 'Total'];
  const csvContent = [
    headers.join(','),
    ...data.map(record => [
      record.date,
      record.department,
      record.cash || 0,
      record.pos || 0,
      record.transfer || 0,
      record.total || 0
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}.csv`);
};

export const filterDataByDateRange = (
  data: RecordData[],
  startDate: Date,
  endDate: Date
) => {
  return data.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
};