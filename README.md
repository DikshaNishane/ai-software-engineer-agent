<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
</p>

<h1 align="center">🚀 AI Software Engineer Agent</h1>

<p align="center">
  <strong>An autonomous software task orchestration dashboard for planning, code generation, testing, and debugging workflows.</strong>
</p>

<p align="center">
  <a href="https://ai-software-engineer-agent.vercel.app/">
    <img src="https://img.shields.io/badge/🌐%20Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
  &nbsp;
  <a href="https://github.com/DikshaNishane/ai-software-engineer-agent/issues">
    <img src="https://img.shields.io/github/issues/DikshaNishane/ai-software-engineer-agent?style=for-the-badge" alt="Issues"/>
  </a>
  <a href="https://github.com/DikshaNishane/ai-software-engineer-agent/stargazers">
    <img src="https://img.shields.io/github/stars/DikshaNishane/ai-software-engineer-agent?style=for-the-badge" alt="Stars"/>
  </a>
  <a href="https://github.com/DikshaNishane/ai-software-engineer-agent/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/DikshaNishane/ai-software-engineer-agent?style=for-the-badge" alt="License"/>
  </a>
</p>

---

## 🌐 Live Demo

> **Try the deployed app:**

### 🔗 [https://ai-software-engineer-agent.vercel.app/](https://ai-software-engineer-agent.vercel.app/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture Flow](#-architecture-flow)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🧠 Overview

**AI Software Engineer Agent** is a web-based autonomous engineering workspace that helps users manage software project execution loops from requirement input to iterative debugging.

The app provides a modern dashboard for:

- creating autonomous projects,
- planning tasks,
- generating code,
- tracking test/debug iterations,
- and visualizing execution state in real time.

---

## ✨ Key Features

| Feature | Description |
|:--------|:------------|
| **Project Lifecycle Tracking** | Create and monitor autonomous project runs from start to completion |
| **Task Queue Management** | Visual task states: queued, coding, testing, debugging, complete, failed |
| **Debug Loop Visibility** | Track iterative debugging cycles and outcome summaries |
| **Execution Metrics Dashboard** | Quick stats for projects, tasks, iterations, and completion status |
| **Persistent Local Storage** | Project state is stored and restored for continued workflow tracking |
| **Responsive UI Components** | Modular React components for header, queue, memory, status, and logs |

---

## 🛠 Tech Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Language | JavaScript + TypeScript |
| Routing | React Router |
| Icons/UI | Lucide React + Motion |
| Runtime | Node.js |
| Deployment | Vercel |

---

## 🏗 Architecture Flow

```text
Requirement Input
      │
      ▼
Project Initialization
      │
      ▼
Task Planning
      │
      ▼
Code Generation
      │
      ▼
Test Simulation / Validation
      │
      ▼
Debug Iteration Loop
      │
      ├── pass ──► Task Complete
      └── fail ──► Fix + Retest (bounded retries)
      │
      ▼
Final Assembly + Project Completion
```

---

## 📁 Project Structure

```text
ai-software-engineer-agent/
├── src/
│   ├── components/         # UI modules (status, queue, results, memory, terminal lines)
│   ├── hooks/              # Agent orchestration logic
│   ├── lib/                # LLM/storage utilities
│   ├── pages/              # Dashboard + workspace views
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository:
   `git clone https://github.com/DikshaNishane/ai-software-engineer-agent.git`
2. Move into the project:
   `cd ai-software-engineer-agent`
3. Install dependencies:
   `npm install`
4. Create local env file:
   - Copy `.env.example` to `.env.local`
5. Start development server:
   `npm run dev`

App runs at: `http://localhost:3000`

---

## 🔐 Environment Variables

Set values in `.env.local`:

- `GEMINI_API_KEY` — primary key
- `GEMINI_API_KEYS` — optional comma-separated key pool
- `GEMINI_MODEL` — optional primary model
- `GEMINI_FALLBACK_MODELS` — optional comma-separated fallback models
- `APP_URL` — app base URL

---

## 📜 Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run TypeScript checks (`tsc --noEmit`) |

---

## ☁️ Deployment

The project is deployed on Vercel:

- https://ai-software-engineer-agent.vercel.app/

---

## 🔧 Troubleshooting

| Problem | Suggestion |
|:--------|:-----------|
| API key invalid | Verify `GEMINI_API_KEY` value and restart dev server |
| Quota/rate limit errors | Use fallback keys/models and check provider limits |
| Port 3000 already in use | Stop conflicting process or change Vite port |
| Build issues | Remove `node_modules`, reinstall with `npm install` |

---

## 📄 License

MIT
