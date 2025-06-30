import React from 'react';
import { Project, SalaryCalculation } from '../types/project';
import { getOrdinalSuffix } from '../utils/dateUtils';

interface SalaryTableProps {
  projects: Project[];
  calculations: SalaryCalculation[];
  totalRegularPay: number;
  totalOTPay: number;
  totalSalary: number;
}

const SalaryTable: React.FC<SalaryTableProps> = ({
  projects,
  calculations,
  totalRegularPay,
  totalOTPay,
  totalSalary
}) => {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-red-600 text-white">
            <th className="px-4 py-4 text-left font-semibold">Project Name</th>
            <th className="px-4 py-4 text-left font-semibold">Start Date</th>
            <th className="px-4 py-4 text-left font-semibold">End Date</th>
            <th className="px-4 py-4 text-left font-semibold">Total Days</th>
            <th className="px-4 py-4 text-left font-semibold">Working Days</th>
            <th className="px-4 py-4 text-left font-semibold">Working Hours</th>
            <th className="px-4 py-4 text-left font-semibold">Hourly Rate</th>
            <th className="px-4 py-4 text-left font-semibold">Regular Pay</th>
            <th className="px-4 py-4 text-left font-semibold">OT Hours</th>
            <th className="px-4 py-4 text-left font-semibold">OT Pay</th>
            <th className="px-4 py-4 text-left font-semibold">Total Salary</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => {
            const calc = calculations[index];
            const projectNumber = index + 1;
            const suffix = getOrdinalSuffix(projectNumber);
            
            return (
              <tr 
                key={project.id} 
                className={`
                  border-b border-gray-200 transition-all duration-200 hover:bg-red-50 hover:scale-[1.01]
                  ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                `}
              >
                <td className="px-4 py-4 font-medium text-gray-800">
                  {project.name} <span className="text-red-600">({projectNumber}{suffix} Project)</span>
                </td>
                <td className="px-4 py-4 text-gray-600">{new Date(project.startDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-gray-600">{new Date(project.endDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 text-gray-600">{calc.totalDays} days</td>
                <td className="px-4 py-4 text-gray-600">{calc.workingDays} days</td>
                <td className="px-4 py-4 text-gray-600">{calc.workingHours} hours</td>
                <td className="px-4 py-4 text-gray-600">₱{calc.hourlyRate.toFixed(2)}/hour</td>
                <td className="px-4 py-4 font-medium text-green-600">₱{calc.regularPay.toFixed(2)}</td>
                <td className="px-4 py-4 text-gray-600">{calc.otHours} hours</td>
                <td className="px-4 py-4 font-medium text-orange-600">₱{calc.otPay.toFixed(2)}</td>
                <td className="px-4 py-4 font-bold text-red-600 bg-red-100 animate-pulse">₱{calc.totalSalary.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-red-600 text-white font-bold">
            <td colSpan={7} className="px-4 py-4">Total Regular Pay</td>
            <td className="px-4 py-4">₱{totalRegularPay.toFixed(2)}</td>
            <td className="px-4 py-4">Total OT</td>
            <td className="px-4 py-4">₱{totalOTPay.toFixed(2)}</td>
            <td className="px-4 py-4 text-xl">₱{totalSalary.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SalaryTable;