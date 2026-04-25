# ByU Connect — Backend API

The powerful server-side engine for ByU Connect, a talent discovery platform for Babcock University. Built with performance, scalability, and modern developer experience in mind.

---

## 🚀 Tech Stack

- **Framework**: Express.js (Node.js)
- **Language**: TypeScript
- **Database**: Neon PostgreSQL (Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (Access + Refresh Tokens)
- **Validation**: Zod
- **Email**: NodeMailer (with custom premium templates)
- **Storage**: Cloudinary (Avatar & Portfolio images)

---

## 📂 Architecture & Directory Structure

The project follows a modular architecture, where each feature (auth, users, requests) is self-contained.

```
/src
├── config/             # Database and environment configurations
├── db/                 # Drizzle schema and connection logic
├── middleware/         # Auth, validation, and error handling middlewares
├── modules/            # Modular feature folders
│   ├── auth/           # Login, Register, OTP verification
│   ├── users/          # Profile management, Availability, Portfolio
│   └── email/          # Email templates and transport logic
└── server.ts           # Application entry point & keep-alive logic
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory based on the following template:

```env
# Database
DATABASE_URL=          # Neon PostgreSQL connection string (HTTP)

# Auth
JWT_SECRET=            # Long random string
JWT_REFRESH_SECRET=    # Long random string

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email (SMTP)
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=

# Server
PORT=5000
NODE_ENV=development
```

---

## 🛠️ Database Setup

The project uses **Neon PostgreSQL** with the HTTP driver for serverless efficiency.

1.  **Sync Schema**: To push the local schema to the database:
    ```bash
    npm run db:push
    ```
2.  **Generate Migrations**: To generate migration files:
    ```bash
    npm run db:generate
    ```
3.  **Drizzle Studio**: To view and edit your data in a browser:
    ```bash
    npm run db:studio
    ```

---

## 📡 API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register new user & send OTP |
| `POST` | `/verify-email` | Verify email with OTP |
| `POST` | `/login` | Authenticate & receive tokens |
| `GET` | `/me` | Get currently logged-in user |

### 👤 Users & Profiles (`/api/users`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all verified users (Cached) |
| `GET` | `/:id` | Get full public profile |
| `PATCH` | `/me` | Update personal profile |
| `PATCH` | `/me/availability` | Update availability status |
| `POST` | `/me/avatar` | Upload profile photo (Multipart) |
| `POST` | `/me/portfolio` | Upload portfolio images (Max 5) |
| `POST` | `/me/student-email` | Trigger student email verification |
| `POST` | `/:id/connect` | Send connection interest email |

---

## 💎 Key Features

### 1. Neon Keep-Alive & Cold Starts
Since the Neon free tier suspends after 5 minutes of inactivity, the server implements:
- **Ping Loop**: Every 4 minutes, the server pings the DB to keep it active.
- **Retry Logic**: The `connectDB` helper uses exponential backoff to handle cold starts (retrying up to 6 times).

### 2. In-Memory Caching
The `listUsers` endpoint is cached for **60 seconds** to reduce DB load. The cache is automatically invalidated when any user updates their profile.

### 3. Premium Email Templates
Custom HTML templates for OTPs and "Connection Interests" designed with a dark, modern aesthetic to match the platform branding.

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📝 License
Built with ❤️ for Babcock University.
