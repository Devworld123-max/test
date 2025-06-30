import React from 'react';
import { X, Printer, Download, FileText } from 'lucide-react';
import { Project, SalaryCalculation, ReimbursementItem } from '../types/project';
import { getOrdinalSuffix } from '../utils/dateUtils';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

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
    // Hide the modal backdrop and buttons before printing
    const modal = document.querySelector('[data-print-modal]') as HTMLElement;
    const backdrop = document.querySelector('[data-print-backdrop]') as HTMLElement;
    const actionButtons = document.querySelector('[data-print-actions]') as HTMLElement;
    
    if (modal && backdrop && actionButtons) {
      backdrop.style.display = 'none';
      actionButtons.style.display = 'none';
      modal.style.position = 'static';
      modal.style.margin = '0';
      modal.style.maxWidth = 'none';
      modal.style.boxShadow = 'none';
      
      // Add print styles
      const printStyles = document.createElement('style');
      printStyles.innerHTML = `
        @media print {
          body * { visibility: hidden; }
          [data-print-modal], [data-print-modal] * { visibility: visible; }
          [data-print-modal] { 
            position: static !important;
            margin: 0 !important;
            padding: 20px !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .no-print { display: none !important; }
          .print-break { page-break-after: always; }
          table { page-break-inside: avoid; }
          .bg-gradient-to-br, .bg-gradient-to-r { 
            background: #f3f4f6 !important; 
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          .text-red-600, .text-red-700 { color: #dc2626 !important; }
          .text-emerald-600, .text-emerald-700 { color: #059669 !important; }
          .text-purple-600, .text-purple-700 { color: #7c3aed !important; }
          .border-red-200, .border-red-500 { border-color: #fecaca !important; }
          .border-emerald-200 { border-color: #a7f3d0 !important; }
        }
      `;
      document.head.appendChild(printStyles);
      
      window.print();
      
      // Restore original styles after printing
      setTimeout(() => {
        backdrop.style.display = '';
        actionButtons.style.display = '';
        modal.style.position = '';
        modal.style.margin = '';
        modal.style.maxWidth = '';
        modal.style.boxShadow = '';
        document.head.removeChild(printStyles);
      }, 1000);
    }
  };

  const handleSaveToDevice = () => {
    // Generate HTML content for saving
    const htmlContent = generateHTMLContent();
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Rooche_Digital_Salary_Breakdown_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    const totalSalary = calculations.reduce((sum, calc) => sum + calc.totalSalary, 0);
    const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
    const grandTotal = totalSalary + totalReimbursements;

    // Set up colors
    const primaryColor = [220, 38, 38]; // Red-600
    const secondaryColor = [107, 114, 128]; // Gray-500
    const accentColor = [124, 58, 237]; // Purple-600

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Rooche Digital Representative', 105, 20, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('Salary Breakdown', 105, 30, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Generation date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 50);

    let yPosition = 65;

    // Monthly Rate Information
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Monthly Rate Information', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...secondaryColor);
    doc.text(`${monthInfo.monthName} has ${monthInfo.workingDays} working days`, 20, yPosition);
    yPosition += 15;

    // Rate table
    const rateData = [
      ['Project Type', 'Monthly Rate', 'Daily Rate', 'Hourly Rate'],
      ['1st Project', '₱20,000', `₱${rates.firstProjectDailyRate.toFixed(2)}`, `₱${rates.firstProjectHourlyRate.toFixed(2)}`],
      ['2nd+ Projects', '₱10,000', `₱${rates.secondProjectDailyRate.toFixed(2)}`, `₱${rates.secondProjectHourlyRate.toFixed(2)}`]
    ];

    doc.autoTable({
      startY: yPosition,
      head: [rateData[0]],
      body: rateData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 20, right: 20 }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 20;

    // Projects section
    if (projects.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Project Details', 20, yPosition);
      yPosition += 15;

      projects.forEach((project, index) => {
        const calc = calculations[index];
        const projectNumber = index + 1;
        const suffix = getOrdinalSuffix(projectNumber);

        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryColor);
        doc.text(`${projectNumber}${suffix} Project: ${project.name}`, 20, yPosition);
        yPosition += 10;

        const projectData = [
          ['Period', `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`],
          ['Working Days', `${calc.workingDays} days (${calc.workingHours} hours)`],
          ['Hourly Rate', `₱${calc.hourlyRate.toFixed(2)}/hour`],
          ['Regular Pay', `₱${calc.regularPay.toFixed(2)}`]
        ];

        if (calc.otHours > 0) {
          projectData.push(['OT Hours', `${calc.otHours} hours`]);
          projectData.push(['OT Pay', `₱${calc.otPay.toFixed(2)}`]);
        }

        projectData.push(['Project Total', `₱${calc.totalSalary.toFixed(2)}`]);

        doc.autoTable({
          startY: yPosition,
          body: projectData,
          theme: 'plain',
          bodyStyles: { textColor: [0, 0, 0] },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 40 },
            1: { cellWidth: 80 }
          },
          margin: { left: 25, right: 20 }
        });

        yPosition = (doc as any).lastAutoTable.finalY + 15;
      });
    }

    // Reimbursements section
    if (reimbursements.length > 0) {
      // Check if we need a new page
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Reimbursements', 20, yPosition);
      yPosition += 15;

      const reimbursementData = reimbursements.map(item => [
        item.description,
        item.category,
        new Date(item.date).toLocaleDateString(),
        `₱${item.amount.toFixed(2)}`
      ]);

      reimbursementData.push(['', '', 'Total Reimbursements:', `₱${totalReimbursements.toFixed(2)}`]);

      doc.autoTable({
        startY: yPosition,
        head: [['Description', 'Category', 'Date', 'Amount']],
        body: reimbursementData,
        theme: 'grid',
        headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' }, // Emerald-600
        bodyStyles: { textColor: [0, 0, 0] },
        alternateRowStyles: { fillColor: [236, 253, 245] }, // Emerald-50
        footStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold' },
        margin: { left: 20, right: 20 }
      });

      yPosition = (doc as any).lastAutoTable.finalY + 20;
    }

    // Grand Total section
    // Check if we need a new page
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    // Grand total background
    doc.setFillColor(...accentColor);
    doc.rect(20, yPosition - 5, 170, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('GRAND TOTAL', 105, yPosition + 8, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Salary: ₱${totalSalary.toFixed(2)}`, 30, yPosition + 18);
    doc.text(`Reimbursements: ₱${totalReimbursements.toFixed(2)}`, 30, yPosition + 25);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: ₱${grandTotal.toFixed(2)}`, 105, yPosition + 35, { align: 'center' });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(...secondaryColor);
      doc.text('Rooche Digital - Salary Calculator', 105, 285, { align: 'center' });
      doc.text(`Document generated on ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: 'right' });
    }

    // Save the PDF
    const fileName = `Rooche_Digital_Salary_Breakdown_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const generateHTMLContent = () => {
    const totalSalary = calculations.reduce((sum, calc) => sum + calc.totalSalary, 0);
    const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
    const grandTotal = totalSalary + totalReimbursements;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rooche Digital Salary Breakdown</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f9fafb;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #fee2e2, #fecaca);
            border-radius: 15px;
            border: 2px solid #fca5a5;
        }
        .header h1 {
            color: #dc2626;
            font-size: 2.5rem;
            margin: 0 0 10px 0;
            font-weight: bold;
        }
        .header h2 {
            color: #374151;
            font-size: 2rem;
            margin: 0 0 20px 0;
        }
        .header p {
            color: #6b7280;
            font-size: 1.1rem;
            margin: 0;
        }
        .section {
            background: white;
            margin: 30px 0;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
        }
        .section h3 {
            color: #dc2626;
            font-size: 1.5rem;
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #fca5a5;
        }
        .rate-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
        }
        .rate-card {
            background: #f9fafb;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
        }
        .rate-card h4 {
            color: #dc2626;
            margin: 0 0 15px 0;
            font-size: 1.2rem;
        }
        .rate-card p {
            margin: 5px 0;
            color: #6b7280;
        }
        .rate-card .highlight {
            color: #dc2626;
            font-weight: bold;
        }
        .project-card {
            background: #f9fafb;
            padding: 25px;
            margin: 20px 0;
            border-radius: 10px;
            border-left: 4px solid #dc2626;
        }
        .project-card h4 {
            color: #dc2626;
            font-size: 1.3rem;
            margin: 0 0 15px 0;
        }
        .project-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .project-details div {
            background: white;
            padding: 10px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }
        .project-details .label {
            font-weight: 600;
            color: #374151;
            display: block;
            margin-bottom: 5px;
        }
        .project-details .value {
            color: #6b7280;
        }
        .project-total {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: right;
        }
        .project-total .amount {
            font-size: 1.3rem;
            font-weight: bold;
            color: #dc2626;
        }
        .reimbursement-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .reimbursement-item:last-child {
            border-bottom: none;
        }
        .reimbursement-details h5 {
            margin: 0 0 5px 0;
            color: #374151;
            font-weight: 600;
        }
        .reimbursement-details .meta {
            color: #6b7280;
            font-size: 0.9rem;
        }
        .reimbursement-amount {
            font-weight: bold;
            color: #059669;
            font-size: 1.1rem;
        }
        .grand-total {
            background: linear-gradient(135deg, #7c3aed, #8b5cf6);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin: 40px 0;
        }
        .grand-total h3 {
            font-size: 2rem;
            margin: 0 0 20px 0;
            color: white;
        }
        .grand-total-details {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 15px 0;
            font-size: 1.2rem;
        }
        .grand-total-final {
            border-top: 2px solid rgba(255, 255, 255, 0.3);
            padding-top: 20px;
            margin-top: 20px;
        }
        .grand-total-final .amount {
            font-size: 2.5rem;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            color: #6b7280;
            border-top: 2px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
        }
        @media print {
            body { background: white; }
            .section { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Rooche Digital Representative</h1>
        <h2>Salary Breakdown</h2>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h3>Monthly Rate Information</h3>
        <p><strong>${monthInfo.monthName}</strong> has <strong>${monthInfo.workingDays} working days</strong></p>
        <div class="rate-grid">
            <div class="rate-card">
                <h4>1st Project Rate</h4>
                <p>Monthly: <span class="highlight">₱20,000</span></p>
                <p>Daily: <span class="highlight">₱${rates.firstProjectDailyRate.toFixed(2)}</span></p>
                <p>Hourly: <span class="highlight">₱${rates.firstProjectHourlyRate.toFixed(2)}</span></p>
            </div>
            <div class="rate-card">
                <h4>2nd+ Project Rate</h4>
                <p>Monthly: <span class="highlight">₱10,000</span></p>
                <p>Daily: <span class="highlight">₱${rates.secondProjectDailyRate.toFixed(2)}</span></p>
                <p>Hourly: <span class="highlight">₱${rates.secondProjectHourlyRate.toFixed(2)}</span></p>
            </div>
        </div>
    </div>

    ${projects.length > 0 ? `
    <div class="section">
        <h3>Project Details</h3>
        ${projects.map((project, index) => {
          const calc = calculations[index];
          const projectNumber = index + 1;
          const suffix = getOrdinalSuffix(projectNumber);
          
          return `
            <div class="project-card">
                <h4>${projectNumber}${suffix} Project: ${project.name}</h4>
                <div class="project-details">
                    <div>
                        <span class="label">Period:</span>
                        <span class="value">${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                    <div>
                        <span class="label">Working Days:</span>
                        <span class="value">${calc.workingDays} days (${calc.workingHours} hours)</span>
                    </div>
                    <div>
                        <span class="label">Hourly Rate:</span>
                        <span class="value">₱${calc.hourlyRate.toFixed(2)}/hour</span>
                    </div>
                    <div>
                        <span class="label">Regular Pay:</span>
                        <span class="value">₱${calc.regularPay.toFixed(2)}</span>
                    </div>
                    ${calc.otHours > 0 ? `
                    <div>
                        <span class="label">OT Hours:</span>
                        <span class="value">${calc.otHours} hours</span>
                    </div>
                    <div>
                        <span class="label">OT Pay:</span>
                        <span class="value">₱${calc.otPay.toFixed(2)}</span>
                    </div>
                    ` : ''}
                </div>
                <div class="project-total">
                    <span class="amount">Project Total: ₱${calc.totalSalary.toFixed(2)}</span>
                </div>
            </div>
          `;
        }).join('')}
    </div>
    ` : ''}

    ${reimbursements.length > 0 ? `
    <div class="section">
        <h3>Reimbursements</h3>
        ${reimbursements.map(item => `
            <div class="reimbursement-item">
                <div class="reimbursement-details">
                    <h5>${item.description}</h5>
                    <div class="meta">${item.category} • ${new Date(item.date).toLocaleDateString()}</div>
                </div>
                <div class="reimbursement-amount">₱${item.amount.toFixed(2)}</div>
            </div>
        `).join('')}
        <div class="project-total">
            <span class="amount">Total Reimbursements: ₱${totalReimbursements.toFixed(2)}</span>
        </div>
    </div>
    ` : ''}

    <div class="grand-total">
        <h3>GRAND TOTAL</h3>
        <div class="grand-total-details">
            <span>Salary:</span>
            <span>₱${totalSalary.toFixed(2)}</span>
        </div>
        <div class="grand-total-details">
            <span>Reimbursements:</span>
            <span>₱${totalReimbursements.toFixed(2)}</span>
        </div>
        <div class="grand-total-final">
            <div class="grand-total-details">
                <span>TOTAL:</span>
                <span class="amount">₱${grandTotal.toFixed(2)}</span>
            </div>
        </div>
    </div>

    <div class="footer">
        <p><strong>Rooche Digital - Salary Calculator</strong></p>
        <p>Document generated on ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>
    `;
  };

  if (!isOpen) return null;

  const totalSalary = calculations.reduce((sum, calc) => sum + calc.totalSalary, 0);
  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);
  const grandTotal = totalSalary + totalReimbursements;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-auto" data-print-backdrop>
      <div className="bg-white m-4 md:m-8 p-6 md:p-8 rounded-2xl max-w-4xl mx-auto shadow-2xl" data-print-modal>
        <div className="flex justify-between items-center mb-8 no-print" data-print-actions>
          <h2 className="text-2xl font-bold text-red-600">Export Options</h2>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200 no-print" data-print-actions>
          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-gray-800 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Printer className="w-5 h-5" />
            Print Document
          </button>
          <button
            onClick={handleGeneratePDF}
            className="bg-red-600 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Generate PDF
          </button>
          <button
            onClick={handleSaveToDevice}
            className="bg-blue-600 text-white px-6 py-4 rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Save HTML
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintableBreakdown;