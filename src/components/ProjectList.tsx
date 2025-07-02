/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Edit, Trash2, Calendar, Ban, RotateCcw } from 'lucide-react';
import { Project } from '../types/project';

interface ProjectListProps {
  projects: Project[];
  onEditProject: (project: Project) => void;
  onRemoveProject: (id: number) => void;
  onDisbandProject: (id: number) => void;
  onReactivateProject: (id: number) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  onEditProject, 
  onRemoveProject,
  onDisbandProject,
  onReactivateProject
}) => {
  const handleRemove = (id: number) => {
    if (confirm('Are you sure you want to remove this project?')) {
      onRemoveProject(id);
    }
  };

  const handleDisband = (id: number) => {
    if (confirm('Are you sure you want to disband this project? This will exclude it from salary calculations.')) {
      onDisbandProject(id);
    }
  };

  const handleReactivate = (id: number) => {
    if (confirm('Are you sure you want to reactivate this project? This will include it back in salary calculations.')) {
      onReactivateProject(id);
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
          className={`p-5 rounded-xl border transition-all duration-300 hover:shadow-lg hover:translate-x-2 group ${
            project.disbanded 
              ? 'bg-gray-50 border-gray-300 opacity-75' 
              : 'bg-white border-red-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-lg mb-2">
                <span className={project.disbanded ? 'text-gray-500' : 'text-red-600'}>
                  Project {index + 1}:
                </span> 
                <span className={project.disbanded ? 'text-gray-600' : 'text-gray-800'}>
                  {project.name}
                </span>
                {project.disbanded && (
                  <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                    DISBANDED
                  </span>
                )}
              </h4>
              <p className={`flex items-center gap-2 ${
                project.disbanded ? 'text-gray-500' : 'text-gray-600'
              }`}>
                <Calendar className="w-4 h-4" />
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onEditProject(project)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200 hover:scale-110"
                title="Edit project"
                disabled={project.disbanded}
              >
                <Edit className="w-4 h-4" />
              </button>
              
              {project.disbanded ? (
                <button
                  onClick={() => handleReactivate(project.id)}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all duration-200 hover:scale-110"
                  title="Reactivate project"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleDisband(project.id)}
                  className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-all duration-200 hover:scale-110"
                  title="Disband project"
                >
                  <Ban className="w-4 h-4" />
                </button>
              )}
              
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