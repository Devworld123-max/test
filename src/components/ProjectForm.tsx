import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectFormProps {
  onAddProject: (project: Omit<Project, 'id'>) => void;
  editingProject?: Project | null;
  onCancelEdit?: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  onAddProject, 
  editingProject, 
  onCancelEdit 
}) => {
  const [projectName, setProjectName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (editingProject) {
      setProjectName(editingProject.name);
      setStartDate(editingProject.startDate);
      setEndDate(editingProject.endDate);
    } else {
      // Set default dates
      const now = new Date();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setStartDate(now.toISOString().split('T')[0]);
      setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectName || !startDate || !endDate) {
      alert('Please fill all fields');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('End date must be after start date');
      return;
    }

    onAddProject({
      name: projectName,
      startDate,
      endDate
    });

    // Reset form
    setProjectName('');
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    setStartDate(now.toISOString().split('T')[0]);
    setEndDate(lastDayOfMonth.toISOString().split('T')[0]);
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 transition-all duration-300 hover:shadow-lg hover:from-red-100 hover:to-red-150">
      <h3 className="text-xl font-semibold text-red-600 mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        {editingProject ? 'Edit Project' : 'Add New Project'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-red-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white hover:border-red-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white hover:border-red-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-red-200 rounded-lg focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-200 bg-white hover:border-red-300"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
          
          {editingProject && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;