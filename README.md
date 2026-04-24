# SmartHireX — Resume Builder, ATS Analyzer, and Job Portal

A full-stack MERN application for job seekers and HR managers.

- **Job seekers** can build resumes from 10+ professional templates, analyze their resumes against any job description, browse jobs, and apply with one click.
- **HR managers** can post jobs, view applicants ranked by ATS score, and manage their hiring pipeline.

Built for a **final year project** — clean code, modular structure, and realistic data.

---

## ✨ Features

### For Job Seekers
- 📄 **Resume Builder** — 10 professionally designed templates, live preview, and autosave
- 🎨 **Customizable colors** — pick any primary color per resume
- 🎯 **ATS Checker** — upload any PDF/DOCX or select a saved resume, paste a job description, get an instant score with matched & missing keywords
- 💼 **Job Board** — browse open positions, filter by location and type
- ⚡ **One-click Apply** — attach any of your saved resumes to any job posting
- 📊 **Dashboard** — track all applications and their ATS scores

### For HR Managers
- 📝 **Post Jobs** — full job posting form with skills and requirements
- 👥 **Ranked Applicants** — candidates are automatically sorted by ATS match score
- 🏆 **Top 3 badges** — instantly identify the strongest matches
- ✅ **Pipeline Management** — shortlist, reject, or hire candidates
- 📈 **Dashboard Insights** — total applicants, average ATS scores, open positions

### ATS Scoring Engine
Core algorithm (fully offline, no external APIs):
- Extracts single tokens **and bigrams** from job descriptions
- Weights **tech/skill keywords** 2.5× (tracked in a curated list of 120+ tech terms)
- Weights **HR-declared required skills** 5× (maximum priority)
- Computes weighted match score across the top 40 keywords
- **Structural bonus** up to +10 points for having email, phone, experience, education, skills, and optimal length
- Returns matched keywords, missing keywords, and actionable suggestions

---

## 🏗️ Tech Stack

| Layer          | Tech                                                 |
|----------------|------------------------------------------------------|
| Frontend       | React 18 + Vite, Tailwind CSS, Framer Motion         |
| Backend        | Node.js + Express                                    |
| Database       | MongoDB (Mongoose ODM)                               |
| Auth           | JWT (Bearer tokens) + bcrypt                         |
| File parsing   | pdf-parse, mammoth (DOCX)                            |
| PDF export     | html2canvas + jsPDF                                  |
| Icons          | lucide-react                                         |

---

## 📁 Project Structure

```
SmartHireX/
├── backend/
│   ├── config/db.js                    # MongoDB connection
│   ├── controllers/                    # Route handlers
│   │   ├── authController.js
│   │   ├── resumeController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── atsController.js
│   ├── middleware/
│   │   ├── auth.js                     # JWT + HR-role guard
│   │   └── upload.js                   # Multer config
│   ├── models/                         # Mongoose schemas
│   │   ├── User.js
│   │   ├── Resume.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/                         # Express routers
│   ├── utils/
│   │   ├── atsScorer.js                # ← THE ATS ENGINE
│   │   ├── fileParser.js               # PDF/DOCX → text
│   │   ├── generateToken.js
│   │   └── seed.js                     # Demo data seeder
│   ├── uploads/                        # Temp upload dir
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js                       # Express entry
│
├── frontend/
│   ├── public/favicon.svg
│   ├── src/
│   │   ├── components/                 # Navbar, Footer, ProtectedRoute
│   │   ├── context/AuthContext.jsx     # User state + login/register/logout
│   │   ├── pages/                      # Landing, Login, Register, Dashboard, etc.
│   │   ├── templates/                  # 10 resume templates (Template1.jsx … Template10.jsx)
│   │   ├── styles/index.css            # Tailwind + custom utilities
│   │   ├── utils/api.js                # Axios instance w/ auth interceptor
│   │   ├── App.jsx                     # Router
│   │   └── main.jsx                    # Entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
│
├── DATABASE_SCHEMA.md
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+ ([download](https://nodejs.org))
- **MongoDB** running locally ([install guide](https://www.mongodb.com/docs/manual/installation/)) OR a free MongoDB Atlas URI
- Any modern browser

---

### 1. Clone & unzip
```bash
cd SmartHireX
```

### 2. Backend setup
```bash
cd backend
npm install
```

Copy the `.env.example` to `.env` (one is already included for local dev):
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smarthirex
JWT_SECRET=smarthirex_super_secret_key_change_me_in_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```
> If you're using **MongoDB Atlas**, replace `MONGO_URI` with your connection string.

**Seed the database with demo data** (optional but recommended):
```bash
npm run seed
```
This creates:
- HR account: `hr@smarthirex.com` / `hr12345`
- Job seeker: `user@smarthirex.com` / `user12345`
- 4 sample jobs, 3 sample resumes, 5 sample applications

**Start the backend:**
```bash
npm run dev      # with nodemon (hot reload)
# or
npm start        # plain node
```
The API runs at **http://localhost:5000**.

---

### 3. Frontend setup

