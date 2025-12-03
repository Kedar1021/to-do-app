# Full-Stack To-Do App (Django + Next.js)

This is a full-stack To-Do application built with Django (Backend) and Next.js (Frontend).

## Project Structure
- `backend/`: Django project with Django Rest Framework (DRF) and SQLite.
- `frontend/`: Next.js application with TailwindCSS.

## Backend Setup (Local)
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment (optional but recommended).
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/v1/`.

## Frontend Setup (Local)
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Deployment

### Backend (Render)
1. Create a new Web Service on Render.
2. Connect your repository.
3. Set the Build Command to: `pip install -r requirements.txt && python manage.py migrate`
4. Set the Start Command to: `gunicorn todo_backend.wsgi --log-file -`
5. Add Environment Variables (if needed, e.g., `SECRET_KEY`, `DEBUG=False`).

### Frontend (Vercel)
1. Import the project to Vercel.
2. Set the Root Directory to `frontend`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed Render backend (e.g., `https://your-app.onrender.com/api/v1`).
4. Deploy.

## Features
- User Authentication (JWT)
- Create, Read, Update, Delete Tasks
- Filter by Status, Priority, and Starred
- Search Tasks
- Responsive UI with Animations
