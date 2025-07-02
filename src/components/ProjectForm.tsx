import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectFormProps {
  onAddProject: (project: Omit<Project, 'id' | 'position' | 'disbanded'>) => void;
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
    if (projectName && startDate && endDate) {
      onAddProject({ name: projectName, startDate, endDate });
      if (!editingProject) {
        setProjectName('');
        setStartDate('');
        setEndDate('');
      }
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 transition-all duration-300 hover:shadow-lg hover:from-red-100 hover:to-red-150">
      <h3 className="flex gap-2 items-center mb-6 text-xl font-semibold text-red-600">
        <Plus className="w-5 h-5" />
        {editingProject ? 'Edit Project' : 'Add New Project'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-red-700">
            Project Name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="px-4 py-3 w-full bg-white rounded-lg border-2 border-red-200 transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 hover:border-red-300"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium text-red-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 w-full bg-white rounded-lg border-2 border-red-200 transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 hover:border-red-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-red-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 w-full bg-white rounded-lg border-2 border-red-200 transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 hover:border-red-300"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex gap-2 items-center px-6 py-3 font-medium text-white bg-red-600 rounded-lg transition-all duration-200 hover:bg-red-700 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-200"
          >
            <Plus className="w-4 h-4" />
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
          
          {editingProject && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-3 font-medium text-white bg-gray-500 rounded-lg transition-all duration-200 hover:bg-gray-600 hover:-translate-y-1 hover:shadow-lg"
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