**In a new terminal:**
```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:3000** and proxies all `/api` calls to the backend.

---

### 4. First use

1. Open http://localhost:3000
2. Click **Log in** → use the demo-login buttons, **or** register a new account
3. Try the flow:
   - **As a job seeker**: Pick a template → fill in your info → check ATS against a job → apply to a job
   - **As HR**: Log in as HR → post a job → view applicants sorted by ATS score

---

## 🔐 Demo Accounts

| Role       | Email                     | Password    |
|------------|---------------------------|-------------|
| Job Seeker | `user@smarthirex.com`     | `user12345` |
| HR Manager | `hr@smarthirex.com`       | `hr12345`   |
| HR Manager | `rahul@innovatech.com`    | `hr12345`   |

---

## 🔌 API Endpoints

All protected endpoints require `Authorization: Bearer <token>` header.

### Auth
- `POST /api/auth/register` — `{ name, email, password, role?, company? }`
- `POST /api/auth/login` — `{ email, password }`
- `GET  /api/auth/me` — (protected) current user
- `PUT  /api/auth/me` — (protected) update profile

### Resumes (protected)
- `GET    /api/resumes` — list my resumes
- `POST   /api/resumes` — create resume
- `GET    /api/resumes/:id` — get one
- `PUT    /api/resumes/:id` — update
- `DELETE /api/resumes/:id` — delete

### Jobs
- `GET  /api/jobs` — public; supports `?search=&location=&type=`
- `GET  /api/jobs/:id` — public
- `POST /api/jobs` — HR only
- `PUT  /api/jobs/:id` — HR only (owner)
- `DELETE /api/jobs/:id` — HR only (owner)
- `GET  /api/jobs/my/posts` — HR only, with application counts

### Applications (protected)
- `POST /api/applications` — apply `{ jobId, resumeId, coverLetter? }` → returns ATS score
- `GET  /api/applications/my` — my applications
- `GET  /api/applications/job/:jobId` — HR only, applicants sorted by ATS
- `PUT  /api/applications/:id/status` — HR only, `{ status: 'Shortlisted'|... }`
- `GET  /api/applications/hr/stats` — HR dashboard stats

### ATS Checker (protected)
- `POST /api/ats/analyze-resume` — `{ resumeId, jobDescription }` analyzes a saved resume
- `POST /api/ats/analyze-upload` — multipart: `resume` file + `jobDescription` field
- `POST /api/ats/check-upload` — multipart: general health check, no JD needed

---

## 🧠 How the ATS scorer works

See `backend/utils/atsScorer.js`. In short:

1. **Tokenize** both the resume and job description (lowercase, strip punctuation, split on whitespace).
2. **Extract keywords** — single words and bigrams — filtering out 150+ stop words and pure numbers.
3. **Weight keywords**:
   - Base weight = frequency in JD
   - 2.5× multiplier if it's a tech keyword (from a curated list of 120+ tech terms)
   - +5 flat bonus if it's an HR-declared required skill
4. **Keep top 40** highest-weighted keywords as the matching set.
5. **Match** — check if each top keyword (including bigrams via `.includes()`) appears in the resume text.
6. **Score** = `round((matchedWeight / totalWeight) * 100)`.
7. **Structural bonus** (+10 max): detects email, phone, experience/education sections, optimal length.
8. **Suggestions** — actionable hints based on what's missing.

This is **entirely offline** — no API keys or external services needed.

---

## 🎨 The 10 Templates

| ID         | Name         | Category     | Best for                               |
|------------|--------------|--------------|----------------------------------------|
| template1  | Professional | Classic      | Corporate, finance, consulting         |
| template2  | Editorial    | Minimal      | Writers, editors, consultants          |
| template3  | Modern       | Creative     | Designers, marketers                   |
| template4  | ATS Pro      | ATS-friendly | High-ATS environments, conservative    |
| template5  | Creative     | Creative     | Creative industries, startups          |
| template6  | Executive    | Classic      | C-suite, senior leadership             |
| template7  | Tech         | Creative     | Software engineers, developers         |
| template8  | Timeline     | Modern       | Career storytelling, journalists       |
| template9  | Compact      | Modern       | Senior pros with rich history          |
| template10 | Gradient     | Modern       | Startups, modern tech                  |

Each template receives the same `data` prop (resume object) and renders independently, so adding new templates is simply a matter of creating `Template11.jsx` and registering it in `src/templates/index.js`.

---

## 🐛 Troubleshooting

**"MongoDB connection error"**
→ Make sure MongoDB is running locally (`mongod` service) or update `MONGO_URI` in `.env`.

**"Port 3000/5000 already in use"**
→ Change `PORT` in `backend/.env` or the `server.port` in `frontend/vite.config.js`.

**"File upload failed"**
→ Check `backend/uploads/` exists and is writable. Max file size is 5 MB.

**"PDF export produces blank page"**
→ Make sure the preview is visible (not hidden) when you click Export PDF. html2canvas needs the DOM node to be rendered.

**"CORS errors"**
→ Ensure `CLIENT_URL` in `backend/.env` matches your frontend URL exactly.

---

## 📝 For Your Project Report

Key talking points:

1. **Architecture** — separation of concerns: React frontend, Express API, MongoDB storage
2. **Authentication** — stateless JWT with bcrypt password hashing, role-based access control
3. **ATS Algorithm** — explain the keyword extraction, weighting, and scoring formula
4. **Reusable templates** — single data contract (resume object), 10 different presentational components
5. **Scalability** — indexed Mongoose schemas (`applicationSchema.index({ job, applicant }, { unique: true })`)
6. **Security** — password hashing, JWT expiration, route guards, input validation, file-type filtering

---

## 📜 License

MIT — free to use, modify, and submit as your final year project.

**Built with ❤️ for SmartHireX.**
