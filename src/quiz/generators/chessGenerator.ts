import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

interface ChessBoardData {
  size: number;
  pieces: Array<{ sq: string; piece: string }>;
  attackSquares?: string[];
  safeSquares?: string[];
  highlightSquares?: string[];
  options: string[];
  correctIndex: number;
}

interface ChessScenario {
  prompt: string;
  board: Omit<ChessBoardData, "options" | "correctIndex">;
  correctOption: string;
  wrongOptions: string[];
}

const SCENARIOS: ChessScenario[] = [
  // --- ROOK SAFETY ---
  {
    prompt: "Enemy rook ♜ is at C3. Red squares are under attack. Which square is SAFE from the rook?",
    board: {
      size: 6,
      pieces: [{ sq: "C3", piece: "r" }],
      attackSquares: ["A3","B3","D3","E3","F3","C1","C2","C4","C5","C6"],
    },
    correctOption: "D4",
    wrongOptions: ["D3", "C5", "C1"],
  },
  {
    prompt: "Enemy rook ♜ is at D4. Red squares are dangerous. Which square is SAFE?",
    board: {
      size: 6,
      pieces: [{ sq: "D4", piece: "r" }],
      attackSquares: ["A4","B4","C4","E4","F4","D1","D2","D3","D5","D6"],
    },
    correctOption: "B6",
    wrongOptions: ["D1", "A4", "F4"],
  },
  {
    prompt: "Rook ♜ is at B2. Which TWO squares are both safe from it?",
    board: {
      size: 6,
      pieces: [{ sq: "B2", piece: "r" }],
      attackSquares: ["A2","C2","D2","E2","F2","B1","B3","B4","B5","B6"],
    },
    correctOption: "C3 and D5",
    wrongOptions: ["B5 and C2", "A2 and D2", "E2 and B4"],
  },

  // --- KNIGHT MOVES ---
  {
    prompt: "Knight ♞ at D3 attacks the red squares (L-shaped jumps). Which square does it NOT attack?",
    board: {
      size: 6,
      pieces: [{ sq: "D3", piece: "n" }],
      attackSquares: ["C1","E1","B2","F2","B4","F4","C5","E5"],
    },
    correctOption: "D5 — straight up, not an L!",
    wrongOptions: ["E5 — right 1 up 2 ✓", "C1 — left 1 down 2 ✓", "B4 — left 2 up 1 ✓"],
  },
  {
    prompt: "Your knight ♞ is at C4. Which square can it jump to? (2 squares one way, 1 the other)",
    board: {
      size: 6,
      pieces: [{ sq: "C4", piece: "n" }],
    },
    correctOption: "E5 (right 2, up 1)",
    wrongOptions: ["C6 (straight up)", "E4 (straight across)", "C2 (straight down)"],
  },
  {
    prompt: "Knight ♞ at E2. Enemy pawn ♟ is at D4. Can the knight capture the pawn in ONE jump?",
    board: {
      size: 6,
      pieces: [{ sq: "E2", piece: "n" }, { sq: "D4", piece: "p" }],
    },
    correctOption: "Yes! Left 1, up 2 — a perfect L",
    wrongOptions: ["No — too far", "No — knight can't go diagonal", "No — something is blocking"],
  },

  // --- QUEEN SAFETY & ATTACKS ---
  {
    prompt: "Enemy queen ♛ at E5 attacks rows, columns AND diagonals (red). Where is a SAFE square?",
    board: {
      size: 6,
      pieces: [{ sq: "E5", piece: "q" }],
      attackSquares: ["A5","B5","C5","D5","F5","E1","E2","E3","E4","E6","D6","F4","D4","C3","B2","A1","F6"],
    },
    correctOption: "B6",
    wrongOptions: ["D4", "E2", "F5"],
  },
  {
    prompt: "Your queen ♕ is at A1. Enemy pawn ♟ is at D4. Can your queen capture it in ONE move?",
    board: {
      size: 6,
      pieces: [{ sq: "A1", piece: "Q" }, { sq: "D4", piece: "p" }],
    },
    correctOption: "Yes — along the diagonal!",
    wrongOptions: ["No — too far away", "No — queens can't go diagonal", "No — something blocks the path"],
  },
  {
    prompt: "Your pawn ♙ is at B2. It moves forward 1 step to B3. Can the enemy rook ♜ at B6 capture it?",
    board: {
      size: 6,
      pieces: [{ sq: "B6", piece: "r" }, { sq: "B3", piece: "P" }],
      attackSquares: ["A6","C6","D6","E6","F6","B1","B2","B4","B5"],
    },
    correctOption: "Yes — same column, rook slides straight down",
    wrongOptions: ["No — too far for a rook", "No — rook can't move down", "No — pawn is safe from rooks"],
  },
];

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

export function generateChessQuestion(id: number): Question {
  const scenario = pick(SCENARIOS);
  const allOptions = shuffle([scenario.correctOption, ...scenario.wrongOptions.slice(0, 3)]);
  const correctIndex = allOptions.indexOf(scenario.correctOption);

  const data: Record<string, unknown> = {
    ...scenario.board,
    options: allOptions,
    correctIndex,
  };

  return {
    id,
    type: "chess",
    category: "Chess Moves",
    prompt: scenario.prompt,
    data,
    correctAnswer: correctIndex,
  };
}
