# BookMind GPT

> AI-powered document reader — upload a PDF, chat with it instantly. No account required.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
  - [Home (Landing Page)](#home-landing-page)
  - [Upload Document](#upload-document)
  - [Chat](#chat)
- [Components](#components)
- [Getting Started](#getting-started)
- [Backend](#backend)

---

## Overview

**BookMind GPT** is a full-stack agentic document Q&A application. Users upload a PDF, the backend indexes it using **RAG (Retrieval-Augmented Generation)**, and they can then chat with the document — getting precise, sourced answers grounded in their file, not hallucinations.

Key highlights:
- **No account required** — guests can upload and chat immediately
- **Session-isolated** — each session has its own vector store; data is auto-deleted after use
- **Agentic chat UI** — persistent conversation sidebar, copy, clear, and status tracking
- **Drag-and-drop upload** — with per-file progress bars and a 3-step processing stepper

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| react-router-dom v7 | Client-side routing |
| shadcn/ui | Base UI primitives (Button, Sidebar, Separator) |
| shadcn-chatbot-kit | Chat UI (MessageList, MessageInput, ChatMessage) |
| reui | Advanced components (Stepper, file upload pattern) |
| lucide-react | Icons |
| framer-motion | Animations |
| react-markdown + shiki | Markdown rendering with syntax highlighting |

### Backend
| Technology | Purpose |
|---|---|
| Python + FastAPI | REST API |
| RAG pipeline | Document retrieval & answer generation |
| ChromaDB | Vector store for document embeddings |

---

## Project Structure

```
my-app/
├── public/
│   └── logo.png                  # Brand logo (used as favicon + in all UI)
├── index.html                    # Entry HTML — title: "BookMind GPT", favicon: /logo.png
├── src/
│   ├── App.tsx                   # Root component (renders <Home />)
│   ├── main.tsx                  # React DOM entry point
│   ├── index.css                 # Global styles
│   ├── pages/
│   │   ├── Home.tsx              # Composer: Navbar + Hero + Features + HowItWorks + Footer
│   │   ├── UploadDoc.tsx         # File upload page with stepper
│   │   └── home/
│   │       ├── Navbar.tsx        # Sticky nav with hover dropdowns
│   │       ├── Hero.tsx          # Hero section with CTA buttons
│   │       ├── Features.tsx      # 3-column feature cards
│   │       ├── HowItWorks.tsx    # Dark 3-step process section
│   │       └── Footer.tsx        # 4-column dark footer
│   ├── components/
│   │   ├── chat/
│   │   │   ├── index.tsx         # ChatPage — state management hub
│   │   │   └── components/
│   │   │       ├── ChatHeader.tsx    # Top bar: logo, title, controls
│   │   │       ├── ChatBody.tsx      # Message list + input
│   │   │       ├── ChatSidebar.tsx   # Conversation history + profile menu
│   │   │       └── constants.ts      # simulateReply helper
│   │   ├── patterns/
│   │   │   └── p-file-upload-5.tsx   # Drag-and-drop file upload pattern
│   │   ├── reui/
│   │   │   └── stepper.tsx           # Horizontal/vertical stepper component
│   │   └── ui/                       # shadcn-generated UI primitives
│   ├── hooks/
│   │   └── use-file-upload.ts        # File upload state management hook
│   └── lib/
│       └── utils.ts                  # cn() utility (clsx + tailwind-merge)
└── backend/
    ├── main.py                       # FastAPI application entry
    ├── controllers/                  # Route handler logic
    ├── middleware/                   # CORS, auth middleware
    └── routes/                       # API route definitions
```

---

## Pages & Features

### Home (Landing Page)

Route: `/`

The landing page is composed of 5 independent section components:

#### Navbar
- Sticky header with blur backdrop (`bg-white/70 backdrop-blur-xl`)
- **Logo** (`/public/logo.png`) + brand name "BookMind GPT"
- **Nav links** with hover-triggered dropdown menus:
  - **Features** → Upload Any PDF, Chat with Your Doc, RAG-Powered Accuracy
  - **How it works** → Upload, Instant indexing, Ask anything
  - **Contact** → Email, GitHub, Twitter
- Right actions: **Sign in** (text) + **Get started** (dark button)

#### Hero
- Subtle grid background + blue glow blob
- "Powered by RAG AI" pill badge
- Large headline: *"Understand any document, instantly."*
- Two CTA buttons:
  - **Continue as Guest** — blue, bold, glowing, with scale animation → navigates to `/UploadDoc`
  - **Sign in to your account** → navigates to `/Login`
- Privacy note: *"Guest sessions are private and auto-deleted after use."*

#### Features
- 3-column card grid (stacks on mobile):
  1. **Upload Any PDF** — books, papers, docs up to 300 pages
  2. **Chat with Your Doc** — context-aware answers with citations
  3. **RAG-Powered Accuracy** — answers from your doc, not hallucinations

#### How It Works
- Dark section (`bg-gray-950`) with 3 numbered steps:
  1. **Upload your document** — PDF ingestion & embedding
  2. **Instant indexing** — processed into isolated session vector store
  3. **Ask anything** — precise, sourced answers

#### Footer
- Dark 4-column layout:
  - **Brand** — logo + "EasyRead" + tagline + social icons (GitHub, Twitter, Email)
  - **Product** — Features, How it works, Upload Doc, Chat
  - **Support** — Contact Us, Privacy Policy, Terms of Use
  - **Built with** — React + Vite, Tailwind CSS, FastAPI, RAG / ChromaDB

---

### Upload Document

Route: `/UploadDoc`

- Dark card UI (`bg-neutral-900`) centered on a gradient background
- **Drag-and-drop file upload** (PDF only, max 1 file, max 50MB)
  - Per-file progress bars, retry on error, remove button
- **3-step horizontal Stepper** (appears after file is selected):

| Step | Title | Description | State |
|---|---|---|---|
| 1 | Uploading | Sending your PDF to the server | Spinner (2s) |
| 2 | Processing | Extracting and indexing content | Spinner (2.5s more) |
| 3 | Ready | Your document is ready to chat | Check icon |

- **"Continue to Chat →"** button appears when processing is done

---

### Chat

Route: `/Chat`

A full agentic chat interface with sidebar conversation management.

#### ChatSidebar
- `bg-zinc-900`, no borders
- Brand logo + "BookMind GPT" in header
- Conversation list grouped by **Today** / **Earlier** with delete-on-hover
- **+ New Chat** button
- **Profile menu** at bottom: View profile, Upgrade plan, Personalization, Settings, Help & support, Sign out

#### ChatHeader
- Logo + "BookMind GPT" + "Agentic assistant" subtitle
- Controls: New chat (reset icon), Copy conversation, Status badge
  - Status badge: amber pulse (generating) / green dot (ready)

#### ChatBody
- Message list + text input
- Empty state: centered "BookMind GPT" text

#### State Management
- `conversations[]` — list of all conversations
- `store` — `Record<id, Message[]>` mapping conversation ID → messages
- `activeId` — currently selected conversation
- New conversation auto-created from first message content

---

## Components

### `p-file-upload-5.tsx`
Drag-and-drop upload zone with:
- File type validation, size limit enforcement
- Per-file upload progress bars
- Error retry and file removal
- `onFilesChange` callback for external state sync

### `reui/stepper.tsx`
Flexible stepper component supporting:
- Horizontal and vertical orientations
- Custom indicators: `loading`, `completed`, `active`
- Sub-components: `StepperItem`, `StepperTrigger`, `StepperIndicator`, `StepperTitle`, `StepperDescription`

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+

### Frontend

```bash
cd my-app
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`

---

## Backend

The backend is a **FastAPI** application located in `/backend/`:

```
backend/
├── main.py           # App entry — initializes FastAPI, registers routes
├── controllers/      # Business logic (upload, query, session management)
├── middleware/       # CORS, authentication
└── routes/           # API route definitions (/upload, /chat, etc.)
```

Key responsibilities:
- **PDF ingestion** — chunking and embedding uploaded documents
- **Vector store** — per-session ChromaDB collections
- **RAG query** — retrieve relevant chunks + generate grounded answers
- **Session cleanup** — auto-delete data after session ends

---

*Built with React, FastAPI, and RAG — © 2026 EasyRead*
