# Project Summary: Chess Learning Platform

## 1. Project Overview
The **Chess Learning Platform** is a comprehensive full-stack web application designed for playing, learning, and analyzing chess. It leverages modern web technologies to provide a real-time, interactive experience for users of all skill levels.

### Tech Stack
*   **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, Shadcn UI (Radix Primitives).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (Mongoose ORM).
*   **Real-time**: Socket.io (for gameplay and matchmaking).
*   **Chess Engine**: Stockfish (for AI opponents and analysis) & chess.js (for logic).

## 2. Key Features Implemented

### ♟️ Gameplay
*   **Online Multiplayer**: Real-time PvP matches with low latency.
*   **Play vs AI**: Integration with Stockfish engine with adjustable difficulty levels.
*   **Game State Management**: Detailed move validation, legal move highlighting, checkmate/stalemate detection.
*   **Interactive UI**: Drag-and-drop piece movement, click-to-move, and move history tracking.

### 🌐 Real-Time System
*   **Matchmaking**: Automated queuing system to find opponents based on Elo rating.
*   **Live Updates**: Instant synchronization of moves, game status, and chat messages between players.
*   **Room Management**: Robust handling of game rooms, including spectators and reconnection support.

### 👤 User System
*   **Authentication**: Secure login and registration.
*   **Profiles**: Detailed user profiles exhibiting Elo ratings, match history, and performance statistics.
*   **Social**: In-game chat functionality and global leaderboards.

### 🎓 Learning & Analysis
*   **Puzzles**: Interactive chess puzzles to practice tactics.
*   **Analysis**: Post-game analysis tools to review moves and mistakes.
*   **Lessons**: Infrastructure for structured chess lessons.

---

## 3. System Architecture Flowchart

```mermaid
graph TD
    %% Nodes
    User([User])
    LandingPage[Landing Page / Home]
    Auth{Authenticated?}
    Login[Login / Register]
    Dashboard[Main Dashboard]
    
    subgraph Features
        Profile[Profile & Stats]
        Leaderboard[Leaderboard]
        Puzzles[Puzzles & Learn]
    end

    subgraph "Play Mode"
        Lobby[Game Lobby]
        Matchmaking{Matchmaking}
        AIConfig[Configure AI Level]
        GameRoom[Game Room / Board]
    end

    subgraph "Backend Services"
        BEServer[Express Server]
        AuthService[Auth Service]
        SocketHandler[Socket.io Handles]
        Stockfish[Stockfish Engine]
        DB[(MongoDB)]
    end

    %% Connections
    User --> LandingPage
    LandingPage --> Auth
    Auth -- No --> Login
    Login --> Dashboard
    Auth -- Yes --> Dashboard

    Dashboard --> Profile
    Dashboard --> Leaderboard
    Dashboard --> Puzzles
    Dashboard --> Lobby

    %% Play Flow
    Lobby --> Matchmaking
    Lobby --> AIConfig
    Matchmaking -- Found --> GameRoom
    AIConfig --> GameRoom

    %% Game Logic
    GameRoom -- "Make Move / Action" --> SocketHandler
    SocketHandler -- "Validate Move" --> BEServer
    BEServer --> DB
    
    %% Real-time Updates
    SocketHandler -- "Broadcast Move" --> GameRoom
    SocketHandler -- "Game End / Rating Update" --> DB
    
    %% AI Connection
    AIConfig -. "Request Move" .-> Stockfish
    Stockfish -. "Best Move" .-> GameRoom

    %% Data Fetching
    Dashboard -. "Fetch User Data" .-> BEServer
    Puzzles -. "Fetch Puzzle" .-> BEServer
    BEServer -. "Query" .-> DB

    %% Styling
    classDef user fill:#f9f,stroke:#333,stroke-width:2px;
    classDef page fill:#e1f5fe,stroke:#0277bd,stroke-width:2px;
    classDef logic fill:#fff9c4,stroke:#fbc02d,stroke-width:2px;
    classDef db fill:#e0e0e0,stroke:#333,stroke-width:2px;

    class User user;
    class LandingPage,Login,Dashboard,GameRoom,Lobby,Profile,Leaderboard,Puzzles page;
    class Matchmaking,Auth,AIConfig logic;
    class DB db;
```

## 4. User Flow Description

1.  **Entry**: The user arrives at the landing page.
2.  **Authentication**: Accessing core features requires logging in. New users can register.
3.  **Lobby**: The central hub for starting games. Users can:
    *   Quick Match: Enter a queue to be matched with another player.
    *   Play vs AI: Select difficulty and start a local game against Stockfish.
4.  **Game Room**: The main interface where the game happens.
    *   **Moves**: Sent via Socket.io to the server.
    *   **Server**: Validates moves using `chess.js`, updates the game state in memory/database, and broadcasts the new state to both players.
    *   **Conclusion**: When checkmate/draw occurs, the server calculates new Elo ratings and saves the game record to MongoDB.
5.  **Post-Game**: Users can view the result, analyze the game, or return to the lobby.
