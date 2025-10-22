import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { aiAPI } from '../api/ai.api';
import './AISummaryModal.css';

/**
 * AISummaryModal Component
 *
 * Props:
 * - projectId: String - Project ID to summarize
 * - projectName: String - Project name for display
 * - onClose: Function() - Close modal handler
 */
const AISummaryModal = ({ projectId, projectName, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const fetchSummary = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiAPI.summarizeProject(projectId);
      // Backend returns: { success, message, data: { summary, breakdown, ... } }
      setSummary(response.data);
    } catch (err) {
      console.error('Error fetching AI summary:', err);
      setError(err.response?.data?.message || 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'done':
        return <CheckCircle2 size={16} className="status-icon done" />;
      case 'in_progress':
        return <Clock size={16} className="status-icon in-progress" />;
      default:
        return <AlertCircle size={16} className="status-icon pending" />;
    }
  };

  const renderSummaryContent = () => {
    if (!summary) return null;

    return (
      <div className="summary-content">
        {/* Overall Summary */}
        {summary.summary && (
          <div className="summary-section">
            <h3 className="section-title">Overview</h3>
            <p className="summary-text" style={{ whiteSpace: 'pre-wrap' }}>{summary.summary}</p>
          </div>
        )}

        {/* Task Breakdown by Status */}
        {summary.breakdown && (
          <div className="summary-section">
            <h3 className="section-title">Task Breakdown</h3>
            <div className="breakdown-grid">
              {summary.breakdown.todo !== undefined && (
                <div className="breakdown-card todo">
                  <div className="breakdown-number">{summary.breakdown.todo}</div>
                  <div className="breakdown-label">To Do</div>
                </div>
              )}
              {summary.breakdown['in-progress'] !== undefined && (
                <div className="breakdown-card in-progress">
                  <div className="breakdown-number">{summary.breakdown['in-progress']}</div>
                  <div className="breakdown-label">In Progress</div>
                </div>
              )}
              {summary.breakdown.in_review !== undefined && (
                <div className="breakdown-card in-review">
                  <div className="breakdown-number">{summary.breakdown.in_review}</div>
                  <div className="breakdown-label">In Review</div>
                </div>
              )}
              {summary.breakdown.done !== undefined && (
                <div className="breakdown-card done">
                  <div className="breakdown-number">{summary.breakdown.done}</div>
                  <div className="breakdown-label">Done</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Priority Highlights */}
        {summary.priorities && (
          <div className="summary-section">
            <h3 className="section-title">Priority Summary</h3>
            <div className="priority-list">
              {summary.priorities.high > 0 && (
                <div className="priority-item high">
                  <span className="priority-badge">High</span>
                  <span className="priority-count">{summary.priorities.high} tasks</span>
                </div>
              )}
              {summary.priorities.medium > 0 && (
                <div className="priority-item medium">
                  <span className="priority-badge">Medium</span>
                  <span className="priority-count">{summary.priorities.medium} tasks</span>
                </div>
              )}
              {summary.priorities.low > 0 && (
                <div className="priority-item low">
                  <span className="priority-badge">Low</span>
                  <span className="priority-count">{summary.priorities.low} tasks</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Highlights */}
        {summary.highlights && summary.highlights.length > 0 && (
          <div className="summary-section">
            <h3 className="section-title">Key Highlights</h3>
            <ul className="insights-list">
              {summary.highlights.map((highlight, index) => (
                <li key={index} className="insight-item">
                  <Sparkles size={16} className="insight-icon" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upcoming Tasks */}
        {summary.upcoming && summary.upcoming.length > 0 && (
          <div className="summary-section">
            <h3 className="section-title">Upcoming Tasks</h3>
            <div className="upcoming-tasks">
              {summary.upcoming.map((task, index) => (
                <div key={index} className="upcoming-task">
                  {getStatusIcon(task.status)}
                  <div className="task-info">
                    <div className="task-name">{task.title}</div>
                    {task.due_date && (
                      <div className="task-due">Due: {new Date(task.due_date).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-summary-title"
    >
      <div className="modal-content ai-modal">
        <div className="modal-header">
          <div className="header-content">
            <Sparkles size={24} className="ai-icon" />
            <div>
              <h2 id="ai-summary-title">AI Project Summary</h2>
              <p className="project-name-subtitle">{projectName}</p>
            </div>
          </div>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {isLoading && (
            <div className="loading-state">
              <Loader size={40} className="spinner" />
              <p>Generating AI summary...</p>
              <span className="loading-subtext">This may take a few moments</span>
            </div>
          )}

          {error && (
            <div className="error-state">
              <AlertCircle size={40} className="error-icon" />
              <p>{error}</p>
              <button className="btn btn-primary" onClick={fetchSummary}>
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && summary && renderSummaryContent()}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISummaryModal;
