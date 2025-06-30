import React, { useState, useEffect } from 'react';
import { Calculator, FileText, Calendar } from 'lucide-react';
import { Project, ReimbursementItem, SalaryCalculation } from './types/project';
import { getCurrentMonthInfo } from './utils/dateUtils';
import { calculateMonthlyRates, calculateProjectSalary } from './utils/salaryCalculations';
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
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  const monthInfo = getCurrentMonthInfo();
  const rates = calculateMonthlyRates(monthInfo.workingDays);
  
  // Calculate salary for each project
  const salaryCalculations: SalaryCalculation[] = projects.map((project, index) =>
    calculateProjectSalary(project, index, rates.firstProjectHourlyRate, rates.secondProjectHourlyRate, overtimeHours)
  );

  const totalRegularPay = salaryCalculations.reduce((sum, calc) => sum + calc.regularPay, 0);
  const totalOTPay = salaryCalculations.reduce((sum, calc) => sum + calc.otPay, 0);
  const totalSalary = totalRegularPay + totalOTPay;
  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
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
        id: Date.now()
      };
      setProjects([...projects, newProject]);
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjects(projects.filter(p => p.id !== project.id));
  };

  const handleRemoveProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id));
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full mb-4 shadow-lg">
            <Calculator className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4 hover:text-shadow-lg transition-all duration-300">
            Rooche Digital Representative
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Salary Calculator
          </h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-lg">Current Date: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', month: 'long', day: 'numeric' 
            })}</span>
          </div>
        </div>

        {/* Monthly Rate Information */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200 mb-8 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-semibold text-red-600 mb-6">Current Month Rate Calculation</h3>
          <div className="mb-6">
            <p className="text-lg text-gray-700">
              <strong>{monthInfo.monthName}</strong> has <strong className="text-red-600 text-xl">{monthInfo.workingDays} working days</strong> (excluding weekends)
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Project Management */}
          <div className="space-y-8">
            <ProjectForm
              onAddProject={handleAddProject}
              editingProject={editingProject}
              onCancelEdit={() => setEditingProject(null)}
            />

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Projects List</h3>
              <ProjectList
                projects={projects}
                onEditProject={handleEditProject}
                onRemoveProject={handleRemoveProject}
              />
            </div>

            <OvertimeForm
              overtimeHours={overtimeHours}
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
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Salary Breakdown</h3>
              <SalaryTable
                projects={projects}
                calculations={salaryCalculations}
                totalRegularPay={totalRegularPay}
                totalOTPay={totalOTPay}
                totalSalary={totalSalary}
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Summary by Project Category</h3>
              <SummaryTable
                projects={projects}
                calculations={salaryCalculations}
                totalReimbursements={totalReimbursements}
              />
            </div>

            {/* Print Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => setShowBreakdown(true)}
                className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-200 hover:from-gray-800 hover:to-gray-900 hover:-translate-y-2 hover:shadow-2xl flex items-center gap-3 mx-auto"
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