# Simple Task Tracker

Simple Task Tracker is a lightweight task management application for creating tasks, assigning priorities, completing and deleting tasks, filtering by status, and viewing basic task statistics.

## Project Structure

```text
backend/     Laravel API and PHP tests
frontend/    React + Vite + Tailwind application
```

## Technology Stack

### Backend

- Laravel 12.69.3
- PHP 8.2+
- MySQL or MariaDB
- REST API
- PHPUnit 11
- Composer

### Frontend

- React
- Vite
- Tailwind CSS 4
- Native browser `fetch`
- shadcn-style UI components using Radix UI primitives
- Node.js and npm

## Features

- Core PHP sorter using priority and creation date ordering.
- REST API for listing, creating, completing, and deleting tasks.
- Optional task status filtering.
- React task creation form with validation feedback.
- shadcn-style priority dropdown menu.
- Priority and status badges.
- AlertDialog confirmation before deleting tasks.
- Success toast after creating a task.
- Complete and delete actions without full page reloads.
- All, Pending, and Completed filters.
- Total, pending, and completed task statistics.

## Prerequisites

Install the following locally:

- PHP 8.2 or newer
- Composer
- MySQL or MariaDB
- Node.js and npm
- A terminal or command line

## Backend Setup

From the repository root:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Create the MySQL database:

```sql
CREATE DATABASE simple_task_tracker
		CHARACTER SET utf8mb4
		COLLATE utf8mb4_unicode_ci;
```

Configure `backend/.env` with the local database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=simple_task_tracker
DB_USERNAME=root
DB_PASSWORD=
```

Run migrations:

```bash
php artisan migrate
```

Start the Laravel API:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

The backend is available at `http://127.0.0.1:8000`.

## Frontend Setup

Open a second terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server is normally available at `http://127.0.0.1:5173`.

The frontend calls relative `/api/tasks` URLs. Vite proxies `/api` requests to `http://localhost:8000`, so the Laravel backend must be running while using the frontend.

## Running the Application

1. Start MySQL.
2. Start the backend from `backend/`:

	 ```bash
	 php artisan serve --host=127.0.0.1 --port=8000
	 ```

3. Start the frontend from `frontend/`:

	 ```bash
	 npm run dev
	 ```

4. Open `http://127.0.0.1:5173`.
5. Verify that you can create tasks, complete and delete tasks, filter by status, and see statistics update.

## API Endpoints

| Method | Endpoint | Description | Success codes | Error codes |
| --- | --- | --- | --- | --- |
| GET | `/api/tasks` | List all tasks | 200 | 400 |
| GET | `/api/tasks?status=pending` | List pending tasks | 200 | 400 |
| GET | `/api/tasks?status=completed` | List completed tasks | 200 | 400 |
| POST | `/api/tasks` | Create a task | 201 | 400 |
| PATCH | `/api/tasks/{id}/complete` | Mark a task completed | 200 | 404 |
| DELETE | `/api/tasks/{id}` | Delete a task | 200 | 404 |

### Create Task Request

```json
{
	"title": "Review API response handling",
	"description": "Check error states in the frontend.",
	"priority": "high"
}
```

Validation rules:

- `title` is required, must be a non-empty string, and has a maximum length of 255 characters.
- `description` is optional and must be a string when provided.
- `priority` is optional and must be `low`, `medium`, or `high` when provided.
- New tasks always start with `pending` status.

Successful creation returns HTTP 201 and the created task:

```json
{
	"id": 1,
	"title": "Review API response handling",
	"description": "Check error states in the frontend.",
	"priority": "high",
	"status": "pending",
	"created_at": "2026-10-01T00:00:00.000000Z",
	"updated_at": "2026-10-01T00:00:00.000000Z"
}
```

Validation errors return HTTP 400:

```json
{
	"message": "Validation failed",
	"errors": {
		"title": [
			"The title field is required."
		]
	}
}
```

An invalid status filter returns HTTP 400:

```json
{
	"message": "Invalid status filter"
}
```

Missing tasks return HTTP 404:

```json
{
	"message": "Task not found"
}
```

## Running Tests

From `backend/`:

```bash
php artisan test
```

This runs the complete PHPUnit suite, including:

- `tests/TaskSorterTest.php` for priority, date, and immutability sorting behavior.
- `tests/Feature/TaskApiTest.php` for task creation, validation, completion, deletion, and filtering.

The test suite uses in-memory SQLite through `phpunit.xml` for isolated and repeatable tests. The application runtime uses MySQL through `.env`.

Run the frontend production build from `frontend/`:

```bash
npm run build
```

## AI Disclosure

I used AI tools as development assistants during this assessment. I treated their output as a draft, then checked the code against the requirements, ran the available tests and builds, and kept the implementation deliberately small enough to explain.

### Tools Used

- GitHub Copilot
- Perplexity
- Gemini
- Claude


### Parts Assisted by AI

