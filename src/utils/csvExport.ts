import { saveAs } from 'file-saver';

export interface RecordData {
  date: string;
  department: string;
  revenue: number;
  expenses?: number;
}

export const generateCSV = (data: RecordData[], filename: string) => {
  const headers = ['Date', 'Department', 'Revenue', 'Expenses'];
  const csvContent = [
    headers.join(','),
    ...data.map(record => [
      record.date,
      record.department,
      record.revenue,
      record.expenses || 0
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