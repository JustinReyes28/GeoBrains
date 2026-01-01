# GeoBrains 🌍 - Geography Quiz Website

GeoBrains is an interactive geography quiz website that helps users test and improve their knowledge of world geography. Built with **Next.js**, **React**, **Leaflet**, and **Prisma**, it features an engaging quiz interface with map visualization and robust database integration.

Here are some screenshots of the GeoBrains application:

<img src="public/images/Dashboard1.png" alt="Dashboard View" width="500"/> <img src="public/images/Quiz_Category.png" alt="Quiz Category View" width="500"/>

<img src="public/images/Profile.png" alt="Profile View" width="500"/> <img src="public/images/Category_Perfomance.png" alt="Category Performance View" width="500"/>

<img src="public/images/Leaderboard.png" alt="Leaderboard View" width="500"/> <img src="public/images/Register_User.png" alt="Register User View" width="500"/>

## ✦ Getting Started

### Prerequisites
- **Node.js**: (v18 or higher recommended)
- **PostgreSQL**: For local database storage (Default port: `5432`)
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
   *Edit `.env` and set your `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`. The `POSTGRES_PRISMA_URL` is used for connection pooling, while `POSTGRES_URL_NON_POOLING` is for direct database access.*

4. **Initialize the Database**:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000` (Next.js default port).

## ✦ Project Structure

The project includes the following key directories:

- `app/` - Contains all pages and API routes
- `components/` - Reusable React components
- `public/images/` - Contains all Screenshot images for the application:

## ✦ Features
- **Interactive Quizzes**: Test your knowledge of countries, capitals, and landmarks
- **Map Visualization**: See quiz questions on an interactive map
- **Progress Tracking**: Monitor your quiz performance and improvement
- **Responsive Design**: Works on desktop and mobile devices
- **Next.js App Router**: Modern file-based routing with React Server Components
- **Rich Visual Content**: High-quality images for enhanced learning experience

## ✦ Assets

The application uses various image assets stored in `public/images/`:
- **Flags**: Country flags for visual identification
- **Landmarks**: Images of famous landmarks for the landmarks quiz
- **Famous People**: Portraits of notable figures for the famous people quiz
- **UI Elements**: Backgrounds, icons, and other visual elements

## ✦ Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Frontend**: React 19, Tailwind CSS, Leaflet, Lucide React
- **Backend / DB**: Prisma with PostgreSQL, Vercel Serverless (Ready)
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS v4
- **Image Handling**: Next.js Image Optimization for all visual assets

## ✦ Scripts
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run start`: Run production server
- `npm run lint`: Run ESLint checks

## ✦ License
[MIT](LICENSE)
