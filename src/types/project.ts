export interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  position: number; // Original creation order (1st, 2nd, 3rd, etc.)
  disbanded: boolean; // Whether the project has been disbanded
}

export interface ReimbursementItem {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: 'transportation' | 'meals' | 'supplies' | 'communication' | 'other';
}

export interface SalaryCalculation {
  totalDays: number;
  workingDays: number;
  workingHours: number;
  hourlyRate: number;
  regularPay: number;
  otHours: number;
  otPay: number;
  totalSalary: number;
}