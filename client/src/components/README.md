# Kanban Board Components

This directory contains all React components for the Project Management Kanban Board system.

## Components Overview

### 1. ProjectList.js
**Purpose**: Display a grid of project cards on the dashboard.

**Props**:
- `projects` (Array): List of project objects
- `onDelete` (Function): Delete handler - `(projectId) => void`
- `onRefresh` (Function): Refresh handler - `() => void`
- `currentUserId` (String): Current user's ID for ownership checks

**Features**:
- Grid layout with responsive design
- Click to navigate to project details
- Delete button (only shown for project owners)
- Empty state for no projects
- Date formatting
- Accessibility support (ARIA labels, keyboard navigation)

**Usage**:
```jsx
import { ProjectList } from './components';

<ProjectList
  projects={projects}
  onDelete={handleDeleteProject}
  onRefresh={handleRefresh}
  currentUserId={user.id}
/>
```

---

### 2. CreateProjectModal.js
**Purpose**: Modal dialog for creating new projects.

**Props**:
- `onClose` (Function): Close modal handler - `() => void`
- `onCreate` (Function): Create handler - `(projectData) => Promise`

**Features**:
- Form validation (name required, min 3 chars, max 100 chars)
- Description field (optional, max 500 chars)
- Character counter
- Error handling and display
- Loading states during submission
- Click outside to close

**Usage**:
```jsx
import { CreateProjectModal } from './components';

{showCreateModal && (
  <CreateProjectModal
    onClose={() => setShowCreateModal(false)}
    onCreate={handleCreateProject}
  />
)}
```

---

### 3. KanbanColumn.js
**Purpose**: Represents a column in the Kanban board (To Do, In Progress, In Review, Done).

**Props**:
- `column` (Object): Column data with `id` and `title`
- `tasks` (Array): Tasks in this column
- `onDeleteTask` (Function): Delete task handler - `(taskId) => void`
- `onUpdateTask` (Function): Update task handler - `(task) => void`

**Features**:
- Droppable area for drag-and-drop
- Visual feedback when dragging over
- Task count badge
- Empty state when no tasks
- Color-coded headers per status
- Scrollable content area

**Usage**:
```jsx
import { KanbanColumn } from './components';

<KanbanColumn
  column={{ id: 'todo', title: 'To Do' }}
  tasks={todoTasks}
  onDeleteTask={handleDeleteTask}
  onUpdateTask={handleUpdateTask}
/>
```

---

### 4. TaskCard.js
**Purpose**: Individual draggable task card within a column.

**Props**:
- `task` (Object): Task data
- `onDelete` (Function): Delete handler - `(taskId) => void`
- `onUpdate` (Function): Update/edit handler - `(task) => void`

**Features**:
- Draggable using @dnd-kit/sortable
- Priority badge (high/medium/low)
- Due date display with smart formatting (Today, Tomorrow, Overdue)
- Truncated description (150 chars)
- Click to edit
- Delete button with confirmation
- Visual states (hover, dragging)

**Usage**:
```jsx
import { TaskCard } from './components';

<TaskCard
  task={task}
  onDelete={handleDelete}
  onUpdate={handleUpdate}
/>
```

---

### 5. CreateTaskModal.js
**Purpose**: Modal dialog for creating new tasks.

**Props**:
- `onClose` (Function): Close modal handler - `() => void`
- `onCreate` (Function): Create handler - `(taskData) => Promise`
- `initialStatus` (String, optional): Initial status (default: 'todo')

**Features**:
- Form fields: title, description, priority, due date, status
- Validation (title required, min 3 chars, due date not in past)
- Character counter for description
- Date picker with minimum date validation
- Dropdown selects for priority and status
- Error handling

**Usage**:
```jsx
import { CreateTaskModal } from './components';

{showCreateTask && (
  <CreateTaskModal
    onClose={() => setShowCreateTask(false)}
    onCreate={handleCreateTask}
    initialStatus="in_progress"
  />
)}
```

---

### 6. EditTaskModal.js
**Purpose**: Modal dialog for editing existing tasks.

**Props**:
- `task` (Object): Task to edit
- `onClose` (Function): Close modal handler - `() => void`
- `onUpdate` (Function): Update handler - `(taskId, taskData) => Promise`

**Features**:
- Pre-filled form with task data
- Same validation as CreateTaskModal
- Auto-fill on component mount
- Save changes button
- All fields editable (title, description, priority, due date, status)

**Usage**:
```jsx
import { EditTaskModal } from './components';

{editingTask && (
  <EditTaskModal
    task={editingTask}
    onClose={() => setEditingTask(null)}
    onUpdate={handleUpdateTask}
  />
)}
```

---

### 7. AISummaryModal.js
**Purpose**: Modal displaying AI-generated project summary.

**Props**:
- `projectId` (String): Project ID to summarize
- `projectName` (String): Project name for display
- `onClose` (Function): Close modal handler - `() => void`

