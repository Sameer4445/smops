# 🎓 Student Management System

> A production-ready full-stack web application demonstrating an end-to-end **Azure DevOps CI/CD pipeline** with React 19, Node.js, Docker, Azure Container Registry, and Azure App Service.

[![Azure DevOps Pipeline](https://img.shields.io/badge/Azure%20DevOps-Pipeline-0078D4?logo=azure-devops)](https://azure.microsoft.com/en-us/products/devops)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?logo=docker)](https://www.docker.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Azure DevOps CI/CD                       │
│                                                             │
│  GitHub / Azure Repos                                       │
│       │  push to main                                       │
│       ▼                                                     │
│  ┌─────────────┐  ┌──────┐  ┌───────┐  ┌───────────────┐  │
│  │   Install   │→ │ Lint │→ │ Build │→ │ Docker Build  │  │
│  │  npm ci ×2  │  │ ESL  │  │ Vite  │  │ multi-stage   │  │
│  └─────────────┘  └──────┘  └───────┘  └───────┬───────┘  │
│                                                  │          │
│  ┌──────────────────┐  ┌────────────┐  ┌────────▼──────┐  │
│  │ /health verified │← │ App Service│← │  Push to ACR  │  │
│  │   Stage 7        │  │  Stage 6   │  │   Stage 5     │  │
│  └──────────────────┘  └────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   Docker Compose (Local)                      │
│                                                              │
│  Browser  →  ┌─────────────────────┐  →  ┌──────────────┐  │
│  :5173       │  Frontend (Nginx)   │     │   Backend    │  │
│              │  React 19 + Vite    │ /api│  Express.js  │  │
│              │  Port 5173          │────>│  Port 3000   │  │
│              └─────────────────────┘     └──────┬───────┘  │
│                                                  │          │
│                                          ┌───────▼───────┐  │
│                                          │  SQLite DB    │  │
│                                          │  (Volume)     │  │
│                                          └───────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Dashboard** | Stats cards, bar + pie charts, recent students |
| 👥 **Students List** | Paginated table with search, sort, and filters |
| ➕ **Add Student** | Form with full validation and duplicate detection |
| ✏️ **Edit Student** | Pre-filled form with live validation |
| 🗑️ **Delete Student** | Confirmation modal with safe deletion |
| 🔍 **Search & Filter** | Search by name/email/ID, filter by department/semester |
| 📱 **Responsive** | Mobile-first, works on all screen sizes |
| 🏥 **Health Check** | `/health` endpoint for monitoring and pipeline verification |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 5** — build tool and dev server
- **Tailwind CSS 3** — utility-first styling
- **React Router 6** — client-side routing
- **Axios** — HTTP client
- **Recharts** — charts/data visualization

### Backend
- **Node.js 20** — runtime
- **Express.js 4** — web framework
- **better-sqlite3** — embedded SQLite database
- **Winston** — structured logging
- **Morgan** — HTTP request logging

### DevOps
- **Docker** — multi-stage containerisation
- **Docker Compose** — local orchestration
- **Azure DevOps Pipelines** — CI/CD (7 stages)
- **Azure Container Registry (ACR)** — container image storage
- **Azure App Service** — production hosting

---

## 🚀 Quick Start – Local Development

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/student-management-system.git
cd student-management-system

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend (optional – Vite proxies /api to localhost:3000 automatically)
cp frontend/src/.env.example frontend/.env
```

### 3. Start the Backend

```bash
cd backend
npm run dev
# API running at http://localhost:3000
# Health check: http://localhost:3000/health
```

### 4. Start the Frontend

```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

---

## 🐳 Docker – Local Production Build

### Build & Run with Docker Compose

```bash
# From the project root
docker-compose up --build

# Frontend → http://localhost:5173
# Backend  → http://localhost:3000
# Health   → http://localhost:3000/health
```

### Run in detached mode

```bash
docker-compose up -d --build
docker-compose logs -f       # stream logs
docker-compose down          # stop and remove containers
```

### Build images individually

```bash
# Backend
docker build -t sms-backend:latest ./backend

# Frontend
docker build -t sms-frontend:latest ./frontend

# Run backend
docker run -p 3000:3000 --name sms-api sms-backend:latest

# Run frontend
docker run -p 5173:5173 --name sms-web sms-frontend:latest
```

---

## ☁️ Azure Setup

### 1. Azure Container Registry

```bash
# Create a resource group
az group create --name sms-rg --location eastus

# Create the Container Registry (Basic SKU is fine)
az acr create \
  --resource-group sms-rg \
  --name <YOUR_ACR_NAME> \
  --sku Basic \
  --admin-enabled true

# Get login credentials
az acr credential show --name <YOUR_ACR_NAME>
```

### 2. Azure App Service (Web App for Containers)

```bash
# Create an App Service Plan (Linux, B1 = free tier eligible)
az appservice plan create \
  --name sms-plan \
  --resource-group sms-rg \
  --is-linux \
  --sku B1

# Create the Web App
az webapp create \
  --name <YOUR_APP_NAME> \
  --resource-group sms-rg \
  --plan sms-plan \
  --deployment-container-image-name <YOUR_ACR_NAME>.azurecr.io/sms-backend:latest

# Configure environment variables on App Service
az webapp config appsettings set \
  --name <YOUR_APP_NAME> \
  --resource-group sms-rg \
  --settings NODE_ENV=production PORT=3000 LOG_LEVEL=info
```

### 3. Azure DevOps Pipeline Setup

1. **Create an Azure DevOps project** at [dev.azure.com](https://dev.azure.com)

2. **Add a Docker Registry service connection:**
   - Project Settings → Service Connections → New → Docker Registry
   - Choose Azure Container Registry
   - Name it to match `DOCKER_REGISTRY_SERVICE_CONNECTION` in your pipeline variable

3. **Add an Azure Resource Manager service connection:**
   - Project Settings → Service Connections → New → Azure Resource Manager
   - Name it to match `AZURE_SUBSCRIPTION`

4. **Add pipeline variables** (Project → Pipelines → Library or pipeline variables):

   | Variable | Value | Secret? |
   |----------|-------|---------|
   | `ACR_NAME` | your ACR name (e.g. `mysmsacr`) | No |
   | `DOCKER_REGISTRY_SERVICE_CONNECTION` | name from step 2 | No |
   | `AZURE_SUBSCRIPTION` | name from step 3 | No |
   | `WEB_APP_NAME` | your App Service name | No |

5. **Import the pipeline:**
   - Pipelines → New Pipeline → Azure Repos Git → select repo → Existing YAML → `/azure-pipelines.yml`

6. **Run the pipeline** – all 7 stages will execute on push to `main`.

---

## 📡 API Reference

Base URL: `http://localhost:3000` (local) | `https://<app>.azurewebsites.net` (production)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/students` | List students (with filters) |
| `GET` | `/api/students/stats` | Dashboard statistics |
| `GET` | `/api/students/:id` | Get single student |
| `POST` | `/api/students` | Create student |
| `PUT` | `/api/students/:id` | Update student |
| `DELETE` | `/api/students/:id` | Delete student |

### Health Check Response

```json
{
  "status": "UP",
  "application": "Student Management System",
  "environment": "production",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": "3600s"
}
```

### List Students – Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or email |
| `studentId` | string | Search by student ID |
| `department` | string | Filter by department |
| `semester` | number | Filter by semester (1–8) |
| `sortBy` | string | Column to sort by |
| `sortOrder` | `ASC` \| `DESC` | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10) |

---

## 📁 Project Structure

```
student-management-system/
├── azure-pipelines.yml          # Azure DevOps CI/CD (7 stages)
├── docker-compose.yml           # Local Docker orchestration
├── .env.example                 # Root environment template
├── .gitignore
├── README.md
│
├── scripts/
│   └── verify-deployment.sh    # Stage 7 health check script
│
├── backend/
│   ├── Dockerfile               # Multi-stage Node.js image
│   ├── server.js                # Express app entry point
│   ├── package.json
│   ├── .env.example
│   ├── .eslintrc.js
│   ├── controllers/
│   │   └── studentController.js # Request/response logic
│   ├── routes/
│   │   ├── studentRoutes.js     # /api/students endpoints
│   │   └── healthRoutes.js      # /health endpoint
│   ├── models/
│   │   └── studentModel.js      # All DB queries
│   ├── database/
│   │   └── init.js              # SQLite init + seed
│   └── middleware/
│       ├── validation.js        # Request validation
│       ├── errorHandler.js      # Global error handler
│       ├── requestLogger.js     # Request timing middleware
│       └── logger.js            # Winston logger config
│
└── frontend/
    ├── Dockerfile               # Multi-stage Nginx/React image
    ├── nginx.conf               # Nginx SPA + proxy config
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx              # Router setup
        ├── main.jsx             # React entry point
        ├── index.css            # Tailwind + custom classes
        ├── pages/
        │   ├── Dashboard.jsx    # Stats + charts
        │   ├── Students.jsx     # Table with CRUD
        │   ├── AddStudent.jsx   # Create form
        │   ├── EditStudent.jsx  # Edit form
        │   └── NotFound.jsx     # 404 page
        ├── components/
        │   ├── layout/
        │   │   ├── Sidebar.jsx
        │   │   └── Header.jsx
        │   ├── students/
        │   │   ├── StudentForm.jsx
        │   │   ├── DepartmentBadge.jsx
        │   │   └── DeleteConfirmModal.jsx
        │   └── ui/
        │       ├── ToastProvider.jsx
        │       ├── Spinner.jsx
        │       ├── Modal.jsx
        │       ├── Pagination.jsx
        │       ├── EmptyState.jsx
        │       └── StatCard.jsx
        ├── hooks/
        │   ├── useStudents.js   # List state + debounced filters
        │   └── useStats.js      # Dashboard stats
        └── services/
            └── api.js           # Axios instance + API functions
```

---

## 🔄 CI/CD Pipeline Stages

```
Git Push to main
     │
     ▼
┌────────────┐     ┌────────┐     ┌─────────┐     ┌──────────────┐
│ Stage 1    │────>│Stage 2 │────>│ Stage 3 │────>│   Stage 4    │
│ Install    │     │  Lint  │     │  Build  │     │ Docker Build │
│ npm ci ×2  │     │ ESLint │     │  Vite   │     │ Multi-stage  │
└────────────┘     └────────┘     └─────────┘     └──────┬───────┘
                                                          │
                                                          ▼
┌────────────┐     ┌────────┐     ┌─────────────────────┐│
│  Stage 7   │<────│Stage 6 │<────│       Stage 5        ││
│   Verify   │     │ Deploy │     │     Push to ACR      ││
│  /health   │     │  AAS   │     │  ACR.azurecr.io      │◄┘
└────────────┘     └────────┘     └─────────────────────┘
```

---

## 🖼️ Screenshots

> _Run the app locally or deploy to Azure to see it live._

| Page | Description |
|------|-------------|
| Dashboard | Statistics cards, bar chart, pie chart, recent students |
| Students List | Sortable table with search, department/semester filters, pagination |
| Add Student | Clean form with inline validation and success toast |
| Edit Student | Pre-filled form, server-side error mapping |
| 404 Page | Professional not-found page with navigation |

---

## 👨‍💻 Author

**Final-Year Computer Science Student** — Azure DevOps & Full-Stack Development Portfolio Project

---

## 📄 License

MIT © 2024
