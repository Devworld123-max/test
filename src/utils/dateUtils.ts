/* eslint-disable @typescript-eslint/no-unused-vars */
export const getOrdinalSuffix = (number: number): string => {
  const j = number % 10;
  const k = number % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
};

export const calculateWorkingDaysInMonth = (year: number, month: number): number => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let count = 0;
  
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  return count;
};

export const calculateWorkingDays = (startDate: string, endDate: string): number => {
  let count = 0;
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return count;
};

export const calculateTotalDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays;
};

export const getCurrentMonthInfo = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const workingDays = calculateWorkingDaysInMonth(year, month);
  
  return { year, month, monthName, workingDays };
};

export const getMonthInfoForDate = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const workingDays = calculateWorkingDaysInMonth(year, month);

  return { year, month, monthName, workingDays };
};
