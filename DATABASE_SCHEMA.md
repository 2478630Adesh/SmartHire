# SmartHireX — Database Schema

MongoDB + Mongoose. Four primary collections.

---

## 1. `users` — User accounts (job seekers and HR managers)

| Field       | Type      | Constraints / Notes                                     |
|-------------|-----------|---------------------------------------------------------|
| `_id`       | ObjectId  | Auto-generated                                          |
| `name`      | String    | Required, trimmed                                       |
| `email`     | String    | Required, unique, lowercase, validated format           |
| `password`  | String    | Required, min 6 chars, **bcrypt-hashed**, `select: false` |
| `role`      | String    | Enum: `user` \| `hr`. Default: `user`                   |
| `company`   | String    | Empty for job seekers; company name for HR users        |
| `phone`     | String    | Optional                                                |
| `avatar`    | String    | Optional URL                                            |
| `createdAt` | Date      | Auto                                                    |
| `updatedAt` | Date      | Auto                                                    |

**Indexes:** `email` (unique).
**Methods:** `matchPassword(entered)` — bcrypt comparison.
**Hooks:** `pre('save')` hashes password if modified.

---

## 2. `resumes` — Built resumes

| Field           | Type           | Notes                                          |
|-----------------|----------------|------------------------------------------------|
| `_id`           | ObjectId       |                                                |
| `user`          | ObjectId → User| Owner (required)                               |
| `title`         | String         | e.g. "Full Stack Developer Resume"             |
| `templateId`    | String         | `template1` through `template10`               |
| `personalInfo`  | Subdocument    | fullName, jobTitle, email, phone, address, website, linkedin, github, summary, photo |
| `experience`    | Array          | Each: `jobTitle, company, location, startDate, endDate, current, description` |
| `education`     | Array          | Each: `degree, institution, location, startDate, endDate, gpa, description` |
| `skills`        | Array<String>  | Flat list                                      |
| `projects`      | Array          | Each: `name, description, technologies, link`  |
| `certifications`| Array          | Each: `name, issuer, date, link`               |
| `languages`     | Array          | Each: `name, proficiency`                      |
| `achievements`  | Array<String>  | Flat list                                      |
| `colors`        | Subdocument    | `primary` (hex), `accent` (hex)                |
| `createdAt`     | Date           | Auto                                           |
| `updatedAt`     | Date           | Auto                                           |

**Indexes:** `user` for fast lookup.

---

## 3. `jobs` — Job postings

| Field         | Type            | Notes                                          |
|---------------|-----------------|------------------------------------------------|
| `_id`         | ObjectId        |                                                |
| `hr`          | ObjectId → User | Poster (required, must have role='hr')         |
| `title`       | String          | Required, trimmed                              |
| `company`     | String          | Required, trimmed                              |
| `location`    | String          | Default: `Remote`                              |
| `type`        | String          | Enum: Full-time, Part-time, Contract, Internship. Default: Full-time |
| `experience`  | String          | e.g. "2-4 years"                               |
| `salary`      | String          | e.g. "₹12-18 LPA" (free text)                  |
| `description` | String          | Required                                       |
| `requirements`| String          | Optional                                       |
| `skills`      | Array<String>   | Required skills (highly weighted in ATS)       |
| `status`      | String          | Enum: `Open` \| `Closed`. Default: `Open`      |
| `createdAt`   | Date            | Auto                                           |
| `updatedAt`   | Date            | Auto                                           |

**Indexes:** `hr`, `status` + `createdAt`.

---

## 4. `applications` — Job applications (links user + resume + job)

| Field             | Type                | Notes                                         |
|-------------------|---------------------|-----------------------------------------------|
| `_id`             | ObjectId            |                                               |
| `job`             | ObjectId → Job      | Required                                      |
| `applicant`       | ObjectId → User     | Required                                      |
| `resume`          | ObjectId → Resume   | Which resume was submitted                    |
| `resumeText`      | String              | Full text extracted from the resume (for audit) |
| `atsScore`        | Number              | 0–100, computed at application time           |
| `matchedKeywords` | Array<String>       | Top matched keywords                          |
| `missingKeywords` | Array<String>       | Top missing keywords from JD                  |
| `status`          | String              | Enum: Applied, Shortlisted, Rejected, Hired. Default: Applied |
| `coverLetter`     | String              | Optional                                      |
| `createdAt`       | Date                | Auto                                          |
| `updatedAt`       | Date                | Auto                                          |

**Indexes:** Compound unique index on `{ job, applicant }` prevents duplicate applications.

---

## Entity Relationships

```
User (role=hr) ──< posts >── Job
                               │
                               │< applied to by >
                               ▼
                         Application ──> Resume
                               │
                               └──> User (role=user)
```

- **1 HR** → many **Jobs**
- **1 Job** → many **Applications**
- **1 User (job seeker)** → many **Resumes**, many **Applications**
- **1 Application** ←→ **1 Resume** (the snapshot submitted)
- **Unique constraint**: a user can only apply to the same job once

---

## ER Diagram (ASCII)

```
┌──────────────┐ 1      N ┌──────────────┐ 1      N ┌──────────────┐
│    USER      │──────────│     JOB      │──────────│ APPLICATION  │
│  (role=hr)   │   posts  │              │  receives│              │
└──────────────┘          └──────────────┘          └──────┬───────┘
                                                           │
                                                           │ N 1
┌──────────────┐ 1      N ┌──────────────┐          ┌──────┴───────┐
│    USER      │──────────│    RESUME    │──────────│ APPLICATION  │
│ (role=user)  │  creates │              │submitted │              │
└──────────────┘          └──────────────┘    as    └──────────────┘
                                                           │
                                                           │ N 1
                                                    ┌──────┴───────┐
                                                    │    USER      │
                                                    │ (applicant)  │
                                                    └──────────────┘
```

---

## Sample Query Patterns

**Get all applicants for a job, sorted by ATS score (HR dashboard):**
```js
Application.find({ job: jobId })
  .populate('applicant', 'name email phone')
  .populate('resume')
  .sort('-atsScore')
```

**Get HR dashboard stats:**
```js
// 1. Find all this HR's jobs
const jobs = await Job.find({ hr: req.user._id });
const jobIds = jobs.map(j => j._id);
// 2. Aggregate applications
Application.aggregate([
  { $match: { job: { $in: jobIds } } },
  { $group: { _id: null, avg: { $avg: '$atsScore' } } }
])
```

**Prevent duplicate applications:**
The compound unique index on `{ job, applicant }` throws on duplicate insert — the application controller catches it and returns a 400.

---

## Data sizes (for the seed)

After running `npm run seed`, you'll have:

- 5 users (2 HR, 3 job seekers)
- 3 resumes
- 4 jobs
- 5 applications with live-computed ATS scores

This is enough to demonstrate every feature end-to-end.
