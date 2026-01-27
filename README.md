# ♟️ Chess Learning Platform

A comprehensive full-stack chess web application with **AI Stockfish integration**, **real-time multiplayer**, **puzzle system**, **learning resources**, and **AI chatbot coaching**.

## 🎯 Features

### 🎮 Gameplay
- **Play vs AI**: Challenge Stockfish engine with 20 difficulty levels
- **Online Multiplayer**: Real-time chess games with automatic matchmaking
- **Private Rooms**: Create custom games and invite friends
- **Move Validation**: Chess.js integration for legal move checking
- **Game History**: Track all your matches and review them later

### 🧩 Learning & Practice
- **Chess Puzzles**: Solve tactical puzzles (mate-in-1, mate-in-2, forks, pins, etc.)
- **Video Lessons**: Learn openings, tactics, and endgames
- **Interactive Tutorials**: Step-by-step chess education
- **Progress Tracking**: Monitor your improvement over time

### 📊 Analysis
- **Stockfish Analysis**: Deep position evaluation
- **Best Move Suggestions**: Get AI-powered move recommendations
- **PGN/FEN Support**: Import and analyze any chess position
- **Evaluation Bar**: Visual position assessment

### 🤖 AI Coach
- **Chatbot Integration**: Ask questions about chess strategy
- **Opening Guidance**: Get personalized opening recommendations
- **Tactical Advice**: Learn tactical patterns and combinations
- **Contextual Help**: Real-time chess coaching

### 👑 Community
- **Elo Rating System**: Competitive ranking
- **Leaderboards**: Compete with players worldwide
- **User Profiles**: Track stats, achievements, and history
- **In-Game Chat**: Communicate with opponents

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI Library**: React 19
- **Styling**: TailwindCSS with custom dark theme
- **Chess Board**: react-chessboard
- **Chess Logic**: chess.js
- **Real-time**: Socket.IO client
- **State Management**: React Context API
- **Notifications**: react-hot-toast
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken + bcryptjs)
- **Real-time**: Socket.IO
- **Chess Engine**: Custom Stockfish implementation
- **AI Chat**: OpenAI API (GPT-3.5-turbo)
- **Chess Logic**: chess.js

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- OpenAI API key (optional, for chatbot features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chess-learning-platform
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env and add your configurations:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (your secret key)
# - OPENAI_API_KEY (optional - for AI chatbot)

# Start backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Configure environment variables
# Create .env.local file (already created)
# Verify the API URLs are correct

# Start frontend development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🚀 Running the Application

### Quick Start

**Make sure MongoDB is running first:**

```bash
# Windows - if MongoDB is installed as a service
net start MongoDB

# Or start MongoDB manually
mongod --dbpath "C:\data\db"
```

**Then run the application:**

```bash
# Install all dependencies (first time only)
npm run install:all

# Run both backend and frontend
npm run dev
```

**Access the application:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

> **💡 Để truy cập từ máy khác (LAN):** Xem file `TRUY_CAP_LAN.md`

---

### Alternative: Run Separately

If you prefer to run them in separate terminals:

1. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

2. **Start Backend** (Terminal 1):
   ```bash
   cd backend
   npm run dev
   ```

3. **Start Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Open Browser**:
   Navigate to `http://localhost:3000`

### Production Build

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/stats/:id` - Get user statistics
- `GET /api/user/leaderboard` - Get global leaderboard

### Games
- `POST /api/games/create` - Create new game
- `GET /api/games/:id` - Get game by ID
- `GET /api/games/user/:userId` - Get user's games
- `PUT /api/games/:id` - Update game
- `POST /api/games/:id/end` - End game

### Puzzles
- `GET /api/puzzles/random` - Get random puzzle
- `GET /api/puzzles/all` - Get all puzzles
- `POST /api/puzzles/validate` - Validate puzzle solution
- `POST /api/puzzles/create` - Create puzzle (admin)

### Lessons
- `GET /api/lessons` - Get all lessons
- `GET /api/lessons/:id` - Get lesson by ID
- `POST /api/lessons/:id/complete` - Mark lesson complete

### Analysis
- `POST /api/analysis/position` - Analyze position
- `POST /api/analysis/best-move` - Get best move
- `POST /api/analysis/top-moves` - Get top moves

### Chatbot
- `POST /api/chatbot/chat` - Chat with AI coach

## 🎮 Socket.IO Events

### Game Namespace (`/game`)
- `joinRoom` - Join game room
- `makeMove` - Make a chess move
- `chatMessage` - Send chat message
- `offerDraw` - Offer draw
- `resign` - Resign game
- `leaveRoom` - Leave game room

### Matchmaking Namespace (`/matchmaking`)
- `joinQueue` - Join matchmaking queue
- `leaveQueue` - Leave matchmaking queue
- `matchFound` - Match found (emitted by server)

## 🎨 UI Features

### Modern Design
- **Dark Mode Theme**: Eye-friendly dark interface
- **Glassmorphism**: Premium glass effects
- **Smooth Animations**: Framer Motion transitions
- **Responsive**: Mobile-first design
- **Custom Chessboard**: Styled chess pieces and board

### User Experience
- **Real-time Updates**: Instant move synchronization
- **Toast Notifications**: Clean feedback system
- **Loading States**: Smooth loading indicators
- **Form Validation**: Client & server validation

## 📝 Default Accounts

Create your first admin account:

1. Register normally through the UI
2. Access MongoDB and update user:
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { isAdmin: true } }
   )
   ```

## 🔧 Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chess-platform
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_openai_key  # Optional
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Backend won't start
- Ensure MongoDB is running
- Check .env file exists with correct values
- Verify port 5000 is available

### Frontend won't start
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check .env.local exists

### Socket.IO not connecting
- Verify backend is running
- Check NEXT_PUBLIC_SOCKET_URL in .env.local
- Check browser console for CORS errors

### AI Chatbot not working
- Chatbot will use fallback responses if OPENAI_API_KEY is not set
- Verify API key is correct in backend .env
- Check OpenAI API credits/quota

## 📚 Project Structure

```
chess-learning-platform/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── middleware/      # Express middleware
│   │   └── server.js        # Entry point
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages
    │   ├── components/      # React components
    │   ├── lib/             # Utilities
    │   └── styles/          # Global styles
    ├── public/              # Static files
    ├── package.json
    └── .env.local
```

## 🎯 Future Enhancements

- [ ] Time controls (blitz, rapid, classical)
- [ ] Tournament system
- [ ] Live streaming
- [ ] Mobile app (React Native)
- [ ] Chess variants (Chess960, etc.)
- [ ] Advanced analytics dashboard
- [ ] Social features (friends, clubs)
- [ ] Email notifications
- [ ] Two-factor authentication

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please create an issue in the repository.

---

**Happy Chess Playing! ♟️**
