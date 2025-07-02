import React from 'react';
import { X, Printer, Copy, Download } from 'lucide-react';
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

  const generateTextContent = () => {
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
    return textContent;
  };

  const handleCopyText = () => {
    const textContent = generateTextContent();
    navigator.clipboard.writeText(textContent).then(() => {
      alert('Breakdown copied to clipboard!');
    });
  };

  const handleSaveToFile = () => {
    const textContent = generateTextContent();
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `salary_breakdown_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const totalSalary = calculations.reduce((sum, calc) => sum + calc.totalSalary, 0);
  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = totalSalary + totalReimbursements;

  return (
    <div className="overflow-auto fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="p-6 m-4 mx-auto max-w-4xl bg-white rounded-2xl shadow-2xl print-modal md:m-8 md:p-8">
        <div className="flex justify-between items-center mb-8 no-print">
          <h2 className="text-2xl font-bold text-red-600">Printable Breakdown</h2>
          <button
            onClick={onClose}
            className="p-2 text-red-600 bg-red-100 rounded-full transition-colors duration-200 hover:bg-red-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6 print-optimize">
          {/* Header */}
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold text-red-600">Rooche Digital Representative</h1>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">Salary Breakdown</h2>
            <p className="text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Rate Information */}
          <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 print-no-break print-bg">
            <h3 className="mb-4 text-xl font-semibold text-red-700">Monthly Rate Information</h3>
            <p className="mb-4 text-lg">
              <strong>{monthInfo.monthName}</strong> has <strong className="text-red-600">{monthInfo.workingDays} working days</strong>
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Project Details</h3>
              <div className="space-y-4">
                {projects.map((project, index) => {
                  const calc = calculations[index];
                  const projectNumber = index + 1;
                  const suffix = getOrdinalSuffix(projectNumber);
                  
                  return (
                    <div key={project.id} className="p-6 bg-gray-50 rounded-xl border-l-4 border-red-500 print-no-break">
                      <h4 className="mb-3 text-lg font-semibold text-red-600">
                        {projectNumber}{suffix} Project: {project.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
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
                      <div className="pt-4 mt-4 border-t border-gray-300">
                        <span className="text-lg font-bold text-red-600">
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
              <h3 className="mb-4 text-xl font-semibold text-gray-800">Reimbursements</h3>
              <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 print-no-break print-bg">
                <div className="space-y-2">
                  {reimbursements.map(item => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-emerald-200 last:border-b-0">
                      <div>
                        <span className="font-medium">{item.description}</span>
                        <span className="ml-2 text-sm text-gray-600">({item.category})</span>
                        <span className="ml-2 text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                      <span className="font-semibold text-emerald-600">₱{item.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 mt-4 border-t border-emerald-300">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total Reimbursements:</span>
                    <span className="text-xl font-bold text-emerald-600">₱{totalReimbursements.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="p-8 text-center text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl print-no-break print-bg">
            <h3 className="mb-4 text-2xl font-bold">GRAND TOTAL</h3>
            <div className="space-y-2 text-lg">
              <div className="flex justify-between items-center">
                <span>Salary:</span>
                <span>₱{totalSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Reimbursements:</span>
                <span>₱{totalReimbursements.toFixed(2)}</span>
              </div>
              <div className="pt-2 mt-4 border-t border-purple-300">
                <div className="flex justify-between items-center text-3xl font-bold">
                  <span>TOTAL:</span>
                  <span>₱{grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 text-center text-gray-500 border-t border-gray-200">
            <p>Rooche Digital - Salary Calculator</p>
            <p className="text-sm">Document generated on {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center pt-6 mt-8 border-t border-gray-200 no-print">
          <button
            onClick={handlePrint}
            className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleCopyText}
            className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-blue-600 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg"
          >
            <Copy className="w-4 h-4" />
            Copy Text
          </button>
          <button
            onClick={handleSaveToFile}
            className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-green-600 rounded-lg transition-all duration-200 hover:bg-green-700 hover:-translate-y-1 hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableBreakdown;
