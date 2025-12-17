# GeoBrains 🌍 - Geography Quiz Website

GeoBrains is an interactive geography quiz website that helps users test and improve their knowledge of world geography. Built with **React**, **Vite**, **Leaflet**, and **Prisma**, it features an engaging quiz interface with map visualization and robust database integration.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: (v18 or higher recommended)
- **XAMPP / MySQL**: For local database storage (Default port: `3307`)
- **VS Code**: Recommended editor

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/JustinReyes28/GeoBrains.git
   cd GeoBrains
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file and update it with your database credentials:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and set your `DATABASE_URL`.*

4. **Initialize the Database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or your local Vite port).

## 🎯 Features
- **Interactive Quizzes**: Test your knowledge of countries, capitals, and landmarks
- **Map Visualization**: See quiz questions on an interactive map
- **Progress Tracking**: Monitor your quiz performance and improvement
- **Responsive Design**: Works on desktop and mobile devices

## 🛠 Tech Stack
- **Frontend**: React, Tailwind CSS, Leaflet, Lucide React
- **Backend / DB**: Prisma, Vercel Serverless (Ready)
- **State Management**: TanStack Query (React Query)

## 📦 Scripts
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run lint`: Run ESLint checks
- `npm run preview`: Preview the production build locally

## 📄 License
[MIT](LICENSE) (or your preferred license)
