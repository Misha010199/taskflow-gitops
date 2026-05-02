import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faLayerGroup,
  faBars,
  faTimes,
  faSun,
  faMoon,
  faChartSimple,
  faCheckCircle,
  faSpinner,
  faCircle,
  faClipboardList,
  faFileCirclePlus,
  faChartLine,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import API from "./services/api";
import Column from "./components/Column";

import "./App.css";
import AnalyticsModal from "./components/AnalyticsModal";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    const res = await API.get("/tasks");
    setTasks(res.data);
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    const res = await API.get("/analytics");
    setAnalyticsData(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchAnalytics();
  }, []);

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    const updatedTasks = tasks.map((task) =>
      task.id.toString() === draggableId
        ? { ...task, status: destination.droppableId }
        : task,
    );
    setTasks(updatedTasks);

    try {
      await API.put(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to update task status", error);
      fetchTasks();
    }
  };

  const addTask = async (
    title,
    customStatus = null,
    labels = [],
    priority = "medium",
    dueDate = null,
    description = "",
  ) => {
    const taskTitle = title || prompt("Enter task title:");
    if (!taskTitle || taskTitle.trim() === "") return;

    const status = customStatus || "todo";

    try {
      const res = await API.post("/tasks", {
        title: taskTitle,
        status,
        labels,
        priority,
        due_date: dueDate,
        description,
      });
      setTasks([...tasks, res.data[0]]);
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to add task", error);
      alert("Failed to add task. Please try again.");
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((task) => task.id !== taskId));
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to delete task", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const editTask = async (taskId, currentTitle) => {
    const newTitle = prompt("Edit task title:", currentTitle);
    if (!newTitle || newTitle.trim() === "") return;

    try {
      await API.put(`/tasks/${taskId}`, { title: newTitle });
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, title: newTitle } : task,
        ),
      );
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to edit task", error);
      alert("Failed to edit task. Please try again.");
    }
  };

  const updateTaskDetails = async (taskId, updates) => {
    try {
      await API.put(`/tasks/${taskId}`, updates);
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task,
        ),
      );
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  const getTaskCounts = () => {
    const todo = tasks.filter((t) => t.status === "todo").length;
    const doing = tasks.filter((t) => t.status === "doing").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { todo, doing, done, total: tasks.length };
  };

  const counts = getTaskCounts();

  const columns = [
    { id: "todo", title: "To Do", color: "#ef4444", icon: faCircle },
    { id: "doing", title: "In Progress", color: "#f59e0b", icon: faSpinner },
    { id: "done", title: "Done", color: "#10b981", icon: faCheckCircle },
  ];

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Analytics Modal */}
      {showAnalytics && analyticsData && (
        <AnalyticsModal
          data={analyticsData}
          onClose={() => setShowAnalytics(false)}
          darkMode={darkMode}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <FontAwesomeIcon icon={faLayerGroup} className="logo-icon" />
            {sidebarOpen && <h2>TaskFlow</h2>}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="toggle-btn"
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        <div className="sidebar-content">
          <div className="stats-card">
            <h3>
              <FontAwesomeIcon icon={faChartSimple} /> Overview
            </h3>
            <div className="stat-item">
              <span>Total Tasks</span>
              <span className="stat-value">{counts.total}</span>
            </div>
            <div className="stat-item">
              <span>
                <FontAwesomeIcon icon={faCheckCircle} /> Completed
              </span>
              <span className="stat-value success">{counts.done}</span>
            </div>
            <div className="stat-item">
              <span>
                <FontAwesomeIcon icon={faSpinner} /> In Progress
              </span>
              <span className="stat-value warning">{counts.doing}</span>
            </div>
            <div className="stat-item">
              <span>
                <FontAwesomeIcon icon={faCircle} /> To Do
              </span>
              <span className="stat-value">{counts.todo}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${counts.total ? (counts.done / counts.total) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="completion-rate">
              {counts.total
                ? Math.round((counts.done / counts.total) * 100)
                : 0}
              % Complete
            </div>
          </div>

          {/* <button className="add-task-btn-sidebar" onClick={() => addTask()}>
            <FontAwesomeIcon icon={faFileCirclePlus} />
            {sidebarOpen && <span>New Task</span>}
          </button> */}

          <button
            className="analytics-btn-sidebar"
            onClick={() => setShowAnalytics(true)}
          >
            <FontAwesomeIcon icon={faChartLine} />
            {sidebarOpen && <span>Analytics</span>}
          </button>
        </div>

        <div className="sidebar-footer">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            {sidebarOpen && (
              <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
            )}
          </button>
        </div>
      </div>

      <div
        className={`main-content ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <header className="main-header">
          <h1 className="header-title">
            <FontAwesomeIcon icon={faClipboardList} />
            <span className="gradient-text"> Task Board</span>
            <span className="version-badge">
              {import.meta.env.VITE_APP_VERSION || "v1"}
            </span>
          </h1>
          {/* <div className="header-actions">
            <button onClick={() => addTask()} className="primary-btn">
              <FontAwesomeIcon icon={faPlus} />
              Add Task
            </button>
          </div> */}
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="board-container">
                {columns.map((col) => (
                  <Column
                    key={col.id}
                    column={col}
                    tasks={tasks}
                    onDeleteTask={deleteTask}
                    onEditTask={editTask}
                    onAddTask={addTask}
                    onUpdateTask={updateTaskDetails}
                  />
                ))}
              </div>
            </DragDropContext>
            <footer className="app-footer">
              <div className="footer-left">
                <span>Version: {import.meta.env.VITE_APP_VERSION || "v1"}</span>
                <span>•</span>
                <span>Build: {new Date().toLocaleDateString()}</span>
              </div>
              <div className="footer-right">
                <a
                  href={`${import.meta.env.VITE_API_URL}/tasks`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="api-link"
                >
                  📡 View JSON API
                </a>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
