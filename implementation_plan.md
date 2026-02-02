# Implementation Plan: Fix Game Persistence

## Goal
Ensure that when a player resigns or agrees to a draw, the game result is correctly saved to the database. This fixes the issue where players notify "ongoing" in `matchmakingSocket.js` and get stuck in a loop.

## Proposed Changes

### Backend

#### [MODIFY] [gameSocket.js](file:///c:/Users/hocde/OneDrive/M%C3%A1y%20t%C3%ADnh/KTPM/chess-learning-platform/backend/src/socket/gameSocket.js)
1.  **Create Helper Function**: `handleGameEnd(roomId, result, reason, gameNamespace)`
    -   This function will encapsulate the logic currently inside `makeMove`'s "Game Over" block:
        -   Emit `gameEnded` event.
        -   Update `Game` document (result, endReason, completedAt).
        -   Calculate and update ELO ratings (using `eloCalculator`).
        -   Emit `ratingUpdate` events.
        -   Clean up the room (maybe after a delay or immediately depending on requirements - usually keep room in memory for a bit or rely on DB).
2.  **Update `resign` handler**:
    -   Call `handleGameEnd`.
3.  **Update `acceptDraw` handler**:
    -   Call `handleGameEnd`.
4.  **Update `makeMove` handler**:
    -   Use `handleGameEnd` when checkmate/stalemate/etc is detected to avoid code duplication.
5.  **Update `disconnect` handler (Abandonment)**:
    -   The current abandonment logic is inline. It can also use `handleGameEnd`.

## Verification
1.  **Resign**: User A resigns. Check DB: `result` should be 'black'/'white', `endReason` 'resignation'.
2.  **New Match**: User A clicks "Find Match". Should NOT redirect to old room.
