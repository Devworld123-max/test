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
    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-amber-700 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Overtime Hours (1st Project Only)
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-amber-700 mb-2">
            Overtime Hours
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={overtimeHours}
              onChange={(e) => onOvertimeChange(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.5"
              placeholder="0"
              className="px-4 py-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 bg-white hover:border-amber-300 w-32"
            />
            <span className="text-amber-700 text-sm">
              Rate: <span className="font-bold">₱{hourlyRate.toFixed(2)}/hour</span>
            </span>
          </div>
        </div>

        {overtimeHours > 0 && (
          <div className="bg-amber-200 p-4 rounded-lg">
            <p className="text-amber-800 font-medium">
              Overtime Pay: <span className="text-lg font-bold">₱{overtimePay.toFixed(2)}</span>
            </p>
          </div>
        )}

        <p className="text-amber-600 text-sm italic">
          Note: Overtime only applies to the first project at the ₱20,000/month rate
        </p>
      </div>
    </div>
  );
};

export default OvertimeForm;