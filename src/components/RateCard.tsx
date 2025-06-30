import React from 'react';

interface RateCardProps {
  title: string;
  monthlyRate: number;
  dailyRate: number;
  hourlyRate: number;
  isPrimary?: boolean;
}

const RateCard: React.FC<RateCardProps> = ({ 
  title, 
  monthlyRate, 
  dailyRate, 
  hourlyRate, 
  isPrimary = false 
}) => {
  return (
    <div className={`
      bg-white p-6 rounded-xl border-2 shadow-lg transition-all duration-300 cursor-pointer
      ${isPrimary 
        ? 'border-red-500 hover:border-red-600 hover:shadow-red-100' 
        : 'border-red-400 hover:border-red-500 hover:shadow-red-50'
      }
      hover:shadow-xl hover:-translate-y-2 hover:bg-red-50
    `}>
      <h4 className="text-lg font-semibold text-red-600 mb-4">{title}</h4>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Monthly Rate: <span className="font-bold text-red-600 text-lg">₱{monthlyRate.toLocaleString()}</span>
        </p>
        <p className="text-sm text-gray-600">
          Daily Rate: <span className="font-bold text-red-600">₱{dailyRate.toFixed(2)}</span>
        </p>
        <p className="text-sm text-gray-600">
          Hourly Rate: <span className="font-bold text-red-600">₱{hourlyRate.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
};

export default RateCard;