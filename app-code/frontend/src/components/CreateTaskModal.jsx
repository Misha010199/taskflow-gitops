import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFlag,
  faTag,
  faCalendar,
  faSave,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "./TaskDetailsModal.css";

const labelOptions = [
  "Bug",
  "Feature",
  "Enhancement",
  "Documentation",
  "Urgent",
];
const priorityOptions = ["low", "medium", "high"];

export default function CreateTaskModal({
  onClose,
  onSave,
  darkMode,
  columnStatus,
}) {
  const [title, setTitle] = useState("");
  const [labels, setLabels] = useState([]);
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }
    // ✅ FIX: Add description as 6th parameter
    onSave(title, columnStatus, labels, priority, dueDate || null, description);
    onClose();
  };

  const toggleLabel = (label) => {
    if (labels.includes(label)) {
      setLabels(labels.filter((l) => l !== label));
    } else {
      setLabels([...labels, label]);
    }
  };

  const priorityColors = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#10b981",
  };

  const labelColors = {
    Bug: "#ef4444",
    Feature: "#8b5cf6",
    Enhancement: "#10b981",
    Documentation: "#3b82f6",
    Urgent: "#f97316",
  };

  return (
    <div className="details-overlay" onClick={onClose}>
      <div
        className={`details-modal ${darkMode ? "dark" : "light"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="details-header">
          <h2>
            <FontAwesomeIcon icon={faPlus} /> Create New Task
          </h2>
          <button onClick={onClose} className="close-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="details-content">
          <div className="detail-field">
            <label>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="title-input"
              autoFocus
            />
          </div>

          <div className="detail-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description (optional)..."
              rows="3"
            />
          </div>

          <div className="detail-field">
            <label>
              <FontAwesomeIcon icon={faFlag} /> Priority
            </label>
            <div className="priority-buttons">
              {priorityOptions.map((p) => (
                <button
                  key={p}
                  className={`priority-btn ${priority === p ? "active" : ""}`}
                  style={{
                    backgroundColor:
                      priority === p ? priorityColors[p] : "transparent",
                    borderColor: priorityColors[p],
                    color: priority === p ? "white" : priorityColors[p],
                  }}
                  onClick={() => setPriority(p)}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-field">
            <label>
              <FontAwesomeIcon icon={faTag} /> Labels
            </label>
            <div className="label-buttons">
              {labelOptions.map((label) => (
                <button
                  key={label}
                  className={`label-btn ${labels.includes(label) ? "active" : ""}`}
                  style={{
                    backgroundColor: labels.includes(label)
                      ? labelColors[label]
                      : "transparent",
                    borderColor: labelColors[label],
                    color: labels.includes(label)
                      ? "white"
                      : labelColors[label],
                  }}
                  onClick={() => toggleLabel(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-field">
            <label>
              <FontAwesomeIcon icon={faCalendar} /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="details-actions">
            <button onClick={handleSave} className="save-btn">
              <FontAwesomeIcon icon={faSave} />
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
