import React from 'react';
import { X, Printer, Copy } from 'lucide-react';
import { Project, SalaryCalculation, ReimbursementItem } from '../types/project';
import { getOrdinalSuffix } from '../utils/dateUtils';

interface PrintableBreakdownProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  calculations: SalaryCalculation[];
  reimbursements: ReimbursementItem[];
  monthInfo: { monthName: string; workingDays: number };
  rates: {
    firstProjectDailyRate: number;
    firstProjectHourlyRate: number;
    secondProjectDailyRate: number;
    secondProjectHourlyRate: number;
  };
}

const PrintableBreakdown: React.FC<PrintableBreakdownProps> = ({
  isOpen,
  onClose,
  projects,
  calculations,
  reimbursements,
  monthInfo,
  rates
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    // Generate text version of the breakdown
    let textContent = 'ROOCHE DIGITAL REPRESENTATIVE SALARY BREAKDOWN\n';
    textContent += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    textContent += 'RATE INFORMATION\n';
    textContent += `${monthInfo.monthName} has ${monthInfo.workingDays} working days\n`;
    textContent += `First Project: ₱20,000/month | ₱${rates.firstProjectDailyRate.toFixed(2)}/day | ₱${rates.firstProjectHourlyRate.toFixed(2)}/hour\n`;
    textContent += `2nd & Succeeding: ₱10,000/month | ₱${rates.secondProjectDailyRate.toFixed(2)}/day | ₱${rates.secondProjectHourlyRate.toFixed(2)}/hour\n\n`;
    
    if (projects.length > 0) {
      textContent += 'PROJECT DETAILS\n';
      let totalSalary = 0;
      
      projects.forEach((project, index) => {
        const calc = calculations[index];
        const projectNumber = index + 1;
        const suffix = getOrdinalSuffix(projectNumber);
        
        totalSalary += calc.totalSalary;
        
        textContent += `\n${projectNumber}${suffix} Project: ${project.name}\n`;
        textContent += `Period: ${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}\n`;
        textContent += `Working Days: ${calc.workingDays} days (${calc.workingHours} hours)\n`;
        textContent += `Hourly Rate: ₱${calc.hourlyRate.toFixed(2)}/hour\n`;
        textContent += `Regular Pay: ₱${calc.regularPay.toFixed(2)}\n`;
        if (calc.otHours > 0) {
          textContent += `Overtime Hours: ${calc.otHours} hours\n`;
          textContent += `Overtime Pay: ₱${calc.otPay.toFixed(2)}\n`;
        }
        textContent += `Total: ₱${calc.totalSalary.toFixed(2)}\n`;
      });
      
      const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
      
      if (reimbursements.length > 0) {
        textContent += '\nREIMBURSEMENTS\n';
        reimbursements.forEach(item => {
          textContent += `${item.description} (${item.category}): ₱${item.amount.toFixed(2)} - ${new Date(item.date).toLocaleDateString()}\n`;
        });
        textContent += `Total Reimbursements: ₱${totalReimbursements.toFixed(2)}\n`;
      }
      
      textContent += `\nSUMMARY\n`;
      textContent += `Total Salary: ₱${totalSalary.toFixed(2)}\n`;
      textContent += `Total Reimbursements: ₱${totalReimbursements.toFixed(2)}\n`;
      textContent += `\nGRAND TOTAL: ₱${(totalSalary + totalReimbursements).toFixed(2)}\n`;
    }
    
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Breakdown copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  const totalSalary = calculations.reduce((sum, calc) => sum + calc.totalSalary, 0);
  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = totalSalary + totalReimbursements;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-auto">
      <div className="bg-white m-4 md:m-8 p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-red-600">Printable Breakdown</h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Rooche Digital Representative</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Salary Breakdown</h2>
            <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Rate Information */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Monthly Rate Information</h3>
            <p className="text-lg mb-4">
              <strong>{monthInfo.monthName}</strong> has <strong className="text-red-600">{monthInfo.workingDays} working days</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>1st Project Rate:</strong></p>
                <p className="text-sm text-gray-600">₱20,000/month | ₱{rates.firstProjectDailyRate.toFixed(2)}/day | ₱{rates.firstProjectHourlyRate.toFixed(2)}/hour</p>
              </div>
              <div>
                <p><strong>2nd+ Project Rate:</strong></p>
                <p className="text-sm text-gray-600">₱10,000/month | ₱{rates.secondProjectDailyRate.toFixed(2)}/day | ₱{rates.secondProjectHourlyRate.toFixed(2)}/hour</p>
              </div>
            </div>
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Details</h3>
              <div className="space-y-4">
                {projects.map((project, index) => {
                  const calc = calculations[index];
                  const projectNumber = index + 1;
                  const suffix = getOrdinalSuffix(projectNumber);
                  
                  return (
                    <div key={project.id} className="bg-gray-50 p-6 rounded-xl border-l-4 border-red-500">
                      <h4 className="text-lg font-semibold text-red-600 mb-3">
                        {projectNumber}{suffix} Project: {project.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Period:</span>
                          <p>{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium">Working Days:</span>
                          <p>{calc.workingDays} days ({calc.workingHours} hours)</p>
                        </div>
                        <div>
                          <span className="font-medium">Hourly Rate:</span>
                          <p>₱{calc.hourlyRate.toFixed(2)}/hour</p>
                        </div>
                        <div>
                          <span className="font-medium">Regular Pay:</span>
                          <p>₱{calc.regularPay.toFixed(2)}</p>
                        </div>
                        {calc.otHours > 0 && (
                          <>
                            <div>
                              <span className="font-medium">OT Hours:</span>
                              <p>{calc.otHours} hours</p>
                            </div>
                            <div>
                              <span className="font-medium">OT Pay:</span>
                              <p>₱{calc.otPay.toFixed(2)}</p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-300">
                        <span className="font-bold text-lg text-red-600">
                          Project Total: ₱{calc.totalSalary.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Reimbursements */}
          {reimbursements.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Reimbursements</h3>
              <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-200">
                <div className="space-y-2">
                  {reimbursements.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-emerald-200 last:border-b-0">
                      <div>
                        <span className="font-medium">{item.description}</span>
                        <span className="text-sm text-gray-600 ml-2">({item.category})</span>
                        <span className="text-sm text-gray-500 ml-2">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <span className="font-semibold text-emerald-600">₱{item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-emerald-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total Reimbursements:</span>
                    <span className="font-bold text-xl text-emerald-600">₱{totalReimbursements.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-8 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4">GRAND TOTAL</h3>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between items-center">
                <span>Salary:</span>
                <span>₱{totalSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reimbursements:</span>
                <span>₱{totalReimbursements.toFixed(2)}</span>
              </div>
              <div className="border-t border-purple-300 pt-2 mt-4">
                <div className="flex justify-between items-center text-3xl font-bold">
                  <span>TOTAL:</span>
                  <span>₱{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 border-t border-gray-200 pt-6">
            <p>Rooche Digital - Salary Calculator</p>
            <p className="text-sm">Document generated on {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleCopyText}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableBreakdown;