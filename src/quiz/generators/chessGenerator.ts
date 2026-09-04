import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

// ── MCQ scenarios ──────────────────────────────────────────────────────────
interface McqScenario {
  mode: "mcq";
  prompt: string;
  size: number;
  pieces: Array<{ sq: string; piece: string }>;
  attackSquares?: string[];
  safeSquares?: string[];
  highlightSquares?: string[];
  correctOption: string;
  wrongOptions: string[];
}

const MCQ_SCENARIOS: McqScenario[] = [
  {
    mode: "mcq",
    prompt: "Enemy rook ♜ is at C3. Which square is SAFE from the rook?",
    size: 6,
    pieces: [{ sq: "C3", piece: "r" }],
    attackSquares: ["A3","B3","D3","E3","F3","C1","C2","C4","C5","C6"],
    correctOption: "D4",
    wrongOptions: ["D3", "C5", "C1"],
  },
  {
    mode: "mcq",
    prompt: "Enemy rook ♜ is at D4. Which square is SAFE from the rook?",
    size: 6,
    pieces: [{ sq: "D4", piece: "r" }],
    attackSquares: ["A4","B4","C4","E4","F4","D1","D2","D3","D5","D6"],
    correctOption: "B6",
    wrongOptions: ["D1", "A4", "F4"],
  },
  {
    mode: "mcq",
    prompt: "Knight ♞ at D3 moves in an L-shape (2 squares one way, 1 the other). Which square does it NOT reach?",
    size: 6,
    pieces: [{ sq: "D3", piece: "n" }],
    attackSquares: ["C1","E1","B2","F2","B4","F4","C5","E5"],
    correctOption: "D5 — straight up, not an L!",
    wrongOptions: ["E5 — right 1 up 2 ✓", "C1 — left 1 down 2 ✓", "B4 — left 2 up 1 ✓"],
  },
  {
    mode: "mcq",
    prompt: "Your knight ♞ is at C4. Which square can it jump to? (2 one way, 1 the other)",
    size: 6,
    pieces: [{ sq: "C4", piece: "n" }],
    correctOption: "E5 (right 2, up 1)",
    wrongOptions: ["C6 (straight up)", "E4 (straight across)", "C2 (straight down)"],
  },
  {
    mode: "mcq",
    prompt: "Enemy queen ♛ at E5 attacks rows, columns AND diagonals. Where is SAFE?",
    size: 6,
    pieces: [{ sq: "E5", piece: "q" }],
    attackSquares: ["A5","B5","C5","D5","F5","E1","E2","E3","E4","E6","D6","F4","D4","C3","B2","A1","F6"],
    correctOption: "B6",
    wrongOptions: ["D4", "E2", "F5"],
  },
  {
    mode: "mcq",
    prompt: "Your queen ♕ is at A1. Enemy pawn ♟ is at D4. Can your queen capture it in ONE move?",
    size: 6,
    pieces: [{ sq: "A1", piece: "Q" }, { sq: "D4", piece: "p" }],
    correctOption: "Yes — along the diagonal!",
    wrongOptions: ["No — too far away", "No — queens can't go diagonal", "No — something blocks"],
  },
  {
    mode: "mcq",
    prompt: "Knight ♞ at E2. Enemy pawn ♟ at D4. Can the knight capture the pawn in ONE jump?",
    size: 6,
    pieces: [{ sq: "E2", piece: "n" }, { sq: "D4", piece: "p" }],
    correctOption: "Yes! Left 1, up 2 — a perfect L",
    wrongOptions: ["No — too far", "No — knight can't go diagonal", "No — something blocks"],
  },
  {
    mode: "mcq",
    prompt: "Pawn ♙ is at B3. Enemy rook ♜ is at B6. Can the rook capture the pawn?",
    size: 6,
    pieces: [{ sq: "B6", piece: "r" }, { sq: "B3", piece: "P" }],
    attackSquares: ["A6","C6","D6","E6","F6","B1","B2","B4","B5"],
    correctOption: "Yes — same column, rook slides straight down",
    wrongOptions: ["No — too far for a rook", "No — rook can't move down", "No — pawn is safe"],
  },
  // ── Multi-piece scenarios ──────────────────────────────────────────
  {
    mode: "mcq",
    prompt: "Two enemy rooks ♜ are at C2 and E4. Which square is safe from BOTH rooks?",
    size: 6,
    pieces: [{ sq: "C2", piece: "r" }, { sq: "E4", piece: "r" }],
    attackSquares: ["A2","B2","D2","E2","F2","C1","C3","C4","C5","C6",
                    "A4","B4","C4","D4","F4","E1","E2","E3","E5","E6"],
    correctOption: "A3 — not on any rook's row or column",
    wrongOptions: ["C3 — on rook C2's column!", "E3 — on rook E4's column!", "A4 — on rook E4's row!"],
  },
  {
    mode: "mcq",
    prompt: "Enemy rook ♜ at B4 and enemy knight ♞ at D3. Your king ♔ needs to hide. Which square is safe?",
    size: 6,
    pieces: [{ sq: "B4", piece: "r" }, { sq: "D3", piece: "n" }],
    attackSquares: ["A4","C4","D4","E4","F4","B1","B2","B3","B5","B6",
                    "C1","E1","B2","F2","B4","F4","C5","E5"],
    correctOption: "F5 — rook can't reach it, knight can't reach it",
    wrongOptions: ["B5 — on the rook's column!", "E5 — knight at D3 jumps there!", "D4 — on the rook's row!"],
  },
];