**Features**:
- Fetches AI summary on mount
- Loading state with spinner
- Error state with retry button
- Summary sections:
  - Overall overview text
  - Task breakdown by status (cards)
  - Priority summary
  - Key insights (bullet points)
  - Upcoming tasks
- Visual icons and color coding

**Usage**:
```jsx
import { AISummaryModal } from './components';

{showAISummary && (
  <AISummaryModal
    projectId={projectId}
    projectName={project.name}
    onClose={() => setShowAISummary(false)}
  />
)}
```

---

### 8. AIQAModal.js
**Purpose**: Modal for AI Q&A chat interface.

**Props**:
- `projectId` (String): Project ID for context
- `projectName` (String): Project name for display
- `onClose` (Function): Close modal handler - `() => void`

**Features**:
- Chat-like interface
- Multiple questions/answers in conversation
- Suggestion chips for common questions
- Related tasks display with answers
- Clear conversation button
- Loading state while AI responds
- Error handling
- Timestamp for each message
- Auto-scroll to latest message

**Usage**:
```jsx
import { AIQAModal } from './components';

{showAIQA && (
  <AIQAModal
    projectId={projectId}
    projectName={project.name}
    onClose={() => setShowAIQA(false)}
  />
)}
```

---

## Design System

### Colors (Purple Theme)
- **Primary**: #667eea (purple)
- **Primary Hover**: #5568d3
- **Background**: #f7fafc
- **Border**: #e2e8f0
- **Text Primary**: #1a202c
- **Text Secondary**: #718096
- **Error**: #e53e3e
- **Success**: #48bb78

### Status Colors
- **To Do**: Teal (#81e6d9)
- **In Progress**: Indigo (#a5b4fc)
- **In Review**: Yellow (#fcd34d)
- **Done**: Green (#6ee7b7)

### Priority Colors
- **High**: Red (#e53e3e, background: #fed7d7)
- **Medium**: Orange (#ed8936, background: #feebc8)
- **Low**: Green (#2f855a, background: #c6f6d5)

### Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- **Heading 1**: 32px / 700 weight
- **Heading 2**: 24px / 600 weight
- **Body**: 14px / 400 weight
- **Small**: 12-13px / 400 weight

### Spacing
- Small gap: 8px
- Medium gap: 12-16px
- Large gap: 20-24px
- Section padding: 20-24px

### Border Radius
- Small: 6px
- Medium: 8px
- Large: 12px
- Pills: 20-24px

### Shadows
- Small: 0 2px 8px rgba(0, 0, 0, 0.1)
- Medium: 0 4px 12px rgba(102, 126, 234, 0.15)
- Large: 0 20px 60px rgba(0, 0, 0, 0.3)

---

## Accessibility Features

All components include:
- ARIA labels and roles
- Keyboard navigation support
- Focus states
- Screen reader friendly
- Semantic HTML
- Color contrast compliance

---

## Dependencies

- `react` - Core React library
- `react-router-dom` - Navigation
- `lucide-react` - Icon library
- `@dnd-kit/core` - Drag and drop core
- `@dnd-kit/sortable` - Sortable functionality
- `@dnd-kit/utilities` - Utilities for drag and drop

---

## File Structure

```
components/
├── index.js                    # Central export file
├── ProjectList.js              # Project grid component
├── ProjectList.css
├── CreateProjectModal.js       # Create project modal
├── CreateProjectModal.css
├── KanbanColumn.js             # Kanban column
├── KanbanColumn.css
├── TaskCard.js                 # Task card (draggable)
├── TaskCard.css
├── CreateTaskModal.js          # Create task modal
├── CreateTaskModal.css
├── EditTaskModal.js            # Edit task modal
├── EditTaskModal.css
├── AISummaryModal.js           # AI summary modal
├── AISummaryModal.css
├── AIQAModal.js                # AI Q&A chat modal
├── AIQAModal.css
└── README.md                   # This file
```

---

## Best Practices

1. **Always validate user input** before submission
2. **Show loading states** during async operations
3. **Handle errors gracefully** with user-friendly messages
4. **Provide visual feedback** for user actions
5. **Support keyboard navigation** for accessibility
6. **Use semantic HTML** for better SEO and accessibility
7. **Keep components focused** on single responsibility
8. **Pass callbacks** instead of direct API calls for flexibility
9. **Use CSS classes** instead of inline styles for maintainability
10. **Test on mobile devices** for responsive design

---

## Future Enhancements

- [ ] Add task filtering and search
- [ ] Support for task attachments
- [ ] Real-time collaboration features
- [ ] Task templates
- [ ] Keyboard shortcuts
- [ ] Dark mode support
- [ ] Export/import functionality
- [ ] Advanced analytics dashboard
- [ ] Task dependencies visualization
- [ ] Gantt chart view

---

## Support

For questions or issues, please contact the development team or create an issue in the repository.
