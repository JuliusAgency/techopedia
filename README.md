# Techopedia

An intelligent design analysis platform that transforms SVG designs into actionable insights. Techopedia automatically analyzes SVG files, extracts rectangle elements with precise coordinates and dimensions, and detects issues such as out-of-bounds elements, missing fills, and viewport boundary violations.

## Features

- **Automatic Detection**: Instantly identifies all rectangles in SVG files, extracting coordinates, dimensions, fill colors, and positioning data
- **Issue Detection**: Automatically flags problematic elements including out-of-bounds rectangles and missing fills
- **Comprehensive Analysis**: Provides detailed insights for every element in your design files

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Animation library
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **fast-xml-parser** - SVG/XML parsing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Development Tools
- **npm workspaces** - Monorepo management
- **concurrently** - Run multiple commands simultaneously
- **nodemon** - Development server auto-reload
- **TypeScript** - Type checking and compilation

## Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB (running locally or connection string)

## Running Locally

### Backend (Server)

1. Navigate to the project root directory
2. Install dependencies and start the server:
   ```bash
   npm run dev:server
   ```
   
   Or install dependencies separately:
   ```bash
   npm install --workspace=server
   npm run dev --workspace=server
   ```

The server will start on `http://localhost:3001` (or the port specified in `PORT` environment variable).

**Environment Variables** (optional):
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string (default: `mongodb://localhost:27017/techopedia`)

### Frontend (Client)

1. Navigate to the project root directory
2. Install dependencies and start the client:
   ```bash
   npm run dev:client
   ```
   
   Or install dependencies separately:
   ```bash
   npm install --workspace=client
   npm run dev --workspace=client
   ```

The client will start on `http://localhost:5173` (Vite default port).

### Running Both Together

To run both backend and frontend simultaneously:

```bash
npm run dev
```

This will start both the server and client concurrently.

## Project Structure

- `/server` - Express.js backend with TypeScript
- `/client` - React frontend with Vite and TypeScript
