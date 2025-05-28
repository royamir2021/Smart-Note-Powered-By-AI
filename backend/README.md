# 📚 Smart Notebook LMS Backend

A modern API backend for managing smart notes, flashcards, folders, and quizzes – built with Laravel. This project is designed for integration with an LMS and features secure JWT authentication, autosave, AI-powered flashcard/quiz generation, and easy import/export.

---

## 🚀 Features

- **RESTful API** with Laravel (v10+)
- **JWT Authentication** for secure iframe/session integration
- **Notes & Folders**: Organize, create, update, delete notes & folders
- **Flashcards & Quizzes**: Generate and manage flashcards and quizzes per note
- **AI-powered** flashcard/quiz generation (OpenAI integration)
- **PDF/Word Export**: Download notes as PDF or Word
- **Image Upload**: Upload and embed images per note
- **Swagger/OpenAPI** documentation (auto-generated)
- **Database seeding** and modular structure (Services/Repositories)

---

## ## 📂 Project Structure

```
smart-notebook-backend/
├── app/                            # Application core
│   ├── Console/                    # Artisan CLI commands
│   ├── Exceptions/                 # Exception handlers
│   ├── Helpers/                    # Helper utilities
│   ├── Http/
│   │   ├── Controllers/Api/V1/     # API v1 controllers (Notes, Flashcards, Folders, Quizzes)
│   │   ├── Middleware/             # HTTP & custom middleware (JWT, CSRF, etc.)
│   │   ├── Requests/               # Form request validation classes
│   │   └── Resources/              # API resource transformers
│   ├── Models/                     # Eloquent ORM models
│   ├── Providers/                  # Service providers (app bootstrapping)
│   └── Services/                   # Business logic & service classes
├── config/                         # All configuration files (app, jwt, swagger, ...)
├── database/                       # Migrations, factories, seeders
├── public/                         # Public files (index.php, assets)
├── resources/                      # Views, CSS, JS
├── routes/                         # Route files (api.php, web.php, ...)
├── storage/                        # File storage (logs, cache, uploads)
├── tests/                          # Unit and feature tests
├── .env.example                    # Example environment config
├── artisan                         # Laravel CLI entry point
├── composer.json                   # PHP dependencies
├── package.json                    # JS dependencies (if any)
└── README.md                       # Project documentation
```
---

## 🛠️ Installation & Setup

**Prerequisites:**

- PHP 8.1+
- Composer
- MySQL/MariaDB/PostgreSQL
- Node.js (for frontend assets, optional)

### 1. Clone the repository

```bash
git clone https://github.com/royamir2021/note-app-backend.git
cd note-app-backend
```

### 2. Install dependencies

```bash
composer install
npm install && npm run build    # Only if you want to build assets
```

### 3. Copy & configure `.env`

```bash
cp .env.example .env
# Set your DB, JWT, MAIL, and OpenAI API keys
```

### 4. Generate app key & JWT secret

```bash
php artisan key:generate
php artisan jwt:secret
```

### 5. Run migrations & seed database

```bash
php artisan migrate --seed
```

### 6. Serve the app

```bash
php artisan serve
# The app will be accessible at http://localhost:8000
```

---

## 🧑‍💻 API Documentation

This project uses **Swagger** (OpenAPI) for live documentation.

- Generate docs:
  ```bash
  php artisan l5-swagger:generate
  ```
- Access docs:
  [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)

---

## ✨ Main Endpoints Overview

| Endpoint                          | Method | Description                |
| --------------------------------- | ------ | -------------------------- |
| `/api/v1/auth/login`            | POST   | Login, returns JWT token   |
| `/api/v1/notes`                 | GET    | List all notes             |
| `/api/v1/notes`                 | POST   | Create a new note          |
| `/api/v1/notes/{id}`            | GET    | Show note details          |
| `/api/v1/notes/{id}`            | PUT    | Update note                |
| `/api/v1/notes/{id}`            | DELETE | Delete note                |
| `/api/v1/flashcards/{note_id}`  | GET    | List flashcards for a note |
| `/api/v1/quizzes/{note_id}`     | GET    | Get quiz for a note        |
| `/api/v1/notes/{id}/export-pdf` | GET    | Export note as PDF         |
| `/api/v1/folders`               | GET    | List all folders           |
| `/api/v1/folders`               | POST   | Create a folder            |
| ...                               | ...    | ... (see Swagger docs)     |

> **For full details, see [Swagger UI](http://localhost:8000/api/documentation)**

---

## 🤖 AI Integration

This backend can generate flashcards and quizzes using the [OpenAI API](https://platform.openai.com/).

- Set your `OPENAI_API_KEY` in `.env`
- Call `/api/v1/flashcards/generate` or `/api/v1/quizzes/generate` with the appropriate payload.

---

## 📝 Testing

Run tests with:

```bash
php artisan test
```

---

## 🏗️ Extending & Customizing

- Add more features in `app/Services/`
- Use Form Requests for validation (`app/Http/Requests`)
- All API responses are formatted with Resources (`app/Http/Resources`)
- JWT authentication enforced on all protected routes (`app/Http/Middleware/VerifyJwtToken.php`)

---
---

## 👤 Author

Developed & maintained by **Roya Mir**
[GitHub: royamir2021](https://github.com/royamir2021)

---

## 💡 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss.
