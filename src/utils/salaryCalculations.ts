import { Project, SalaryCalculation } from '../types/project';
import { calculateWorkingDays, calculateTotalDays } from './dateUtils';

export const calculateProjectSalary = (
  project: Project, 
  firstProjectHourlyRate: number, 
  secondProjectHourlyRate: number,
  firstProjectOTHours: number = 0
): SalaryCalculation => {
  const totalDays = calculateTotalDays(project.startDate, project.endDate);
  const workingDays = calculateWorkingDays(project.startDate, project.endDate);
  const workingHours = workingDays * 8;
  
  // Only the original first project (position 1) gets the ₱20k rate
  // If the first project is deleted, the ₱20k rate is permanently lost
  // All other projects (position 2+) always get the ₱10k rate
  const isFirstProject = project.position === 1;
  const hourlyRate = isFirstProject ? firstProjectHourlyRate : secondProjectHourlyRate;
  const regularPay = hourlyRate * workingHours;
  
  let otHours = 0;
  let otPay = 0;
  // Only the original first project can have overtime hours
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

// Helper function to calculate salaries for all projects with fixed rate assignment
export const calculateAllProjectSalaries = (
  projects: Project[],
  firstProjectHourlyRate: number,
  secondProjectHourlyRate: number,
  overtimeHours: number
): SalaryCalculation[] => {
  // Only calculate salaries for active (non-disbanded) projects
  const activeProjects = projects.filter(project => !project.disbanded);
  return activeProjects.map(project => 
    calculateProjectSalary(project, firstProjectHourlyRate, secondProjectHourlyRate, overtimeHours)
  );
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