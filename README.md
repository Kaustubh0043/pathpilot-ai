# VertexPath - AI-Powered Career Development Platform

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot&logoColor=6DB33F)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75C2?style=for-the-badge&logo=google-gemini&logoColor=white)](https://ai.google.dev/)

VertexPath is an all-in-one, microservice-ready AI Career Development Platform that helps students, freshers, and professionals optimize their career readiness using Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG).

---

## 📸 Product Screenshots

### 🔑 Secure OTP Account Verification
![Authentication & Verification](screenshots/verification.png)

### 📊 Gamified Skill Dashboard & Streak Tracker
![Dashboard](screenshots/dashboard.png)

### 🗺️ AI-Generated Syllabus Roadmaps & Checklist Tasks
![Syllabus Roadmap](screenshots/roadmap.png)

### 🛠️ Developer Project Sandbox Generator
![Project Generator](screenshots/project_generator.png)

---

## 🌟 Core Features

1. **Gamified Dashboard & Skill Tracker**: Tracks study streaks, shows GitHub-like activity calendars, and maps skill progress.
2. **AI Career Coach**: Interactive chat with role-based coaching guidelines and code snippet formatting.
3. **ATS Resume Analyzer**: Calculates resume compatibility scores, highlights tech stack gaps, and drafts layout enhancements.
4. **Job Description Matching (JD)**: Pastes descriptions and evaluates ATS alignment, detailing recommended preparations and missing tech.
5. **RAG Context QA**: Uploads PDFs/DOCXs/PPTXs to index them in ChromaDB and chats strictly using document data.
6. **AI Syllabus Roadmap**: Compiles custom week-by-week learning paths with hourly checklist tasks.
7. **Developer Project Sandbox**: Models directories, schemas, and REST endpoints based on target stacks.
8. **Interview Simulator**: Serves mock technical/HR questions, evaluates user answers with strict grading (assigning `0` for short/lazy replies), and suggests model answers.

---

## 🛠️ Tech Stack & Architecture

```mermaid
graph TD
    Client[Browser Frontend] -->|Vercel Host| ReactApp(Vite React UI)
    ReactApp -->|REST API Calls HTTP/1.1| SpringBoot(Java Spring Boot Core)
    SpringBoot -->|Docker/Railway| PostgresDB[(PostgreSQL Database)]
    SpringBoot -->|Internal Network| PythonAI(FastAPI Python AI Engine)
    PythonAI -->|API Calls| GeminiAPI[Google Gemini API]
```

- **Frontend**: React, Vite, TypeScript, Tailwind CSS, Lucide React, Axios, TanStack React Query.
- **Backend Core**: Spring Boot, Java 21, Spring Data JPA, Spring Security, JWT, PostgreSQL.
- **AI Microservice**: Python, FastAPI, LangChain, ChromaDB, Google Gemini API (native JSON mode).
- **Orchestration**: Docker, Docker Compose, Nginx.

---

## 🚀 Getting Started (Local Development)

### 📋 Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
- Acquire a **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### 🐳 Option A: Running via Docker Compose (Recommended)

1. Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
2. Build and boot all containers (PostgreSQL, Python AI Service, Spring Boot Backend, and React Frontend):
   ```bash
   docker compose up --build -d
   ```
3. Once starting successfully:
   - **React Frontend**: Access at [http://localhost:3000](http://localhost:3000)
   - **Spring Boot Backend**: REST Gateway at [http://localhost:8080](http://localhost:8080)
   - **FastAPI AI Engine**: API docs at [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL Database**: Port mapped to `5439` (to avoid clashing with local Postgres service on 5432).

---

### 🔧 Option B: Running Services Individually (Without Docker)

#### 1. Setup PostgreSQL Database
Create a local database named `pathpilot`:
```sql
CREATE DATABASE pathpilot;
```

#### 2. Start Python AI Service
```bash
cd pathpilot-ai-service
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python app/main.py
```

#### 3. Start Spring Boot Backend
Configure database credentials in `pathpilot-backend/src/main/resources/application.yml` and run:
```bash
cd pathpilot-backend
./mvnw spring-boot:run
```

#### 4. Start React Frontend
```bash
cd pathpilot-frontend
npm install
npm run dev
```

---

## ☁️ Production Deployment Guide (Vercel & Cloud)

### 1. Deploy Free PostgreSQL Database (Neon.tech)
Neon offers a perpetual free tier of Postgres.
1. Sign up on [Neon.tech](https://neon.tech/) and create a project.
2. Under **Connection Details**, copy your connection string (e.g. `postgresql://neondb_owner:npg_12345@ep-cool-fog-1234.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. Convert this string to **JDBC Format** for the backend configuration:
   * **`DATABASE_URL`**: `jdbc:postgresql://ep-cool-fog-1234.us-east-2.aws.neon.tech/neondb?sslmode=require`
   * **`DATABASE_USERNAME`**: `neondb_owner`
   * **`DATABASE_PASSWORD`**: `npg_12345`

---

### 2. Deploy Python AI Service (Render / Railway)
1. Deploy `pathpilot-ai-service` folder as a **Web Service** on Render or Railway.
2. Add environment variable:
   * `GEMINI_API_KEY`: Your Gemini API Key.
3. Copy your live AI URL (e.g., `https://ai-service-prod.onrender.com`).

---

### 3. Deploy Spring Boot Backend (Render / Railway)
1. Deploy `pathpilot-backend` folder as a **Web Service** on Render or Railway.
2. Add environment variables:
   * **`DATABASE_URL`**: The JDBC string from Step 1.
   * **`DATABASE_USERNAME`**: `neondb_owner`.
   * **`DATABASE_PASSWORD`**: Your Neon password.
   * **`AI_SERVICE_URL`**: Your live AI URL from Step 2.
   * **`JWT_SECRET`**: A secure randomly generated hex key.
   * **`CORS_ALLOWED_ORIGINS`**: Your live Vercel URL (e.g. `https://vertexpath.vercel.app` or `*`).
3. Copy your live backend URL (e.g., `https://backend-prod.onrender.com`).

---

### 4. Deploy React Frontend (Vercel)
1. Log in to [Vercel](https://vercel.com/) and import your project repository.
2. In **Build & Development Settings**:
   * **Root Directory**: `pathpilot-frontend`
   * **Build Command**: `npm run build`
   * **Output Directory**: `dist`
3. Add the following environment variable:
   * **`VITE_API_BASE_URL`**: `https://backend-prod.onrender.com` (your live backend URL from Step 3).
4. Click **Deploy**!
