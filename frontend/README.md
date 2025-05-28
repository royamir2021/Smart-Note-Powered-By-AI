
# Smart Notebook LMS Widget – React/TypeScript Frontend

---

## 🚀 Development

Run the local development server:

```bash
npm run dev
````

Open [http://localhost:5173](http://localhost:5173/) in your browser.

### Production Build

```bash
npm run build
```

---

### 📁 Folder & File Details

| Path                                             | Description                                                    |
| ------------------------------------------------ | -------------------------------------------------------------- |
| `components/`                                    | Shared UI components used throughout the project               |
| ├── `Flashcard/`                                 | Flashcard UI components                                        |
| ├── `models/`                                    | Data models and TypeScript types/interfaces                    |
| └── `UI/`                                        | Main UI building blocks                                        |
|     ├── `Editor.tsx`                             | Main Tiptap-based rich text editor                             |
|     ├── `NoteHeader.tsx`                         | Editor header bar, title, and controls                         |
|     ├── `NoteLayout.tsx`                         | Overall layout/wrapper for notes UI                            |
|     ├── `NoteSidebar.tsx`                        | Sidebar with notes list, folders, navigation                   |
|     └── `ResizableIframe.tsx`                    | Iframe wrapper with resizing logic for embedding               |
| `extensions/`                                    | Custom plugins or extensions for Tiptap or other app parts     |
| `lib/api.ts`                                     | Centralized REST API functions (notes, quizzes, folders, etc.) |
| `modules/flashcards/component/FlashcardView.tsx` | UI for showing flashcards with flip animation                  |
| `modules/flashcards/falshCardApi.ts`             | All flashcard-related API functions                            |
| `modules/folders/folderApi.ts`                   | All folder-related API (CRUD, move note, etc.)                 |
| `modules/notes/component/`                       | Note-specific React components                                 |
| `modules/notes/noteApi.ts`                       | All note CRUD API calls                                        |
| `modules/quizzes/component/`                     | Quiz display, timer, results, and question UI                  |
| `modules/quizzes/quizApi.ts`                     | All quiz-related API calls                                     |
| `pages/NoteEditorPage.tsx`                       | Main page for editing/creating/viewing notes                   |
| `pages/StartNoteWidget.tsx`                      | Widget entry/landing page (for embedding)                      |
| `utils/export.ts`                                | Functions for exporting notes (PDF, Word, etc.)                |
| `utils/tokenManager.ts`                          | JWT token/session management utilities                         |

---

## ⚡️ Usage: LMS Integration

**1. Embed the widget as an iframe in your LMS:**

```html
<iframe
  id="smart-notebook-iframe"
  src="https://your-domain.com/iframe/notes"
  width="100%"
  height="500"
  allow="clipboard-write; clipboard-read"
  style="border: none;"
></iframe>
```

**2. Send Session Info via postMessage**

```js
const sessionData = {
  student_id: 2,
  course_id: 1,
  unit_number: 2,
  lesson_title: "Introduction to JWT"
};
const iframe = document.getElementById("smart-notebook-iframe");
iframe.contentWindow.postMessage(sessionData, "https://your-domain.com");
```

> **Tip:** Always use your real origin in production for security.

---

## 🗂️ Session Handling

The widget receives **student session data** from the host LMS via `window.postMessage`.
This enables the widget to load the correct notes and personalize the experience for each student and session.

### 1. Host LMS sends a message to the iframe

On the **host LMS page**, after the iframe has loaded, send the session info to the widget like this:

```js
const sessionData = {
  student_id: 2,
  course_id: 1,
  unit_number: 2,
  lesson_title: "Introduction to JWT"
};
const iframe = document.getElementById("smart-notebook-iframe");
iframe.contentWindow.postMessage(sessionData, "https://your-domain.com"); // Use your real widget domain!
```

> 💡 **Tip:** Always specify the correct target origin (do not use `"*"` in production).

### 2. Widget listens for session messages

Inside the **widget** (iframe), listen for the message and store the data in `sessionStorage`:

```js
window.addEventListener("message", (event) => {
  // Optionally check event.origin for security!
  const { student_id, course_id, unit_number, lesson_title } = event.data || {};
  if (student_id && course_id) {
    sessionStorage.setItem('note_session', JSON.stringify(event.data));
    // Optionally: load or create a note for this session
  }
});
```

> 🔒 **Security Note:** Always check `event.origin` and only accept messages from trusted domains in production.

---

## 🔐 Authentication

* All API calls use JWT (handled in backend + frontend)
* Session is managed via JWT tokens in `sessionStorage`
* Always validate `event.origin` to accept messages only from trusted LMS host

---

## 🎨 Customization & Extension

* Add new features or domains inside `src/modules/`
* Change styles/themes via `index.css` (TailwindCSS)
* Centralize or modify all API logic in `lib/api.ts`

---

## ⬇️ Export/Import

* Export notes to PDF/Word with one click
* Import content via supported formats (coming soon)

---


---

## ✨ Author

**Roya Mir** – [royamir2021](https://github.com/royamir2021)

