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
   git clone https://github.com/<you>/smart-notebook.git
   cd smart-notebook
   cp backend/.env.example backend/.env
   # Set DB, JWT, MAIL and OPENAI keys in backend/.env
   ```

2. **docker-compose.yml**

   ```yaml
   version: '3.8'

   services:

     db:
       image: mysql:8.0
       restart: always
       environment:
         MYSQL_DATABASE: notebook_db
         MYSQL_USER: user
         MYSQL_PASSWORD: password
         MYSQL_ROOT_PASSWORD: rootpass
       volumes:
         - db_data:/var/lib/mysql
       networks:
         - app-network

     backend:
       build: ./backend
       volumes:
         - ./backend:/var/www/html
       networks:
         - app-network

     nginx:
       image: nginx:alpine
       ports:
         - "8080:80"
       volumes:
         - ./frontend/dist:/usr/share/nginx/html
         - ./backend/public:/var/www/html/public
         - ./backend/storage/app/public:/var/www/html/public/storage
         - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
       depends_on:
         - backend
         - db
       networks:
         - app-network

     phpmyadmin:
       image: phpmyadmin/phpmyadmin:latest
       restart: always
       ports:
         - "8081:80"
       environment:
         PMA_HOST: db
         PMA_PORT: 3306
         PMA_USER: user
         PMA_PASSWORD: password
       depends_on:
         - db
       networks:
         - app-network

   volumes:
     db_data:

   networks:
     app-network:
       driver: bridge
   ```

3. **Build & up containers**

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
docker-compose exec backend php artisan key:generate
docker-compose exec backend php artisan jwt:secret
docker-compose exec backend php artisan l5-swagger:generate
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


