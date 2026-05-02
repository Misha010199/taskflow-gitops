import { Draggable } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faClock,
  faGripVertical,
  faCalendar,
  faFlag,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";

export default function TaskCard({
  task,
  index,
  onDelete,
  onEdit,
  onUpdate,
  statusColor,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getTimeAgo = () => {
    if (!task.created_at) return "Just now";
    const date = new Date(task.created_at + "Z");
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60);
    if (diff < 1) return "Just now";
    if (diff < 60) return `${diff} min ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return `${Math.floor(diff / 1440)} days ago`;
  };

  const isOverdue = () => {
    if (!task.due_date || task.status === "done") return false;
    return new Date(task.due_date) < new Date();
  };

  const priorityColors = {
    high: { color: "#ef4444", label: "High" },
    medium: { color: "#f59e0b", label: "Medium" },
    low: { color: "#10b981", label: "Low" },
  };

  const priority = priorityColors[task.priority] || priorityColors.medium;

  const labelColors = {
    Bug: "#ef4444",
    Feature: "#8b5cf6",
    Enhancement: "#10b981",
    Documentation: "#3b82f6",
    Urgent: "#f97316",
  };

  return (
    <>
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`task-card ${snapshot.isDragging ? "dragging" : ""} ${isHovered ? "hovered" : ""} ${isOverdue() ? "overdue" : ""}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => setShowDetails(true)}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            <div className="drag-handle" {...provided.dragHandleProps}>
              <FontAwesomeIcon icon={faGripVertical} className="drag-icon" />
            </div>

            <div className="task-content">
              <div className="task-header">
                <div
                  className="task-status"
                  style={{ backgroundColor: statusColor }}
                />
                <div className="task-actions">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="task-action-btn delete-btn"
                    title="Delete task"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              </div>

              <p className="task-title">{task.title}</p>

              <div
                className="task-priority"
                style={{ backgroundColor: priority.color }}
              >
                <FontAwesomeIcon icon={faFlag} />
                <span>{priority.label}</span>
              </div>

              {task.labels && task.labels.length > 0 && (
                <div className="task-labels">
                  {task.labels.map((label, idx) => (
                    <span
                      key={idx}
                      className="task-label"
                      style={{
                        backgroundColor: labelColors[label] || "#667eea",
                      }}
                    >
                      <FontAwesomeIcon icon={faTag} />
                      {label}
                    </span>
                  ))}
                </div>
              )}

              <div className="task-footer">
                <div className="task-time">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{getTimeAgo()}</span>
                </div>
                {task.due_date && (
                  <div
                    className={`task-due ${isOverdue() ? "overdue-text" : ""}`}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{new Date(task.due_date).toLocaleDateString()}</span>
                    {isOverdue() && (
                      <span className="overdue-badge">Overdue!</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Draggable>

      {showDetails && (
        <TaskDetailsModal
          task={task}
          onClose={() => setShowDetails(false)}
          onUpdate={onUpdate}
          darkMode={document
            .querySelector(".app")
            .classList.contains("dark-mode")}
        />
      )}
    </>
  );
}
