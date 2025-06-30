import { Project, SalaryCalculation } from '../types/project';
import { calculateWorkingDays, calculateTotalDays } from './dateUtils';

export const calculateProjectSalary = (
  project: Project, 
  index: number, 
  firstProjectHourlyRate: number, 
  secondProjectHourlyRate: number,
  firstProjectOTHours: number = 0
): SalaryCalculation => {
  const totalDays = calculateTotalDays(project.startDate, project.endDate);
  const workingDays = calculateWorkingDays(project.startDate, project.endDate);
  const workingHours = workingDays * 8;
  
  const isFirstProject = index === 0;
  const hourlyRate = isFirstProject ? firstProjectHourlyRate : secondProjectHourlyRate;
  const regularPay = hourlyRate * workingHours;
  
  let otHours = 0;
  let otPay = 0;
  if (isFirstProject && firstProjectOTHours > 0) {
    otHours = firstProjectOTHours;
    otPay = firstProjectOTHours * firstProjectHourlyRate;
  }
  
  const totalSalary = regularPay + otPay;

  return {
    totalDays,
    workingDays,
    workingHours,
    hourlyRate,
    regularPay,
    otHours,
    otPay,
    totalSalary
  };
};

export const calculateMonthlyRates = (workingDays: number) => {
  const firstProjectDailyRate = 20000 / workingDays;
  const firstProjectHourlyRate = firstProjectDailyRate / 8;
  const secondProjectDailyRate = 10000 / workingDays;
  const secondProjectHourlyRate = secondProjectDailyRate / 8;
  
  return {
    firstProjectDailyRate,
    firstProjectHourlyRate,
    secondProjectDailyRate,
    secondProjectHourlyRate
  };
};