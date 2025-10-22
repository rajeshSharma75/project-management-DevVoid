import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './EditTaskModal.css';

/**
 * EditTaskModal Component
 *
 * Props:
 * - task: Object - Task to edit
 * - onClose: Function() - Close modal handler
 * - onUpdate: Function(taskId, taskData) - Update task handler
 */
const EditTaskModal = ({ task, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    status: 'todo'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form with task data
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.due_date ? task.due_date.split('T')[0] : '',
        status: task.status || 'todo'
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Task title must not exceed 200 characters';
    }

    if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters';
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onUpdate(task.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        due_date: formData.dueDate || null,
        status: formData.status
      });
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to update task. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-task-title"
    >
      <div className="modal-content task-modal">
        <div className="modal-header">
          <h2 id="edit-task-title">Edit Task</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {errors.submit && (
            <div className="error-message" role="alert">
              {errors.submit}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="edit-task-title">
              Task Title <span className="required">*</span>
            </label>
            <input
              id="edit-task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
              maxLength={200}
              autoFocus
              disabled={isSubmitting}
            />
            {errors.title && (
              <span className="field-error" role="alert">{errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-description">
              Description <span className="optional">(optional)</span>
            </label>
            <textarea
              id="edit-task-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Enter task description"
              rows={4}
              maxLength={1000}
              disabled={isSubmitting}
            />
            <div className="char-count">
              {formData.description.length}/1000
            </div>
            {errors.description && (
              <span className="field-error" role="alert">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-task-priority">Priority</label>
              <select
                id="edit-task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-task-status">Status</label>
              <select
                id="edit-task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-task-due-date">
              Due Date <span className="optional">(optional)</span>
            </label>
            <input
              id="edit-task-due-date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
              min={getTodayDate()}
              disabled={isSubmitting}
            />
            {errors.dueDate && (
              <span className="field-error" role="alert">{errors.dueDate}</span>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
