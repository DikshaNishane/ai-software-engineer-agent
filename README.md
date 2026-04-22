# AI Software Engineer Agent

A production-ready web application for planning, generating, and tracking autonomous software task execution workflows.

## Live Application

https://ai-software-engineer-agent.vercel.app/

## Overview

This project provides a dashboard-style interface to run and monitor software engineering task loops, including planning, code generation, testing, and debugging iterations.

## Key Features

- Project-based workflow management
- Task queue visualization
- Iteration and status tracking
- Debug/test feedback display
- Persistent project state in browser storage

## Tech Stack

- React + Vite
- JavaScript/TypeScript
- Tailwind CSS
- Node.js tooling

## Project Structure

- `src/components/` – UI building blocks
- `src/pages/` – application pages
- `src/hooks/` – orchestration and state logic
- `src/lib/` – API/storage utilities

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install and Run

1. Install dependencies:
   `npm install`
2. Create local environment file:
   - Copy `.env.example` to `.env.local`
   - Set required values for your runtime
3. Start the development server:
   `npm run dev`
4. Open:
   `http://localhost:3000`

## Environment Configuration

Environment variables are read from `.env.local` for local development.

Common variables used in this project:

- `GEMINI_API_KEY`
- `GEMINI_API_KEYS` (optional comma-separated key pool)
- `GEMINI_MODEL` (optional)
- `GEMINI_FALLBACK_MODELS` (optional)
- `APP_URL`

## Available Scripts

- `npm run dev` – start local development server
- `npm run build` – build production bundle
- `npm run preview` – preview production build locally
- `npm run lint` – run TypeScript checks

## Deployment

This app is currently deployed on Vercel:

- https://ai-software-engineer-agent.vercel.app/

## License

MIT
