# Task: Fix Game End Persistence & Matchmaking Loop

## Context
When a player resigns, the game sends a notification but fails to update the database state. This leaves the game as "ongoing" in the DB. Consequently, the matchmaking reconnection logic (which looks for ongoing games) forces users back into this finished game instead of finding a new one.

## Todo List
- [ ] **Refactor Backend (`gameSocket.js`)**:
    - [ ] Extract ELO calculation and Game DB update logic into a reusable helper function (`handleGameOver`).
    - [ ] Update `resign` handler to use `handleGameOver`.
    - [ ] Update `acceptDraw` handler to use `handleGameOver`.
    - [ ] Ensure `makeMove` uses this shared logic or remains consistent.
- [ ] **Frontend (`page.tsx`)**:
    - [ ] Ensure `gameEnded` event triggers the "Game Over" modal/UI state correctly for both players.
    - [ ] Verify that "Find Match" works after resignation (because DB status is now 'finished').
- [ ] **Verify**:
    - [ ] Test Resignation -> DB update -> New Match.
    - [ ] Test Draw -> DB update -> New Match.
