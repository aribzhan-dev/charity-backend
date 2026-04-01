# Event & Charity Management API

A RESTful API built with Node.js and Express.js for managing events and charity campaigns. The system supports three roles: Admin, Company, and User.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Token)
- **Password Hashing:** Bcrypt
- **File Upload:** Multer
- **Email Service:** Nodemailer
- **Environment Variables:** Dotenv

---

## 📁 Project Structure
```
project/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Admin.model.js
│   │   ├── Company.model.js
│   │   ├── User.model.js
│   │   ├── EventRequest.model.js
│   │   └── CharityRequest.model.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   ├── controllers/
│   │   ├── admin.controller.js
│   │   ├── company.controller.js
│   │   └── user.controller.js
│   ├── routes/
│   │   ├── admin.routes.js
│   │   ├── company.routes.js
│   │   └── user.routes.js
│   └── utils/
│       ├── mailer.js
│       └── upload.js
├── uploads/
│   ├── images/
│   ├── files/
│   ├── videos/
│   └── audios/
├── scripts/
│   └── createAdmin.js
├── .env
├── .gitignore
├── package.json
└── index.js
```

---

## ⚙️ Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/your_db_name
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your@gmail.com
MAIL_PASS=your_gmail_app_password
```

4. **Create upload folders**
```bash
mkdir -p uploads/images uploads/files uploads/videos uploads/audios
```

5. **Create first admin**
```bash
node scripts/createAdmin.js
```

6. **Start the server**
```bash
# Development
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:3000`

---

## 🔐 Authentication

All protected routes require a Bearer token in the request header:
```
Authorization: Bearer <your_token>
```

Tokens are obtained by logging in as Admin, Company, or User.

---

## 👥 Roles & Permissions

| Action | Admin | Company | User |
|---|---|---|---|
| Create company | ✅ | ❌ | ❌ |
| View all companies | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| View all requests | ✅ | ❌ | ❌ |
| Accept / Reject requests | ✅ | ❌ | ❌ |
| Submit event request | ❌ | ✅ (event only) | ❌ |
| Submit charity request | ❌ | ✅ (charity only) | ❌ |
| View own requests | ❌ | ✅ | ❌ |
| View accepted events | ❌ | ❌ | ✅ |
| Join an event | ❌ | ❌ | ✅ |
| View accepted charities | ❌ | ❌ | ✅ |
| Donate to charity | ❌ | ❌ | ✅ |

---

## 📡 API Endpoints


---

### 🔑 Admin

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/admin/login` | Admin login | ❌ |
| POST | `/admin/company` | Create a company | ✅ Admin |
| GET | `/admin/companies` | Get all companies | ✅ Admin |
| GET | `/admin/users` | Get all users | ✅ Admin |
| GET | `/admin/requests` | Get all requests | ✅ Admin |
| PATCH | `/admin/requests/event/:id/accept` | Accept event request | ✅ Admin |
| PATCH | `/admin/requests/event/:id/reject` | Reject event request | ✅ Admin |
| PATCH | `/admin/requests/charity/:id/accept` | Accept charity request | ✅ Admin |
| PATCH | `/admin/requests/charity/:id/reject` | Reject charity request | ✅ Admin |

**Query Parameters:**
```
GET /api/admin/companies?type=event
GET /api/admin/companies?type=charity
GET /api/admin/requests?type=event&status=pending
GET /api/admin/requests?type=charity&status=accepted
```

---

### 🏢 Company

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/company/login` | Company login | ❌ |
| POST | `/company/requests/event` | Submit event request | ✅ Company (event) |
| POST | `/company/requests/charity` | Submit charity request | ✅ Company (charity) |
| GET | `/company/requests/my` | Get own requests | ✅ Company |

> **Note:** Event requests and charity requests must be submitted as `multipart/form-data` because they support file uploads.

**Event Request Body (form-data):**
```
title           → string (required)
description     → string (required)
date            → date (required)
location        → string (required)
peopleNeeded    → number (required)
transferDetails → boolean (true/false)
files           → file (optional, multiple)
```

**Charity Request Body (form-data):**
```
title           → string (required)
description     → string (required)
targetAmount    → number (required)
payment_link    → string (required)
files           → file (optional, multiple)
```

---

### 👤 User

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/user/register` | Register new user | ❌ |
| POST | `/user/login` | User login | ❌ |
| GET | `/user/profile` | Get own profile | ✅ User |
| GET | `/user/events` | Get accepted events (dashboard) | ✅ User |
| POST | `/user/events/:id/join` | Join an event | ✅ User |
| GET | `/user/charities` | Get accepted charities (dashboard) | ✅ User |
| POST | `/user/charities/:id/donate` | Donate to a charity | ✅ User |

**Donate Body:**
```json
{
  "amount": 200000
}
```

---

## 📂 File Uploads

Uploaded files are automatically sorted into folders based on their type:

| File Type | Folder |
|---|---|
| Images (jpg, png, webp, gif) | `uploads/images/` |
| Documents (pdf, doc, docx) | `uploads/files/` |
| Videos (mp4, mkv) | `uploads/videos/` |
| Audio (mp3, wav) | `uploads/audios/` |

Files are renamed using UUID to avoid conflicts.

**Accessing uploaded files:**
```
http://localhost:3000/uploads/images/uuid-filename.jpg
http://localhost:3000/uploads/files/uuid-filename.pdf
```

**Max file size:** 50MB

---

## 🔄 Business Logic

### Event Flow
```
1. Admin creates an event company
2. Event company submits an event request
3. Admin reviews and accepts the request
4. Accepted event appears on user dashboard
5. Users join the event one by one
6. When attendees count reaches peopleNeeded → status changes to "completed"
7. Completed event disappears from dashboard
```

### Charity Flow
```
1. Admin creates a charity company
2. Charity company submits a charity request with payment link
3. Admin reviews and accepts the request
4. Accepted charity appears on user dashboard
5. Users donate by entering an amount → receive payment link
6. When collectedAmount reaches targetAmount → status changes to "completed"
7. Completed charity disappears from dashboard
```

---

## ⚠️ Error Responses

| Status Code | Meaning |
|---|---|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient role permissions) |
| 404 | Resource not found |
| 500 | Internal server error |
```json
{
  "message": "Error description here"
}
```

---

## 📜 Scripts
```bash
# Create the first admin account
node scripts/createAdmin.js

# Run in development mode (with auto-restart)
npm run dev

# Run in production mode
npm start
```

---

## 🔒 Security Notes

- Passwords are hashed using **Bcrypt** before storing in the database
- JWT tokens expire based on `JWT_EXPIRES_IN` value in `.env`
- Only Admin can create company accounts — companies cannot self-register
- Role-based middleware protects every sensitive route
- File uploads are validated by MIME type before saving

---

## 📄 License

MIT