// ── Clickable-board scenarios ───────────────────────────────────────────────
interface ClickScenario {
  mode: "clickable";
  prompt: string;
  size: number;
  pieces: Array<{ sq: string; piece: string }>;
  attackSquares?: string[];
  highlightSquares?: string[];
  validAnswers: string[];
  canonicalAnswer: string;
}

const CLICK_SCENARIOS: ClickScenario[] = [
  {
    mode: "clickable",
    prompt: "Enemy rook ♜ is at C3. Tap any SAFE square on the board.",
    size: 6,
    pieces: [{ sq: "C3", piece: "r" }],
    attackSquares: ["A3","B3","D3","E3","F3","C1","C2","C4","C5","C6"],
    validAnswers: ["A1","A2","A4","A5","A6","B1","B2","B4","B5","B6",
                   "D1","D2","D4","D5","D6","E1","E2","E4","E5","E6","F1","F2","F4","F5","F6"],
    canonicalAnswer: "D4",
  },
  {
    mode: "clickable",
    prompt: "Enemy rook ♜ is at D4. Tap any SAFE square on the board.",
    size: 6,
    pieces: [{ sq: "D4", piece: "r" }],
    attackSquares: ["A4","B4","C4","E4","F4","D1","D2","D3","D5","D6"],
    validAnswers: ["A1","A2","A3","A5","A6","B1","B2","B3","B5","B6",
                   "C1","C2","C3","C5","C6","E1","E2","E3","E5","E6","F1","F2","F3","F5","F6"],
    canonicalAnswer: "B6",
  },
  {
    mode: "clickable",
    prompt: "Your knight ♞ is at D3. Tap any square it can jump to (L-shape: 2 one way, 1 the other).",
    size: 6,
    pieces: [{ sq: "D3", piece: "n" }],
    validAnswers: ["C1","E1","B2","F2","B4","F4","C5","E5"],
    canonicalAnswer: "E5",
  },
  {
    mode: "clickable",
    prompt: "Your knight ♞ is at C4. Tap any square it can reach in one jump.",
    size: 6,
    pieces: [{ sq: "C4", piece: "n" }],
    validAnswers: ["A3","A5","B2","B6","D2","D6","E3","E5"],
    canonicalAnswer: "E5",
  },
  {
    mode: "clickable",
    prompt: "Your knight ♞ is at E2. Tap a square it can jump to.",
    size: 6,
    pieces: [{ sq: "E2", piece: "n" }],
    validAnswers: ["C1","C3","D4","F4"],
    canonicalAnswer: "D4",
  },
  {
    mode: "clickable",
    prompt: "Enemy queen ♛ at E5 attacks rows, columns AND diagonals. Tap a SAFE square.",
    size: 6,
    pieces: [{ sq: "E5", piece: "q" }],
    attackSquares: ["A5","B5","C5","D5","F5","E1","E2","E3","E4","E6",
                    "D6","F6","D4","C3","B2","A1","F4"],
    validAnswers: ["B1","C1","D1","F1","A2","C2","D2","F2","A3","B3","D3","F3","A4","B4","C4","A6","B6","C6"],
    canonicalAnswer: "B1",
  },
  {
    mode: "clickable",
    prompt: "Your queen ♕ is at A1. Enemy pawn ♟ is at D4. Tap the pawn to capture it along the diagonal!",
    size: 6,
    pieces: [{ sq: "A1", piece: "Q" }, { sq: "D4", piece: "p" }],
    validAnswers: ["D4"],
    canonicalAnswer: "D4",
  },
  {
    mode: "clickable",
    prompt: "Enemy queen ♛ at C4 attacks rows, columns AND diagonals. Tap a SAFE square.",
    size: 6,
    pieces: [{ sq: "C4", piece: "q" }],
    attackSquares: ["A4","B4","D4","E4","F4","C1","C2","C3","C5","C6",
                    "D5","E6","B5","A6","D3","E2","F1","B3","A2"],
    validAnswers: ["A1","B1","D1","E1","B2","D2","F2","A3","E3","F3","A5","E5","F5","B6","D6","F6"],
    canonicalAnswer: "B6",
  },
  // ── Multi-piece scenarios ──────────────────────────────────────────
  {
    mode: "clickable",
    prompt: "Two enemy rooks ♜ are at C3 and D5. Rooks attack every square on their row and column. Tap a SAFE square.",
    size: 6,
    pieces: [{ sq: "C3", piece: "r" }, { sq: "D5", piece: "r" }],
    attackSquares: ["A3","B3","D3","E3","F3","C1","C2","C4","C5","C6",
                    "A5","B5","E5","F5","D1","D2","D3","D4","D6"],
    validAnswers: ["A1","A2","A4","A6","B1","B2","B4","B6","E1","E2","E4","E6","F1","F2","F4","F6"],
    canonicalAnswer: "A1",
  },
  {
    mode: "clickable",
    prompt: "Two enemy queens ♛ at B2 and E5 attack rows, columns, AND diagonals. Only 8 squares are safe — can you find one?",
    size: 6,
    pieces: [{ sq: "B2", piece: "q" }, { sq: "E5", piece: "q" }],
    attackSquares: ["A1","A2","A3","A5","B1","B3","B4","B5","B6","C1","C2","C3","C5",
                    "D2","D4","D5","D6","E1","E2","E3","E4","E6","F2","F4","F5","F6"],
    validAnswers: ["A4","A6","C4","C6","D1","D3","F1","F3"],
    canonicalAnswer: "A4",
  },
  {
    mode: "clickable",
    prompt: "Enemy rook ♜ at B3 and enemy queen ♛ at E5 are threatening most of the board! Find one of the few safe squares.",
    size: 6,
    pieces: [{ sq: "B3", piece: "r" }, { sq: "E5", piece: "q" }],
    attackSquares: ["A3","C3","D3","E3","F3","B1","B2","B4","B5","B6",
                    "A5","B5","C5","D5","F5","E1","E2","E3","E4","E6",
                    "F6","D6","F4","D4","C3","B2","A1"],
    validAnswers: ["A2","A4","A6","C1","C2","C4","C6","D1","D2","F1","F2"],
    canonicalAnswer: "C4",
  },
];

export function generateChessQuestion(id: number): Question {
  // Randomly pick MCQ or clickable mode
  const useMcq = Math.random() < 0.5;

  if (useMcq) {
    const scenario = pick(MCQ_SCENARIOS);
    const allOptions = shuffle([scenario.correctOption, ...scenario.wrongOptions.slice(0, 3)]);
    const correctIndex = allOptions.indexOf(scenario.correctOption);
    const data: Record<string, unknown> = {
      mode: "mcq",
      size: scenario.size,
      pieces: scenario.pieces,
      attackSquares: scenario.attackSquares ?? [],
      safeSquares: scenario.safeSquares ?? [],
      highlightSquares: scenario.highlightSquares ?? [],
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

  const scenario = pick(CLICK_SCENARIOS);
  const data: Record<string, unknown> = {
    mode: "clickable",
    size: scenario.size,
    pieces: scenario.pieces,
    attackSquares: scenario.attackSquares ?? [],
    highlightSquares: scenario.highlightSquares ?? [],
    validAnswers: scenario.validAnswers,
  };
  return {
    id,
    type: "chess",
    category: "Chess Moves",
    prompt: scenario.prompt,
    data,
    correctAnswer: scenario.canonicalAnswer,
  };
}
