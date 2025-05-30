# 🚀 Smart Notebook LMS (Dockerized Full Stack)

A containerized, production-ready LMS widget and API backend for managing smart notes, flashcards, and quizzes. Built with React/TypeScript (frontend) and Laravel/PHP (backend), all orchestrated via Docker Compose.

---

## 📦 Project Structure

```
smart-notebook/
├── backend/                     # Laravel API (v10+)
│   ├── app/                     # Application core (Controllers, Services, Models)
│   ├── config/                  # Configuration files (app, jwt, swagger)
│   ├── database/                # Migrations, Seeders
│   ├── public/                  # Public entry (index.php)
│   ├── resources/               # Views, exports (PDF/Word templates)
│   ├── routes/                  # api.php, web.php
│   ├── storage/                 # Logs, cache, uploads
│   ├── Dockerfile               # PHP-FPM + Composer + OPCache
│   └── README.md                # Backend-specific docs
│
├── frontend/                    # React/TypeScript Widget
│   ├── src/                     # Components, modules, Tiptap editor, API client
│   ├── public/                  # Static files for React
│   ├── Dockerfile               # Node & build setup
│   └── README.md                # Frontend-specific docs
│
├── nginx/                       # Nginx config for SPA & API proxy
│   └── default.conf
│
├── docker-compose.yml           # Orchestrates: db, backend, frontend, nginx, phpmyadmin
├── .gitignore                   # Ignore envs, artifacts, logs, node_modules, vendor
└── README.md                    # ← Combined, Docker-based instructions
```

---

## 🛠️ Quickstart (Docker)

1. **Clone & configure**

   ```bash
   git clone https://github.com/royamir2021/Smart-Note-Powered-By-AI.git
   cd Smart-Note-Powered-By-AI
   cp backend/.env.example backend/.env
   cd backend
   php artisan jwt:secret 
   #to make your own JWT key
   # Set DB, JWT, MAIL and OPENAI keys in backend/.env
   ```


2. **Build & up containers**

   ```bash
   docker-compose up --build -d
   ```

   * **MySQL** as `db`
   * **Laravel (PHP-FPM)** as `backend`
   * **React (build) & phpMyAdmin**
   * **Nginx** on `localhost:8080` and **phpMyAdmin** on `localhost:8081`

---

## ⚙️ Backend Highlights (Laravel)

* JWT-authenticated RESTful API (v1)
* Notes, Folders, Flashcards & Quizzes endpoints
* AI-powered flashcard/quiz generation (OpenAI)
* Export to PDF / Word (Spatie Browsershot)
* DB migrations, seeders, caching (config, routes, views)
* OPcache enabled for performance

### Key Commands

```bash
# Artisan shortcuts
to make sample data:
docker-compose exec backend composer require --dev fakerphp/faker
docker-compose exec backend php artisan db:seed
```

---

## 🖥 Frontend Highlights (React)

* Written in TypeScript with Tiptap rich-text editor
* Module-based: `notes`, `flashcards`, `quizzes`, `folders`
* Session via `postMessage` from host LMS
* JWT sessionStorage management
* SPA fallback with React Router + Nginx

### Embedding & Session

```html
<iframe src="http://localhost:8080/iframe/notes" width="100%" height="500"></iframe>
<script>
  iframe = document.querySelector('iframe');
  iframe.onload = () => {
    iframe.contentWindow.postMessage({ student_id, course_id, unit_number, lesson_title }, location.origin);
  };
</script>
```

---

## 🚀 Performance & Production

1. **Frontend**: `npm run build` → serve from Nginx with gzip/Brotli & long-term cache headers
2. **Backend**: `php artisan config:cache`, `route:cache`, `view:cache`, OPcache
3. **DB**: Add indexes on `student_id, course_id`, use eager loading, cache frequent queries


---


