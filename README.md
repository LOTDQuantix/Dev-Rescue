# 🚨 DEV_RESCUE // TERMINAL_BRUTALISM

![Status](https://img.shields.io/badge/SYSTEM-ONLINE-success?style=for-the-badge&logo=linux)
![Stack](https://img.shields.io/badge/TECH-VANILLA_JS_%2B_SUPABASE-blueviolet?style=for-the-badge&logo=javascript)
![Host](https://img.shields.io/badge/DEPLOY-CLOUDFLARE_PAGES-orange?style=for-the-badge&logo=cloudflare)

> **" Ctrl+C your panic. Ctrl+V the solution. "**

**Dev Rescue** is a high-performance, **database-backed survival kit** for developers. It bypasses the fluff of StackOverflow and delivers raw, executable commands to fix your broken Git state, Docker disasters, and terminal terrors.

---

## ⚡ SYSTEM_ARCHITECTURE

We rejected the bloated modern web stack. No React. No Bundlers. No Hydration Errors.
Just **Raw DOM** and **PostgreSQL**.

| Component | Tech Spec | Description |
| :--- | :--- | :--- |
| **Frontend** | `HTML5` + `Vanilla CSS` | Zero-dependency "Terminal Brutalism" UI. < 100KB payload. |
| **Logic** | `Vanilla ES6+` | Direct-to-Database communication via Supabase Client. |
| **Database** | `Supabase (PostgreSQL)` | Relational binding of **3,500+** problems & solutions. |
| **Hosting** | `Cloudflare Pages` | Static Edge Deployment. 0ms cold start. |

---

## 🛠️ INSTALLATION_PROTOCOL

### Prerequisites
- A modern browser (Chrome/Firefox/Edge)
- `npm` (optional, only for local serving)

### 1. Clone the Repository
```bash
git clone https://github.com/LOTDQuantix/Dev-Rescue.git
cd Dev-Rescue
```

### 2. Boot Local Server (Optional)
Since this is a static site, you can just open `index.html`. However, for the best experience (and to avoid CORS on some strictest browsers):

```bash
# Install a simple static server
npx serve .
```

### 3. Access Mainframe
Open `http://localhost:3000` (or whatever port `serve` assigns).

---

## 📂 PROJECT_STRUCTURE

```bash
/Dev-Rescue
├── css/
│   └── styles.css       # The raw, brutal CSS variables & CRT effects
├── js/
│   └── app.js           # The Brain. Connects to Supabase, handles logic.
├── data/                # [ARCHIVED] JSON backups
├── index.html           # The Shell. Single Page Entry.
└── README.md            # You are here.
```

---

## 📡 DATA_STREAM_PROTOCOL

The application connects directly to the **Supabase PostgreSQL** instance using the `supabase-js` client.

- **Security**: Uses Row Level Security (RLS) policies.
- **Access**: The `ANON_KEY` is public by design, allowing read-only access to the `problems` table for all users.
- **Pagination**: The engine implements a recursive fetch strategy to load the massive 3,500+ entry dataset in chunks of 1,000 to prevent network choking.

---

## 🤝 CONTRIBUTING

### Adding New Solutions
The database is currently **Read-Only** for the public.
To submit a new fix:
1. Fork the repo.
2. Open a Pull Request with details.
3. *Future Implementation:* An Admin Dashboard is being built for direct injections.

---

## 📜 LICENSE

**MIT License** // Open Source Forever.
*Copy it. Fork it. Fix it.*

---

<div align="center">
  <sub>INITIATED BY LOTDQUANTIX // 2026</sub>
</div>
