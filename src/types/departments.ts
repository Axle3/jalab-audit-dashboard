export interface DailyRecord {
  id: string;
  date: string;
  cash: number;
  pos: number;
  transfer: number;
  debt?: number;
  debtorName?: string;
  debtorLocation?: string;
  department: Department;
  total: number;
}

export interface DrinkStock {
  id: string;
  name: string;
  price: number;
  previousStock: number;
  currentStock: number;
  unitsSold: number;
}

export type Department = 'hotel' | 'laundry' | 'restaurant' | 'bar';