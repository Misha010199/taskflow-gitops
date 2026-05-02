# 📌 TaskFlow | GitOps-Based Task Management System

## 📖 Overview

TaskFlow is a modern task management web application inspired by Trello. It allows users to manage tasks across different stages (To Do, In Progress, Done) with an intuitive drag-and-drop interface.

This project demonstrates a **GitOps-based CI/CD pipeline** using Google Cloud Platform, where changes pushed to GitHub automatically trigger build and deployment to Kubernetes.

---

## 🚀 Features

- Task board with multiple columns
- Drag-and-drop task movement
- Create, edit, and delete tasks
- Task timestamps ("time ago")
- Labels and priority system
- Light/Dark mode
- Responsive UI
- REST API (JSON)
- GitOps automated deployment

---

## 🧱 Tech Stack

### Frontend

- React (Vite)
- CSS

### Backend

- Flask (Python)
- Flask-CORS
- Supabase (Database)

### DevOps & Cloud

- Google Cloud Build
- Google Kubernetes Engine (GKE)
- Artifact Registry
- Docker
- GitHub

---

## 🏗️ Architecture

The project follows a GitOps architecture:

1. Code is pushed to GitHub
2. Cloud Build trigger starts
3. Docker images are built
4. Images are pushed to Artifact Registry
5. Kubernetes deploys the updated application

---
