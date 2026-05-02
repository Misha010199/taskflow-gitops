import { Droppable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faInbox } from "@fortawesome/free-solid-svg-icons";
import TaskCard from "./TaskCard";
import { useState, useEffect } from "react";
import CreateTaskModal from "./CreateTaskModal";

export default function Column({
  column,
  tasks,
  onDeleteTask,
  onEditTask,
  onAddTask,
  onUpdateTask,
}) {
  const columnTasks = tasks.filter((t) => t.status === column.id);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check dark mode
  useEffect(() => {
    const isDark = document
      .querySelector(".app")
      ?.classList.contains("dark-mode");
    setDarkMode(isDark);
  }, []);

  const handleAddCard = (
    title,
    status,
    labels,
    priority,
    dueDate,
    description,
  ) => {
    onAddTask(title, status, labels, priority, dueDate, description);
  };

  return (
    <>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
          >
            <div className="column-header">
              <div className="column-title">
                <FontAwesomeIcon
                  icon={column.icon}
                  className="column-icon"
                  style={{ color: column.color }}
                />
                <h3>{column.title}</h3>
                <span className="task-count">{columnTasks.length}</span>
              </div>
            </div>

            <div className="tasks-container">
              {columnTasks.length === 0 && (
                <div className="empty-state">
                  <FontAwesomeIcon icon={faInbox} className="empty-icon" />
                  <p>No tasks here</p>
                  <button
                    className="add-card-btn"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add a card
                  </button>
                </div>
              )}

              {columnTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onDelete={() => onDeleteTask(task.id)}
                  onEdit={() => onEditTask(task.id, task.title)}
                  onUpdate={onUpdateTask}
                  statusColor={column.color}
                />
              ))}
              {provided.placeholder}
            </div>

            <button
              className="add-card-footer"
              onClick={() => setShowCreateModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} /> Add a card
            </button>
          </div>
        )}
      </Droppable>

      {showCreateModal && (
        <CreateTaskModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleAddCard}
          darkMode={darkMode}
          columnStatus={column.id}
        />
      )}
    </>
  );
}
