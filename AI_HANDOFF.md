# 🤖 AI HANDOFF PROTOCOL: DEV_RESCUE

> **STATUS**: PRODUCTION_READY (Static Deployment)
> **DATE**: 2026-02-02
> **SESSION_GOAL**: Finalize dataset expansion, migrate to Supabase, refactor for Cloudflare Pages.

---

## 1. PROJECT OVERVIEW
**Dev Rescue** is a "Terminal Brutalism" styled developer help tool. It allows users to search for command-line fixes, git recovery steps, and docker solutions.
- **Core Philosophy**: No fluff, just commands. Dark mode default.
- **Architecture**: Serverless / Static Site.
- **Hosting**: Cloudflare Pages (HTML/CSS/JS only).
- **Backend**: Supabase (PostgreSQL) via direct JS Client.

## 2. TECH STACK
- **Frontend**: HTML5, Vanilla CSS (Custom properties, no framework), Vanilla JavaScript (ES6+).
- **Database**: Supabase (PostgreSQL).
- **Client Library**: `@supabase/supabase-js` (via CDN).
- **Version Control**: Git (GitHub: `LOTDQuantix/Dev-Rescue`).

## 3. DATABASE SCHEMA (Supabase)
The system relies on two relational tables.

### Table: `problems`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `text` (PK) | Unique string ID (e.g., `git_undo_commit`). |
| `title` | `text` | Display title of the problem. |
| `category` | `text` | Grouping (Git, Docker, Linux, etc.). |
| `problem_description` | `text` | Detailed explanation of the issue. |
| `search_phrases` | `text[]` | Array of keywords for searching. |
| `platforms` | `text[]` | Array of related platforms (Linux, macOS, etc.). |
| `warnings` | `text` | Critical warnings (nullable). |

### Table: `solutions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Auto-generated UUID. |
| `problem_id` | `text` (FK) | References `problems.id`. |
| `label` | `text` | Title of the specific solution. |
| `commands` | `text[]` | Array of executable commands. |
| `explanation` | `text` | Context for the solution. |
| `risk_level` | `text` | `safe`, `caution`, or `dangerous`. |
| `undo_or_recovery` | `text` | Steps to revert if this fails. |

## 4. SESSION CHRONOLOGY
1.  **Dataset Finalization**: Merged ~200 expansion JSON files into a master dataset (~3,500 entries).
2.  **Database Migration**:
    -   Sanitized JSON data (mapped risk levels, removed duplicates).
    -   Inserted **3,507 problems** and **3,543 solutions** into Supabase.
3.  **UI Integration (Phase 1)**: Created a Node.js middleware to proxy Supabase.
4.  **Refactoring (Phase 2 - Final)**:
    -   **Requirement**: Switch to Cloudflare Pages (Static Only).
    -   **Action**: Deleted Node.js server (`server.js`).
    -   **Action**: Refactored `app.js` to use `window.supabase.createClient` directly.
    -   **Action**: Implemented pagination loop to fetch >1,000 records (Supabase API limit).
    -   **Fix**: Resolved namespace collision (`supabase` vs `supabaseClient`).
5.  **Cleanup**: Removed all temporary Python scripts and JSON data files.

## 5. REPOSITORY STATE
- **Remote**: `https://github.com/LOTDQuantix/Dev-Rescue.git`
- **Branch `main`**: Stable, production-ready code.
- **Branch `dev`**: Default working branch (Synced with main).
- **Secrets**: No `.env` required for frontend (uses Public Anon Key).

## 6. HOW TO RUN
Since the project is now purely static:
1.  Clone repo: `git clone ...`
2.  Open `index.html` in any browser.
3.  *Or* run `npx serve .` for a local server experience.

## 7. NEXT STEPS (Future AI Agents)
- **Search Optimization**: Currently, the app fetches *all* 3,500 records on load (Client-side search). For better performance at scale, refactor `app.js` to use **Supabase Text Search** (`.textSearch()` or `.ilike()`) on the server side instead of fetching everything.
- **Admin Panel**: Build a secured interface (Authenticated) to add/edit problems without using SQL.
- **Analytics**: Add a simple counter for "Most Viewed Problems".
