/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Calendar } from 'lucide-react';
import { Project, ReimbursementItem, SalaryCalculation } from './types/project';
import { getCurrentMonthInfo, calculateWorkingDaysInMonth } from './utils/dateUtils';
import { calculateMonthlyRates, calculateAllProjectSalaries } from './utils/salaryCalculations';
import RateCard from './components/RateCard';
import ProjectForm from './components/ProjectForm';
import ProjectList from './components/ProjectList';
import OvertimeForm from './components/OvertimeForm';
import ReimbursementPanel from './components/ReimbursementPanel';
import SalaryTable from './components/SalaryTable';
import SummaryTable from './components/SummaryTable';
import PrintableBreakdown from './components/PrintableBreakdown';

function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reimbursements, setReimbursements] = useState<ReimbursementItem[]>([]);
const [overtimeHours, setOvertimeHours] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [nextPosition, setNextPosition] = useState<number>(1); // Track next project position
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Custom date selection
  const [useCustomDate, setUseCustomDate] = useState<boolean>(false); // Toggle between auto and custom
  
  // Get month info based on selected mode
  const monthInfo = useCustomDate 
    ? (() => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const workingDays = calculateWorkingDaysInMonth(year, month);
        return { year, month, monthName, workingDays };
      })()
    : getCurrentMonthInfo();
    
  const rates = calculateMonthlyRates(monthInfo.workingDays);
  
  // Calculate salary for each project based on original creation order
  // Only the first project created (position 1) gets the ₱20,000/month rate
  // All subsequent projects (position 2+) get the ₱10,000/month rate
  // If the first project is deleted, the ₱20k rate is permanently lost
  const salaryCalculations: SalaryCalculation[] = calculateAllProjectSalaries(
    projects,
    rates.firstProjectHourlyRate,
    rates.secondProjectHourlyRate,
    overtimeHours ?? 0
  );


  const totalRegularPay = salaryCalculations.reduce((sum, calc) => sum + calc.regularPay, 0);
  const totalOTPay = salaryCalculations.reduce((sum, calc) => sum + calc.otPay, 0);
  const totalSalary = totalRegularPay + totalOTPay;
  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);


  const handleAddProject = (projectData: Omit<Project, 'id' | 'position' | 'disbanded'>) => {
    if (editingProject) {
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...editingProject, ...projectData }
          : p
      ));
      setEditingProject(null);
    } else {
      const newProject: Project = {
        ...projectData,
        id: Date.now(),
        position: nextPosition, // Assign the next available position
        disbanded: false // New projects start as active
      };
      setProjects([...projects, newProject]);
      setNextPosition(nextPosition + 1); // Increment for next project
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjects(projects.filter(p => p.id !== project.id));
  };

  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleDisbandProject = (id: number) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, disbanded: true } : p
    ));
  };

  const handleReactivateProject = (id: number) => {
    setProjects(projects.map(p => 
      p.id === id ? { ...p, disbanded: false } : p
    ));
  };

  const handleAddReimbursement = (reimbursementData: Omit<ReimbursementItem, 'id'>) => {
    const newReimbursement: ReimbursementItem = {
      ...reimbursementData,
      id: Date.now()
    };
    setReimbursements([...reimbursements, newReimbursement]);
  };

  const handleRemoveReimbursement = (id: number) => {
    setReimbursements(reimbursements.filter(r => r.id !== id));
  };

  const handleEditReimbursement = (updatedReimbursement: ReimbursementItem) => {
    setReimbursements(reimbursements.map(r => 
      r.id === updatedReimbursement.id ? updatedReimbursement : r
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex justify-center items-center mb-4 w-16 h-16 text-white bg-red-600 rounded-full shadow-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-red-600 transition-all duration-300 md:text-5xl hover:text-shadow-lg">
            Rooche Digital Representative
          </h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 md:text-3xl">
            Salary Calculator
          </h2>
          <div className="flex gap-2 justify-center items-center text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">Current Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Date Selection */}
        <div className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200 shadow-lg">
          <h3 className="mb-4 text-xl font-semibold text-blue-600">Date Selection</h3>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex gap-3 items-center">
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  type="radio"
                  name="dateMode"
                  checked={!useCustomDate}
                  onChange={() => setUseCustomDate(false)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Auto-detect current month</span>
              </label>
            </div>
            <div className="flex gap-3 items-center">
              <label className="flex gap-2 items-center cursor-pointer">
                <input
                  type="radio"
                  name="dateMode"
                  checked={useCustomDate}
                  onChange={() => setUseCustomDate(true)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">Custom date:</span>
              </label>
              <input
                type="month"
                value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}`}
                onChange={(e) => {
                  const [year, month] = e.target.value.split('-');
                  setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, 1));
                }}
                disabled={!useCustomDate}
                className="px-3 py-2 rounded-lg border border-gray-300 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
          <div className="mt-3 text-sm text-gray-600">
            {useCustomDate ? (
              <span>Using custom date: <strong>{monthInfo.monthName}</strong></span>
            ) : (
              <span>Using current month: <strong>{monthInfo.monthName}</strong></span>
            )}
          </div>
        </div>

        {/* Monthly Rate Information */}
        <div className="p-8 mb-8 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 shadow-lg transition-all duration-300 hover:shadow-xl">
          <h3 className="mb-6 text-2xl font-semibold text-red-600">{useCustomDate ? 'Selected' : 'Current'} Month Rate Calculation</h3>
          <div className="mb-6">
            <p className="text-lg text-gray-700">
              <strong>{monthInfo.monthName}</strong> has <strong className="text-xl text-red-600">{monthInfo.workingDays} working days</strong> (excluding weekends)
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RateCard
              title="First Project"
              monthlyRate={20000}
              dailyRate={rates.firstProjectDailyRate}
              hourlyRate={rates.firstProjectHourlyRate}
              isPrimary={true}
            />
            <RateCard
              title="2nd & Succeeding Projects"
              monthlyRate={10000}
              dailyRate={rates.secondProjectDailyRate}
              hourlyRate={rates.secondProjectHourlyRate}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8 xl:grid-cols-2">
          {/* Project Management */}
          <div className="space-y-8">
            <ProjectForm
              onAddProject={handleAddProject}
              editingProject={editingProject}
              onCancelEdit={() => setEditingProject(null)}
            />

            <div>
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Projects List</h3>
              <ProjectList
                projects={projects}
                onEditProject={handleEditProject}
                onRemoveProject={handleRemoveProject}
                onDisbandProject={handleDisbandProject}
                onReactivateProject={handleReactivateProject}
              />
            </div>

            <OvertimeForm
              overtimeHours={overtimeHours ?? 0}
              onOvertimeChange={setOvertimeHours}
              hourlyRate={rates.firstProjectHourlyRate}
            />
          </div>

          {/* Reimbursement Panel */}
          <div>
            <ReimbursementPanel
              reimbursements={reimbursements}
              onAddReimbursement={handleAddReimbursement}
              onRemoveReimbursement={handleRemoveReimbursement}
              onEditReimbursement={handleEditReimbursement}
            />
          </div>
        </div>

        {/* Salary Tables */}
        {projects.length > 0 && (
          <div className="space-y-8">
            <div>
              <h3 className="mb-6 text-2xl font-semibold text-gray-800">Salary Breakdown</h3>
              <SalaryTable
                projects={projects}
                calculations={salaryCalculations}
                totalRegularPay={totalRegularPay}
                totalOTPay={totalOTPay}
                totalSalary={totalSalary}
              />
            </div>

            <div>
              <h3 className="mb-6 text-2xl font-semibold text-gray-800">Summary by Project Category</h3>
              <SummaryTable
                projects={projects}
                calculations={salaryCalculations}
                totalReimbursements={totalReimbursements}
              />
            </div>

            {/* Print Button */}
            <div className="pt-8 text-center">
              <button
                onClick={() => setShowBreakdown(true)}
                className="flex gap-3 items-center px-8 py-4 mx-auto text-lg font-medium text-white bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl transition-all duration-200 hover:from-gray-800 hover:to-gray-900 hover:-translate-y-2 hover:shadow-2xl"
              >
                <FileText className="w-6 h-6" />
                View Printable Breakdown
              </button>
            </div>
          </div>
        )}

        {/* Printable Breakdown Modal */}
        <PrintableBreakdown
          isOpen={showBreakdown}
          onClose={() => setShowBreakdown(false)}
          projects={projects}
          calculations={salaryCalculations}
          reimbursements={reimbursements}
          monthInfo={monthInfo}
          rates={rates}
        />
      </div>
    </div>
  );
}

export default App;