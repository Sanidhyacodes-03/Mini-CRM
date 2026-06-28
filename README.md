# Mini CRM - Client Lead Management System

A full-stack MERN application for managing business leads, tracking their status, adding follow-up notes, and viewing analytics.

## Features

✅ **Admin Authentication** - Secure JWT-based login/registration  
✅ **Lead Management** - Create, read, update, delete leads  
✅ **Status Tracking** - New → Contacted → Converted (or Lost)  
✅ **Follow-up Notes** - Add timestamped notes to each lead  
✅ **Search & Filter** - Search by name/email, filter by status/source  
✅ **Analytics Dashboard** - Total leads, conversion rate, status breakdown  
✅ **Responsive Design** - Works on desktop and tablet  

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Custom CSS (Dark Theme) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (free tier)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd mini-crm
```

### 2. Set up the Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mini-crm?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
```

### 3. Set up the Frontend
```bash
cd ../client
npm install
```

### 4. Run the application
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 5. Seed sample data (optional)
```bash
cd server
npm run seed
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register admin user |
| POST | `/api/auth/login` | Login |
| GET | `/api/leads` | Get all leads |
| POST | `/api/leads` | Create lead |
| GET | `/api/leads/:id` | Get single lead |
| PUT | `/api/leads/:id` | Update lead |
| DELETE | `/api/leads/:id` | Delete lead |
| POST | `/api/leads/:id/notes` | Add note |
| GET | `/api/analytics` | Dashboard stats |

## Screenshots

- **Login Page** - Glassmorphism design with animated background
- **Dashboard** - Analytics cards, status breakdown, recent leads
- **Leads Table** - Search, filter, inline status change
- **Lead Detail** - Contact info, notes timeline

## License

MIT
