import React from 'react';
import { Clock } from 'lucide-react';

interface OvertimeFormProps {
  overtimeHours: number;
  onOvertimeChange: (hours: number) => void;
  hourlyRate: number;
}

const OvertimeForm: React.FC<OvertimeFormProps> = ({ 
  overtimeHours, 
  onOvertimeChange, 
  hourlyRate 
}) => {
  const overtimePay = overtimeHours * hourlyRate;

  return (
    <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 transition-all duration-300 hover:shadow-lg">
      <h3 className="flex gap-2 items-center mb-4 text-xl font-semibold text-amber-700">
        <Clock className="w-5 h-5" />
        Overtime Hours (1st Project Only)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-amber-700">
            Overtime Hours
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={overtimeHours}
              onChange={(e) => onOvertimeChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.5"
              className="px-4 py-3 w-32 bg-white rounded-lg border-2 border-amber-200 transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 hover:border-amber-300"
            />
            <span className="text-sm text-amber-700">
              Rate: <span className="font-bold">₱{hourlyRate.toFixed(2)}/hour</span>
            </span>
          </div>
        </div>

        {overtimeHours > 0 && (
          <div className="p-4 bg-amber-200 rounded-lg">
            <p className="font-medium text-amber-800">
              Overtime Pay: <span className="text-lg font-bold">₱{overtimePay.toFixed(2)}</span>
            </p>
          </div>
        )}

        <p className="text-sm italic text-amber-600">
          Note: Overtime only applies to the first project at the ₱20,000/month rate
        </p>
      </div>
    </div>
  );
};

export default OvertimeForm;