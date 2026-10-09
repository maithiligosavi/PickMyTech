# 🚀 PickMyTech

**PickMyTech** is an AI-powered tech hardware recommendation platform built with React, TypeScript, Vite, and Tailwind CSS. It helps users find their ideal tech hardware—such as laptops, smartphones, headphones, and smartwatches—in three smart steps. Powered by Gemini AI, PickMyTech evaluates hardware specifications against user budgets and needs to deliver personalized recommendations and detailed comparisons.

---

## ✨ Features

- 🎯 **3-Step Recommendation Wizard**: Select device category, budget, primary use cases, and key feature priorities.
- 🤖 **AI-Driven Insights**: Leverages Gemini AI to evaluate hardware specs, score matches, and generate tailored rationales ("Why this fits you").
- 📊 **Comparison Matrix**: Side-by-side spec comparisons of top recommended devices.
- 🔐 **Firebase Authentication**: User accounts with Sign Up, Login, and Password Reset capabilities.
- 📜 **Recommendation History**: Logged-in users can save and view their past recommendation runs anytime.
- 🎨 **Modern Dark Aesthetic**: Sleek glassmorphism UI built with Tailwind CSS, Lucide React icons, and smooth Framer Motion animations.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling & Motion**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Authentication & Firestore), Python, FastAPI
- **AI Integration**: [Google Gemini API](https://ai.google.dev/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn` / `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/PickMyTech.git
   cd PickMyTech
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can copy `.env.example` if available) and add your Firebase credentials:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser to view the app.

---

## 📦 Scripts

- `npm run dev` – Starts the local development server with Vite.
- `npm run build` – Builds the production bundle.
- `npm run preview` – Locally previews the production build.
- `npm run typecheck` – Runs TypeScript type checks.
- `npm run lint` – Runs ESLint checks.

---

## 📄 License

This project is licensed under the MIT License.
