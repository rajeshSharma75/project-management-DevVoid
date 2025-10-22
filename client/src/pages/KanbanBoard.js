import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import { projectAPI } from '../api/project.api';
import { taskAPI } from '../api/task.api';
import { aiAPI } from '../api/ai.api';
import KanbanColumn from '../components/KanbanColumn';
import TaskCard from '../components/TaskCard';
import CreateTaskModal from '../components/CreateTaskModal';
import AISummaryModal from '../components/AISummaryModal';
import AIQAModal from '../components/AIQAModal';
import './KanbanBoard.css';

const COLUMNS = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const KanbanBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showQAModal, setShowQAModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState('todo');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectResponse, tasksResponse] = await Promise.all([
        projectAPI.getProject(projectId),
        taskAPI.getProjectTasks(projectId),
      ]);

      setProject(projectResponse.data.project);
      setTasks(tasksResponse.data.tasks);
    } catch (error) {
      setError('Failed to load project. Please try again.');
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status).sort((a, b) => a.order - b.order);
  };

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;
    const overId = over.id;

    // Find the task being dragged
    const draggedTask = tasks.find((t) => t._id === taskId);
    if (!draggedTask) return;

    // Determine the new status
    let newStatus = draggedTask.status;
    let targetTasks = [];

    // Check if dropped over a column
    if (COLUMNS.find((col) => col.id === overId)) {
      newStatus = overId;
      targetTasks = getTasksByStatus(newStatus);
    } else {
      // Dropped over another task
      const overTask = tasks.find((t) => t._id === overId);
      if (overTask) {
        newStatus = overTask.status;
        targetTasks = getTasksByStatus(newStatus);
      }
    }

    // Calculate new order
    const newOrder = targetTasks.length;

    // If status hasn't changed and it's the same position, do nothing
    if (draggedTask.status === newStatus && draggedTask.order === newOrder) {
      return;
    }

    try {
      // Optimistic update
      const updatedTasks = tasks.map((task) => {
        if (task._id === taskId) {
          return { ...task, status: newStatus, order: newOrder };
        }
        return task;
      });
      setTasks(updatedTasks);

      // API call
      await taskAPI.moveTask(taskId, newStatus, newOrder);

      // Refresh to get correct order
      const tasksResponse = await taskAPI.getProjectTasks(projectId);
      setTasks(tasksResponse.data.tasks);
    } catch (error) {
      console.error('Error moving task:', error);
      // Revert on error
      fetchProjectAndTasks();
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskAPI.createTask({
        ...taskData,
        project: projectId,
      });
      setShowCreateModal(false);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskAPI.deleteTask(taskId);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await taskAPI.updateTask(taskId, updates);
      fetchProjectAndTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="error-container">
        <p>{error || 'Project not found'}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="kanban-board">
      <header className="kanban-header">
        <div className="kanban-header-left">
          <button onClick={() => navigate('/dashboard')} className="btn btn-back">
            ← Back
          </button>
          <div>
            <h1>{project.name}</h1>
            {project.description && <p className="project-description">{project.description}</p>}
          </div>
        </div>
        <div className="kanban-header-right">
          <button onClick={() => setShowQAModal(true)} className="btn btn-ai">
            🤖 Ask AI
          </button>
          <button onClick={() => setShowSummaryModal(true)} className="btn btn-ai">
            ✨ Summarize
          </button>
          <button onClick={() => setShowCreateModal(true)} className="btn btn-primary">
            + Add Task
          </button>
        </div>
      </header>

      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-columns">
          {COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateTask}
          initialStatus={selectedColumn}
        />
      )}

      {showSummaryModal && (
        <AISummaryModal
          projectId={projectId}
          projectName={project.name}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {showQAModal && (
        <AIQAModal
          projectId={projectId}
          projectName={project.name}
          onClose={() => setShowQAModal(false)}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