- Laravel 12 scaffolding and backend project setup.
- `backend/src/TaskSorter.php` and `backend/tests/TaskSorterTest.php`.
- The tasks migration, `Task` model, API controller, routes, and API feature tests.
- Composer autoloading and API route registration.
- React components, native `fetch` API helper, Vite proxy, and Tailwind styling.
- shadcn-style Radix UI dropdown, AlertDialog, and toast components.
- This README and the final verification checklist.

### My Review and Changes

I reviewed the generated code by tracing each request from the frontend to the Laravel route, controller, model, and database. I made or verified the following changes:

- The sorter copies the input before sorting, so `usort()` cannot change the caller's original array. It assigns weights for `high`, `medium`, and `low`, then compares older `created_at` values first. Missing dates and unknown priorities do not crash the method.
- The API validates task input explicitly and returns HTTP 400 with an `errors` object instead of Laravel's default 422 response. Missing tasks return JSON 404 responses, and completing an already completed task remains idempotent.
- The Laravel application uses `App\Support\TaskSorter` through Composer's PSR-4 mapping and loads `routes/api.php` from `bootstrap/app.php`.
- The runtime database was changed to MySQL. PHPUnit still uses in-memory SQLite so tests stay isolated and do not modify the development database.
- The React app keeps task, filter, loading, error, refresh, and action state in simple hooks. Complete and delete update the current list without a page reload, while creating a task refreshes the active list.
- I verified the backend with migrations, API smoke tests, and PHPUnit. The final suite passed 12 tests with 34 assertions, and the frontend production build passed.

### Manual Decisions

I made these design decisions because they keep the assessment easy to understand and defend:

- I kept Laravel and React in separate `backend/` and `frontend/` directories. This matches the requested stack and makes the API/frontend boundary clear.
- I used one Eloquent model and one controller. Repositories, services, authentication, pagination, and state-management libraries were unnecessary for this assessment.
- I kept sorting in a standalone raw PHP class instead of putting it in the controller or an Eloquent query. That makes the core rule independently testable.
- I used inline Laravel validation because the endpoint has a small rule set and needs a custom HTTP 400 response.
- I return a JSON array from GET and the created or updated task from write operations. Error responses use a clear `message`, with validation details under `errors`.
- I kept the frontend state in `App.jsx` and passed small callbacks to child components. `TaskForm`, `TaskList`, `TaskItem`, `TaskFilters`, and `TaskStats` each have one clear responsibility.
- I used a small native `fetch` helper and a Vite `/api` proxy. No Redux, React Query, or other state-management/data-fetching library was needed.

Before submission, I will remove any tool names that I did not use and make sure I can explain every statement above.

## Final Requirement Checklist

Before submitting, verify the following:

- [ ] `backend/src/TaskSorter.php` exists and contains `public function sortTasks(array $tasks): array`.
- [ ] Sorting order is high > medium > low.
- [ ] For equal priorities, older `created_at` values come first.
- [ ] `backend/tests/TaskSorterTest.php` tests priority ordering, date-based secondary sorting, and an edge case.
- [ ] The `tasks` migration exists with required fields and enum values.
- [ ] `backend/app/Models/Task.php` has the correct `$fillable` fields.
- [ ] API routes exist for GET, POST, PATCH complete, and DELETE tasks.
- [ ] GET `/api/tasks` returns JSON with HTTP 200.
- [ ] GET supports `?status=pending` and `?status=completed`.
- [ ] GET returns HTTP 400 for an invalid status filter.
- [ ] GET uses `TaskSorter` for ordering.
- [ ] POST validates title, description, and priority correctly.
- [ ] POST returns HTTP 201 on success and HTTP 400 on validation errors.
- [ ] PATCH marks a task completed and returns HTTP 200.
- [ ] PATCH returns HTTP 404 for a missing task.
- [ ] DELETE removes a task and returns HTTP 200.
- [ ] DELETE returns HTTP 404 for a missing task.
- [ ] Frontend uses React, Vite, and Tailwind CSS.
- [ ] Frontend form includes title, description, and priority.
- [ ] Tasks display priority and status badges.
- [ ] Complete and delete actions work without a full page reload.
- [ ] Filters switch between All, Pending, and Completed without a reload.
- [ ] Statistics display total, pending, and completed counts.
- [ ] Frontend handles loading, empty, error, form submission, and action states.
- [ ] README documents backend and frontend setup.
- [ ] README documents API methods, paths, status codes, and request validation.
- [ ] README explains how to run PHPUnit tests.
- [ ] AI Disclosure accurately reflects the tools and assistance used.
- [ ] PHP code follows PSR-12 style.
- [ ] No unneeded authentication, repositories, services, or state-management libraries were added.
- [ ] You can explain every important part of the submitted code.

Final commands:

```bash
cd backend
composer validate --no-check-publish
php artisan migrate:status
php artisan test

cd ../frontend
npm install
npm run build
```
