# HRM (Human Resource Management) Platform

A modern, full-stack HR management platform for organizations to streamline employee management, leave tracking, recruitment, and analytics. Built with React (frontend) and Node.js/Express/MongoDB (backend), with Google OAuth integration.

## Features

- Google OAuth and traditional email/password authentication
- Role-based dashboards (Admin, HR, Employee, Candidate)
- Employee management and profile editing
- Leave request and approval workflow
- Job posting and application management
- Analytics and reporting
- Responsive, modern UI

## Tech Stack

- **Frontend:** React, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, Passport.js (Google OAuth)
- **Other:** JWT, bcrypt, nodemailer

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd hrm
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

#### Create a `.env` file in `backend/` with:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GMAIL_USER=your_gmail_address
GMAIL_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

#### Start the backend server:

```bash
npm run dev
```

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

#### Start the frontend dev server:

```bash
npm run dev
```

The frontend will run on [http://localhost:3000](http://localhost:3000) and the backend on [http://localhost:5000](http://localhost:5000) by default.

## Environment Variables

- See `.env.example` in the backend for all required variables.
- Make sure your Google Cloud Console OAuth credentials match your backend callback URL.

## Folder Structure

```
hrm/
  backend/
    Routes/
    models/
    config/
    ...
  frontend/
    src/
    components/
    pages/
    ...
```

## Contribution

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
