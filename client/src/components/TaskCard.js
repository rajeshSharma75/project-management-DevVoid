import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, AlertCircle, Calendar } from 'lucide-react';
import './TaskCard.css';

/**
 * TaskCard Component
 *
 * Props:
 * - task: Object - Task data
 * - onDelete: Function(taskId) - Delete handler
 * - onUpdate: Function(task) - Update/edit handler
 * - isDragging: Boolean (optional) - Dragging state
 */
const TaskCard = ({ task, onDelete, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  const handleCardClick = () => {
    onUpdate(task);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-none';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'None';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset time for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else if (dueDate < today) {
      return 'Overdue';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const isOverdue = () => {
    if (!task.due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      onClick={handleCardClick}
      {...attributes}
      {...listeners}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <button
          className="task-delete"
          onClick={handleDelete}
          aria-label={`Delete task ${task.title}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {task.description && (
        <p className="task-description">
          {truncateText(task.description)}
        </p>
      )}

      <div className="task-footer">
        <div className="task-meta">
          {task.priority && (
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              <AlertCircle size={12} />
              {getPriorityLabel(task.priority)}
            </span>
          )}
        </div>

        {task.due_date && (
          <div className={`task-due-date ${isOverdue() ? 'overdue' : ''}`}>
            <Calendar size={12} />
            <span>{formatDate(task.due_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
