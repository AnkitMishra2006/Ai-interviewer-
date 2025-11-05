# AI Recruiter Pro - Frontend

React (Vite) frontend for the AI Recruiter Pro interview platform.

## 📦 Required Dependencies

### Install all dependencies:

```bash
npm install react-router-dom axios firebase
```

**Detailed packages:**
- `react-router-dom` - Client-side routing
- `axios` - HTTP client for API calls
- `firebase` - Firebase client SDK for authentication

### Optional (for better UX):
```bash
npm install react-toastify
```

## 🚀 Getting Started

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your Firebase config:**
   - Get Firebase config from Firebase Console
   - Add your backend API URL

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── config/          # Firebase configuration
├── context/         # React Context (Auth state)
├── pages/           # Page components (routes)
├── components/      # Reusable UI components
├── hooks/           # Custom React hooks
├── services/        # API services (axios)
├── utils/           # Helper functions & constants
├── App.jsx          # Main app with routing
├── main.jsx         # Entry point
└── index.css        # Global styles (Tailwind)
```

## 🛣️ Routes

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/login` | Login | Public | Login form |
| `/signup` | Signup | Public | Registration |
| `/dashboard` | Dashboard | Candidate | Candidate dashboard |
| `/upload-resume` | ResumeUpload | Candidate | Resume upload |
| `/interview/:sessionId` | InterviewRoom | Candidate | Live interview |
| `/recruiter` | RecruiterDashboard | Recruiter | Interview list |
| `/recruiter/interview/:id` | InterviewDetail | Recruiter | Full report |
| `/recruiter/analytics` | Analytics | Recruiter | Analytics dashboard |

## 📝 Next Steps

All pages are **skeleton components** with TODO comments. Replace them with v0.dev generated UI components.

### Pages to generate with v0:
1. **Landing Page** - Hero section, features, CTA
2. **Login/Signup** - Authentication forms
3. **Dashboard** - Candidate overview
4. **Resume Upload** - Drag & drop interface
5. **Interview Room** - Webcam + questions layout
6. **Recruiter Dashboard** - Interview list with filters
7. **Interview Detail** - Full evaluation report
8. **Analytics** - Charts and metrics

## 🔥 Firebase Setup Required

Before running, you must:
1. Create Firebase project
2. Enable Email/Password authentication
3. Get Firebase config
4. Update `.env` file

See `PROJECT_ROADMAP.md` for detailed Firebase setup instructions.
