# 🎓 Student Management System

A full-stack Student Management System built with **React**, **Express.js**, **SQLite**, **Docker**, and **Azure DevOps CI/CD**.

The application allows administrators to manage student records through a modern dashboard while providing a production-ready deployment pipeline using Azure services.

---

## 🚀 Live Demo

### Application
https://smops-app-2026.azurewebsites.net/dashboard

### Health Endpoint
https://smops-app-2026.azurewebsites.net/health

### API Endpoint
https://smops-app-2026.azurewebsites.net/api/students

---

# 📌 Features

## Student Management
- Add Student
- Edit Student
- Delete Student
- Search Students
- Filter Students
- Pagination Support

## Dashboard Analytics
- Total Students
- Department Distribution
- Active Semesters
- Recently Added Students
- Charts & Statistics

## Backend API
- RESTful API Architecture
- SQLite Database
- Health Monitoring Endpoint
- Centralized Error Handling
- Request Logging

## Production Features
- Dockerized Application
- Multi-stage Docker Build
- Non-root Container User
- Health Checks
- CI/CD Automation
- Azure App Service Deployment

---

# 🏗️ Architecture

```text
┌────────────────────────────┐
│        React Frontend      │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│      Express Backend       │
│        REST API            │
└──────────────┬─────────────┘
               │
               ▼
┌────────────────────────────┐
│       SQLite Database      │
└────────────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend
- React
- React Router
- Axios
- Vite
- Lucide React

## Backend
- Node.js
- Express.js
- SQLite3
- Morgan
- CORS

## DevOps
- Docker
- Docker Compose
- Azure Container Registry (ACR)
- Azure App Service
- Azure DevOps Pipelines

---

# 📂 Project Structure

```text
student-management-system/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── database/
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
├── azure-pipelines.yml
└── README.md
```

---

# ⚙️ Local Development

## Clone Repository

```bash
git clone https://github.com/Sameer4445/smops.git
cd smops
```

---

## Backend Setup

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🐳 Docker Deployment

Build and run locally:

```bash
docker-compose up --build
```

Application:

```text
http://localhost:3000
```

---

# ☁️ Azure Deployment

The application is deployed using:

- Azure App Service
- Azure Container Registry
- Azure DevOps CI/CD

Deployment Flow:

```text
GitHub Push
     │
     ▼
Azure DevOps Pipeline
     │
     ▼
Docker Build
     │
     ▼
Azure Container Registry
     │
     ▼
Azure App Service
     │
     ▼
Health Verification
```

---

# 🔄 CI/CD Pipeline

The pipeline performs:

### Stage 1
Source Checkout

### Stage 2
Dependency Installation

### Stage 3
Application Build

### Stage 4
Docker Image Build

### Stage 5
Push Image to Azure Container Registry

### Stage 6
Deploy to Azure App Service

### Stage 7
Deployment Verification

---

# 📊 API Endpoints

## Health Check

```http
GET /health
```

Response:

```json
{
  "status": "UP"
}
```

---

## Get Students

```http
GET /api/students
```

---

## Create Student

```http
POST /api/students
```

---

## Update Student

```http
PUT /api/students/:id
```

---

## Delete Student

```http
DELETE /api/students/:id
```

---

# 🔐 Security & Best Practices

- Non-root Docker Container
- Multi-stage Docker Build
- Health Checks
- Environment Variables
- Centralized Error Handling
- Production Logging
- CORS Configuration

---

# 📈 DevOps Highlights

✅ Docker Multi-stage Build

✅ Azure Container Registry Integration

✅ Azure App Service Deployment

✅ Azure DevOps CI/CD Pipeline

✅ Automated Health Verification

✅ Single-Container Full-Stack Architecture

---

# 👨‍💻 Author

### Sameer Pathan

B.Tech CSE (Data Science)

SB Jain Institute of Technology, Nagpur

GitHub:
https://github.com/Sameer4445

---

# ⭐ Future Enhancements

- Authentication & Authorization
- Role-Based Access Control
- PostgreSQL Migration
- Unit & Integration Testing
- Kubernetes Deployment
- Monitoring & Alerting
- HTTPS Custom Domain
- Terraform Infrastructure as Code
