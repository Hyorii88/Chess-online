import { Chess } from 'chess.js';

// Stockfish service using a simple evaluation algorithm
// In production, you would use stockfish.js or stockfish WASM

class StockfishService {
    constructor() {
        this.depth = 15;
    }

    // Simple piece values for evaluation
    getPieceValue(piece) {
        const values = {
            p: 100,
            n: 320,
            b: 330,
            r: 500,
            q: 900,
            k: 20000
        };
        return values[piece.toLowerCase()] || 0;
    }

    // Evaluate board position
    evaluateBoard(chess) {
        let evaluation = 0;
        const board = chess.board();

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = board[i][j];
                if (square) {
                    const value = this.getPieceValue(square.type);
                    evaluation += square.color === 'w' ? value : -value;
                }
            }
        }

        return evaluation;
    }

    // Minimax with alpha-beta pruning
    minimax(chess, depth, alpha, beta, isMaximizing) {
        if (depth === 0 || chess.isGameOver()) {
            return this.evaluateBoard(chess);
        }

        const moves = chess.moves({ verbose: true });

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of moves) {
                chess.move(move);
                const evaluation = this.minimax(chess, depth - 1, alpha, beta, false);
                chess.undo();
                maxEval = Math.max(maxEval, evaluation);
                alpha = Math.max(alpha, evaluation);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of moves) {
                chess.move(move);
                const evaluation = this.minimax(chess, depth - 1, alpha, beta, true);
                chess.undo();
                minEval = Math.min(minEval, evaluation);
                beta = Math.min(beta, evaluation);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }

    // Get best move for AI
    async getBestMove(fen, difficulty = 10) {
        return new Promise((resolve) => {
            const chess = new Chess(fen);
            const moves = chess.moves({ verbose: true });

            if (moves.length === 0) {
                return resolve(null);
            }

            // Adjust depth based on difficulty (1-20)
            const searchDepth = Math.min(Math.max(Math.floor(difficulty / 4), 1), 5);

            let bestMove = null;
            let bestValue = -Infinity;

            for (const move of moves) {
                chess.move(move);
                const boardValue = -this.minimax(chess, searchDepth - 1, -Infinity, Infinity, false);
                chess.undo();

                if (boardValue > bestValue) {
                    bestValue = boardValue;
                    bestMove = move;
                }
            }

            // Add some randomness for lower difficulties
            if (difficulty < 10 && Math.random() < (10 - difficulty) / 20) {
                bestMove = moves[Math.floor(Math.random() * moves.length)];
            }

            resolve({
                move: bestMove,
                evaluation: bestValue / 100 // Convert to pawns
            });
        });
    }

    // Analyze position
    async analyzePosition(fen) {
        const chess = new Chess(fen);
        const evaluation = this.evaluateBoard(chess);
        const bestMove = await this.getBestMove(fen, 15);

        return {
            evaluation: evaluation / 100, // in pawns
            bestMove: bestMove ? bestMove.move.san : null,
            depth: this.depth,
            fen: fen
        };
    }

    // Get multiple top moves
    async getTopMoves(fen, count = 3) {
        const chess = new Chess(fen);
        const moves = chess.moves({ verbose: true });
        const evaluatedMoves = [];

        for (const move of moves.slice(0, Math.min(moves.length, count * 2))) {
            chess.move(move);
            const evaluation = -this.evaluateBoard(chess);
            chess.undo();

            evaluatedMoves.push({
                move: move.san,
                from: move.from,
                to: move.to,
                evaluation: evaluation / 100
            });
        }

        evaluatedMoves.sort((a, b) => b.evaluation - a.evaluation);

        return evaluatedMoves.slice(0, count);
    }
}

export default new StockfishService();
