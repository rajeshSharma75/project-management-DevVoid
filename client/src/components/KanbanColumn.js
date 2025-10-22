import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';
import './KanbanColumn.css';

/**
 * KanbanColumn Component
 *
 * Props:
 * - column: Object - Column data with id and title
 * - tasks: Array - Tasks in this column
 * - onDeleteTask: Function(taskId) - Delete task handler
 * - onUpdateTask: Function(task) - Update task handler
 */
const KanbanColumn = ({ column, tasks, onDeleteTask, onUpdateTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnClass = () => {
    let className = 'kanban-column';
    if (isOver) {
      className += ' column-over';
    }
    return className;
  };

  const getColumnHeaderClass = () => {
    const baseClass = 'column-header';
    switch (column.id) {
      case 'todo':
        return `${baseClass} header-todo`;
      case 'in_progress':
        return `${baseClass} header-in-progress`;
      case 'in_review':
        return `${baseClass} header-in-review`;
      case 'done':
        return `${baseClass} header-done`;
      default:
        return baseClass;
    }
  };

  const taskIds = tasks.map(task => task.id);

  return (
    <div className={getColumnClass()}>
      <div className={getColumnHeaderClass()}>
        <h3 className="column-title">{column.title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>

      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="column-content"
          role="list"
          aria-label={`${column.title} tasks`}
        >
          {tasks.length === 0 ? (
            <div className="empty-column">
              <p>No tasks</p>
              <span>Drag tasks here</span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
