import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faFlag,
  faTag,
  faCalendar,
  faClock,
  faSave,
  faPen,
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

export default function TaskDetailsModal({
  task,
  onClose,
  onUpdate,
  darkMode,
}) {
  const [labels, setLabels] = useState(task.labels || []);
  const [priority, setPriority] = useState(task.priority || "medium");
  const [dueDate, setDueDate] = useState(
    task.due_date ? task.due_date.split("T")[0] : "",
  );
  const [description, setDescription] = useState(task.description || "");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSave = () => {
    onUpdate(task.id, { labels, priority, due_date: dueDate, description });
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
            <FontAwesomeIcon icon={faPen} /> Edit Task
          </h2>
          <button onClick={onClose} className="close-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="details-content">
          <div className="detail-field">
            <label>Title</label>
            <input
              type="text"
              value={task.title}
              disabled
              className="title-input"
            />
          </div>

          <div className="detail-field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
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

          <div className="detail-field">
            <label>
              <FontAwesomeIcon icon={faClock} /> Created
            </label>
            <input
              type="text"
              value={new Date(task.created_at).toLocaleString()}
              disabled
            />
          </div>

          <div className="details-actions">
            <button onClick={handleSave} className="save-btn">
              <FontAwesomeIcon icon={faSave} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
