import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, RefreshCw, Calendar } from 'lucide-react';
import './ProjectList.css';

/**
 * ProjectList Component
 *
 * Props:
 * - projects: Array of project objects
 * - onDelete: Function(projectId) - Delete handler
 * - onRefresh: Function() - Refresh handler
 * - currentUserId: String - Current user's ID for ownership check
 */
const ProjectList = ({ projects, onDelete, onRefresh, currentUserId }) => {
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  const handleDelete = (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDelete(projectId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="project-list-container">
      <div className="project-list-header">
        <h1>My Projects</h1>
        <button
          className="btn btn-refresh"
          onClick={onRefresh}
          aria-label="Refresh projects"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <Plus size={48} />
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
        </div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div
              key={project._id}
              className="project-card"
              onClick={() => handleProjectClick(project._id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleProjectClick(project._id);
                }
              }}
              aria-label={`Open project ${project.name}`}
            >
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                {project.owner && project.owner._id === currentUserId && (
                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, project._id)}
                    aria-label={`Delete project ${project.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <p className="project-description">
                {project.description || 'No description provided'}
              </p>

              <div className="project-footer">
                <div className="project-meta">
                  <Calendar size={14} />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
                {project.members && project.members.length > 0 && (
                  <div className="project-members">
                    {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
