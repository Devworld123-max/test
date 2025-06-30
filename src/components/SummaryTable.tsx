import React from 'react';
import { Project, SalaryCalculation } from '../types/project';
import { getOrdinalSuffix } from '../utils/dateUtils';

interface SummaryTableProps {
  projects: Project[];
  calculations: SalaryCalculation[];
  totalReimbursements: number;
}

const SummaryTable: React.FC<SummaryTableProps> = ({ projects, calculations, totalReimbursements }) => {
  if (projects.length === 0) {
    return null;
  }

  const totals = calculations.reduce(
    (acc, calc) => ({
      workingDays: acc.workingDays + calc.workingDays,
      workingHours: acc.workingHours + calc.workingHours,
      regularPay: acc.regularPay + calc.regularPay,
      otHours: acc.otHours + calc.otHours,
      otPay: acc.otPay + calc.otPay,
      totalSalary: acc.totalSalary + calc.totalSalary
    }),
    { workingDays: 0, workingHours: 0, regularPay: 0, otHours: 0, otPay: 0, totalSalary: 0 }
  );

  const grandTotalWithReimbursements = totals.totalSalary + totalReimbursements;

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="px-4 py-4 text-left font-semibold">Project</th>
            <th className="px-4 py-4 text-left font-semibold">Project Name</th>
            <th className="px-4 py-4 text-left font-semibold">Monthly Rate</th>
            <th className="px-4 py-4 text-left font-semibold">Working Days</th>
            <th className="px-4 py-4 text-left font-semibold">Working Hours</th>
            <th className="px-4 py-4 text-left font-semibold">Regular Pay</th>
            <th className="px-4 py-4 text-left font-semibold">OT Hours</th>
            <th className="px-4 py-4 text-left font-semibold">OT Pay</th>
            <th className="px-4 py-4 text-left font-semibold">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => {
            const calc = calculations[index];
            const projectNumber = index + 1;
            const suffix = getOrdinalSuffix(projectNumber);
            const monthlyRate = index === 0 ? 20000 : 10000;
            
            return (
              <tr 
                key={project.id} 
                className={`
                  border-b border-gray-200 transition-all duration-200 hover:bg-blue-50
                  ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                `}
              >
                <td className="px-4 py-4 font-medium text-blue-600">{projectNumber}{suffix} Project</td>
                <td className="px-4 py-4 text-gray-800">{project.name}</td>
                <td className="px-4 py-4 font-medium text-green-600">₱{monthlyRate.toLocaleString()}</td>
                <td className="px-4 py-4 text-gray-600">{calc.workingDays}</td>
                <td className="px-4 py-4 text-gray-600">{calc.workingHours}</td>
                <td className="px-4 py-4 font-medium text-green-600">₱{calc.regularPay.toFixed(2)}</td>
                <td className="px-4 py-4 text-gray-600">{calc.otHours}</td>
                <td className="px-4 py-4 font-medium text-orange-600">₱{calc.otPay.toFixed(2)}</td>
                <td className="px-4 py-4 font-bold text-blue-600">₱{calc.totalSalary.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-blue-600 text-white font-bold">
            <td colSpan={3} className="px-4 py-4">Subtotal</td>
            <td className="px-4 py-4">{totals.workingDays}</td>
            <td className="px-4 py-4">{totals.workingHours}</td>
            <td className="px-4 py-4">₱{totals.regularPay.toFixed(2)}</td>
            <td className="px-4 py-4">{totals.otHours}</td>
            <td className="px-4 py-4">₱{totals.otPay.toFixed(2)}</td>
            <td className="px-4 py-4 text-xl">₱{totals.totalSalary.toFixed(2)}</td>
          </tr>
          {totalReimbursements > 0 && (
            <tr className="bg-emerald-600 text-white font-bold">
              <td colSpan={8} className="px-4 py-4">Reimbursements</td>
              <td className="px-4 py-4 text-xl">₱{totalReimbursements.toFixed(2)}</td>
            </tr>
          )}
          <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold text-lg">
            <td colSpan={8} className="px-4 py-4">GRAND TOTAL (Salary + Reimbursements)</td>
            <td className="px-4 py-4 text-2xl">₱{grandTotalWithReimbursements.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SummaryTable;