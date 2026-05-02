import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChartLine,
  faCheckCircle,
  faSpinner,
  faCircle,
  faFlag,
  faTags,
  faCalendar,
  faFire,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import "./AnalyticsModal.css";

export default function AnalyticsModal({ data, onClose, darkMode }) {
  if (!data) return null;

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
    <div className="analytics-overlay" onClick={onClose}>
      <div
        className={`analytics-modal ${darkMode ? "dark" : "light"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="analytics-header">
          <h2>
            <FontAwesomeIcon icon={faChartLine} />
            Analytics Dashboard
          </h2>
          <button onClick={onClose} className="close-btn">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="analytics-content">
          {/* Summary Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="stat-icon success"
              />
              <div className="stat-info">
                <span className="stat-label">Completion Rate</span>
                <span className="stat-number">{data.completion_rate}%</span>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faFire} className="stat-icon warning" />
              <div className="stat-info">
                <span className="stat-label">Tasks Created (7d)</span>
                <span className="stat-number">{data.created_last_week}</span>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faCalendar} className="stat-icon danger" />
              <div className="stat-info">
                <span className="stat-label">Overdue Tasks</span>
                <span className="stat-number">{data.overdue}</span>
              </div>
            </div>
            <div className="stat-card">
              <FontAwesomeIcon icon={faArrowTrendUp} className="stat-icon" />
              <div className="stat-info">
                <span className="stat-label">Total Tasks</span>
                <span className="stat-number">{data.total}</span>
              </div>
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="analytics-section">
            <h3>
              <FontAwesomeIcon icon={faFlag} />
              Priority Distribution
            </h3>
            <div className="priority-bars">
              {Object.entries(data.priority_count).map(([priority, count]) => (
                <div key={priority} className="priority-item">
                  <span
                    className="priority-label"
                    style={{ color: priorityColors[priority] }}
                  >
                    {priority.toUpperCase()}
                  </span>
                  <div className="priority-bar-container">
                    <div
                      className="priority-bar"
                      style={{
                        width: `${(count / data.total) * 100}%`,
                        backgroundColor: priorityColors[priority],
                      }}
                    />
                  </div>
                  <span className="priority-count">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Labels Distribution */}
          {Object.keys(data.labels_count).length > 0 && (
            <div className="analytics-section">
              <h3>
                <FontAwesomeIcon icon={faTags} />
                Labels Distribution
              </h3>
              <div className="labels-grid">
                {Object.entries(data.labels_count).map(([label, count]) => (
                  <div
                    key={label}
                    className="label-tag"
                    style={{ backgroundColor: labelColors[label] || "#667eea" }}
                  >
                    <span>{label}</span>
                    <span className="label-count">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completion Trend */}
          <div className="analytics-section">
            <h3>
              <FontAwesomeIcon icon={faArrowTrendUp} />
              Completion Trend (Last 7 Days)
            </h3>
            <div className="trend-chart">
              {data.completion_trend.map((day) => (
                <div key={day.date} className="trend-bar-container">
                  <div
                    className="trend-bar"
                    style={{
                      height: `${(day.completed / Math.max(...data.completion_trend.map((d) => d.completed), 1)) * 100}%`,
                      maxHeight: "100px",
                    }}
                  />
                  <span className="trend-label">{day.date.slice(5)}</span>
                  <span className="trend-value">{day.completed}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Task Status Distribution */}
          <div className="analytics-section">
            <h3>Task Status</h3>
            <div className="status-donut">
              <div className="status-item">
                <div className="status-color todo-bg" />
                <span>To Do: {data.todo}</span>
              </div>
              <div className="status-item">
                <div className="status-color doing-bg" />
                <span>In Progress: {data.in_progress}</span>
              </div>
              <div className="status-item">
                <div className="status-color done-bg" />
                <span>Done: {data.completed}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
