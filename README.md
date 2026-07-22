#  HostelHub – AI Powered Hostel Complaint Management System
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8)


-HostelHub is a full-stack web application that streamlines hostel maintenance by connecting 
**students**, **maintenance workers**, and **administrators** on a single platform.

-Students can register complaints with AI-assisted descriptions and image uploads, administrators can assign complaints to workers, and workers can update progress with completion notes and images.
-The system provides real-time status tracking from complaint submission to resolution.

## ✨ Key Features

- 🤖 AI-assisted complaint generation using Google Gemini
- 🔐 Secure JWT authentication with role-based access
- 📸 Cloudinary image uploads for complaint and completion proof
- 👨‍🎓 Student, Worker, and Admin dashboards
- 📋 Complaint lifecycle tracking (Pending → Assigned → In Progress → Completed)
- 🕒 Timeline history for every complaint
- 🔔 Notification system
- ☁️ MongoDB Atlas database integration

---



## 📸 Screenshots
### login page
<img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/e1460e09-e0f1-439f-8403-4120b58ec799" />


### Student Dashboard
<img width="1917" height="917" alt="image" src="https://github.com/user-attachments/assets/e10945b9-7d88-4c9d-8a96-0b05aaaa5e68" />


### Admin Dashboard
<img width="1917" height="913" alt="image" src="https://github.com/user-attachments/assets/d7eb6618-0f65-452e-9e17-a3da35f12778" />


### Worker Dashboard
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/5f444e27-b2bc-4b04-8386-2ad9fb5576d0" />


### Complaint Timeline
<img width="1918" height="917" alt="image" src="https://github.com/user-attachments/assets/ce2b054f-f40c-4ba7-bfdc-324aab7785c8" />


## Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Forms      | React Hook Form + Zod (shared validation, client & server) |
| Backend    | Next.js API Routes (same project, no separate server) |
| Database   | MongoDB + Mongoose |
| Auth       | JWT (access + refresh tokens) in httpOnly cookies, bcrypt password hashing |
| Images     | Cloudinary |
| AI         | Google Gemini API (optional — falls back to a simple keyword matcher if no key is set) |
| Email      | Nodemailer (OTP codes / password reset) |
| Deployment | Vercel + MongoDB Atlas |

---

##  Folder Structure

```
src
├── app
│   ├── (auth)
│   ├── student
│   ├── worker
│   ├── admin
│   └── api
├── components
├── models
├── lib
├── hooks
├── context
├── middleware.ts
└── validations
```



---

## 🚀 Running the Project

npm install
npm run dev
Create a .env.local file using .env.example and configure your own MongoDB Atlas, Cloudinary, JWT, Gemini API, and SMTP credentials before starting the application.

The application will be available at:

http://localhost:3000

### Sample logins (created by `npm run seed`, password: `Password@123`)
| Role    | Email |
|---------|-------|
| Admin   | admin@nitdelhi.ac.in |
| Worker  | ramesh.worker@gmail.com|
| Student | asha.verma@nitdelhi.ac.in |

> Note: `ALLOWED_EMAIL_DOMAIN` in `.env.local` controls which email domain
> can register (defaults to `@nitdelhi.ac.in`).

---

## 🔄 Application Workflow

👨‍🎓 Student
-Register and securely log in.
-Create maintenance complaints.
-Upload complaint images.
-Use AI to improve complaint descriptions.
-Track complaint progress through every stage.



👷 Worker
View assigned complaints.
Update complaint status.
Add completion notes.
Upload proof images after resolving complaints.


👨‍💼 Admin
-Monitor all complaints.
-Assign workers.
vTrack complaint progress.
vView analytics and complaint statistics.
vClose completed complaints.


---

##  Key Files to Understand Before Your Viva


| Module               | Description                                                    |
| -------------------- | -------------------------------------------------------------- |
| Authentication       | Secure JWT authentication with role-based access control       |
| Complaint Management | Complaint creation, assignment, tracking, and resolution       |
| AI Assistant         | Google Gemini integration for improving complaint descriptions |
| Image Upload         | Cloudinary integration for complaint and completion images     |
| Dashboards           | Separate dashboards for Students, Workers, and Administrators  |
| Notifications        | Keeps users informed about complaint progress                  |



---
##  🏗️ System Architecture

Student
    │
    ▼
Complaint Registration
    │
    ▼
Admin Reviews Complaint
    │
    ▼
Assigns Worker
    │
    ▼
Worker Updates Status
    │
    ▼
Uploads Completion Image
    │
    ▼
Complaint Completed

---


## 🔐 Security Features
-JWT Authentication
-Role-Based Access Control
-Password hashing using bcrypt
-Server-side validation using Zod
-Protected API routes
-Secure image storage using Cloudinary

---

## 🔐Project Highlights
-Full-stack Next.js application
-AI-assisted complaint generation
-Cloud image uploads
vTimeline-based complaint tracking
-Responsive dashboard interface
-Modular and scalable architecture
-MongoDB Atlas integration
-Production-ready build



##  Deployment

-The application can be deployed using Vercel with MongoDB Atlas and Cloudinary.

-Configure the required environment variables before deployment.



---

## 📌 Future Improvements
- Push notifications
- Mobile responsive PWA version
- QR code based hostel complaint registration

---

## 👨‍💻 Author

**Rishabh Mishra**

Built as a full-stack portfolio project using Next.js, TypeScript, MongoDB, Cloudinary, and Google Gemini AI.
