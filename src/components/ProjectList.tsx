import React from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onRemoveProject: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onEditProject, 
  onRemoveProject 
}) => {
  const handleRemove = (id: number) => {
    if (confirm('Are you sure you want to remove this project?')) {
      onRemoveProject(id);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg">No projects added yet</p>
        <p className="text-gray-500 text-sm mt-2">Add your first project using the form above</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, index) => (
        <div
          key={project.id}
          className="bg-white p-5 rounded-xl border border-red-200 transition-all duration-300 hover:shadow-lg hover:border-red-300 hover:translate-x-2 group"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 text-lg mb-2">
                <span className="text-red-600">Project {index + 1}:</span> {project.name}
              </h4>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEditProject(project)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                title="Edit project"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleRemove(project.id)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all duration-200 hover:scale-110"
                title="Remove project"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;