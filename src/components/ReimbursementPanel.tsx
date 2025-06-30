import React, { useState } from 'react';
import { Receipt, Plus, Trash2, Edit } from 'lucide-react';
import { ReimbursementItem } from '../types/project';

interface ReimbursementPanelProps {
  reimbursements: ReimbursementItem[];
  onAddReimbursement: (reimbursement: Omit<ReimbursementItem, 'id'>) => void;
  onRemoveReimbursement: (id: number) => void;
  onEditReimbursement: (reimbursement: ReimbursementItem) => void;
}

const ReimbursementPanel: React.FC<ReimbursementPanelProps> = ({
  reimbursements,
  onAddReimbursement,
  onRemoveReimbursement,
  onEditReimbursement
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ReimbursementItem['category']>('transportation');
  const [editingItem, setEditingItem] = useState<ReimbursementItem | null>(null);

  const categories = [
    { value: 'transportation', label: 'Transportation', color: 'bg-blue-100 text-blue-800' },
    { value: 'meals', label: 'Meals', color: 'bg-green-100 text-green-800' },
    { value: 'supplies', label: 'Office Supplies', color: 'bg-purple-100 text-purple-800' },
    { value: 'communication', label: 'Communication', color: 'bg-orange-100 text-orange-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !date) {
      alert('Please fill all fields');
      return;
    }

    const reimbursementData = {
      description,
      amount: parseFloat(amount),
      date,
      category
    };

    if (editingItem) {
      onEditReimbursement({ ...editingItem, ...reimbursementData });
      setEditingItem(null);
    } else {
      onAddReimbursement(reimbursementData);
    }

    // Reset form
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('transportation');
  };

  const handleEdit = (item: ReimbursementItem) => {
    setEditingItem(item);
    setDescription(item.description);
    setAmount(item.amount.toString());
    setDate(item.date);
    setCategory(item.category);
  };

  const handleRemove = (id: number) => {
    if (confirm('Are you sure you want to remove this reimbursement?')) {
      onRemoveReimbursement(id);
    }
  };

  const totalReimbursements = reimbursements.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 transition-all duration-300 hover:shadow-lg">
      <h3 className="text-xl font-semibold text-emerald-700 mb-6 flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        Reimbursement Tracker
      </h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter expense description"
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white hover:border-emerald-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white hover:border-emerald-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white hover:border-emerald-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-emerald-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ReimbursementItem['category'])}
              className="w-full px-4 py-3 border-2 border-emerald-200 rounded-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-200 bg-white hover:border-emerald-300"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {editingItem ? 'Update Reimbursement' : 'Add Reimbursement'}
        </button>

        {editingItem && (
          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setDescription('');
              setAmount('');
              setDate(new Date().toISOString().split('T')[0]);
              setCategory('transportation');
            }}
            className="ml-3 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Reimbursement List */}
      <div className="space-y-3">
        {reimbursements.length === 0 ? (
          <div className="text-center py-8">
            <Receipt className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <p className="text-emerald-600">No reimbursements added yet</p>
          </div>
        ) : (
          <>
            {reimbursements.map((item) => {
              const categoryInfo = categories.find(cat => cat.value === item.category);
              return (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-lg border border-emerald-200 transition-all duration-300 hover:shadow-md group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-800">{item.description}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo?.color}`}>
                          {categoryInfo?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>₱{item.amount.toFixed(2)}</span>
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                        title="Edit reimbursement"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-110"
                        title="Remove reimbursement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Total */}
            <div className="bg-emerald-600 text-white p-4 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Reimbursements:</span>
                <span className="text-xl font-bold">₱{totalReimbursements.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReimbursementPanel;