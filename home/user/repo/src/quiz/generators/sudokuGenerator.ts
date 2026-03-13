import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a 3x3 grid where each row and each column sums to `targetSum`.
 * We use a magic-square-like approach:
 * Pick values so rows/cols sum correctly.
 */
function generateValidGrid(targetSum: number): number[][] {
  // Strategy: pick a, b for first row as [a, b, targetSum - a - b]
  // Then build the rest so columns also sum to targetSum
  // All values must be positive
  let grid: number[][] = [];
  let valid = false;

  while (!valid) {
    const a = randInt(5, targetSum - 20);
    const b = randInt(5, targetSum - a - 5);
    const c = targetSum - a - b;
    if (c <= 0) continue;

    const d = randInt(5, targetSum - 10);
    const e = randInt(5, targetSum - d - 5);
    const f = targetSum - d - e;
    if (f <= 0) continue;

    // Third row determined by column sums
    const g = targetSum - a - d;
    const h = targetSum - b - e;
    const i = targetSum - c - f;

    if (g > 0 && h > 0 && i > 0 && g + h + i === targetSum) {
      grid = [
        [a, b, c],
        [d, e, f],
        [g, h, i],
      ];
      // Check all distinct (nicer puzzle)
      const flat = grid.flat();
      const unique = new Set(flat);
      if (unique.size === 9) {
        valid = true;
      }
    }
  }
  return grid;
}

export function generateSudokuQuestion(id: number): Question {
  const targetSum = [60, 75, 90, 100, 120][randInt(0, 4)];
  const solution = generateValidGrid(targetSum);

  // Create puzzle by removing exactly 3 cells
  const puzzle = solution.map((row) => [...row]);
  const gaps: [number, number][] = [];
  const positions: [number, number][] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      positions.push([r, c]);
    }
  }

  // Shuffle and pick 3
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  for (let k = 0; k < 3; k++) {
    const [r, c] = positions[k];
    gaps.push([r, c]);
    puzzle[r][c] = 0; // 0 means blank
  }

  return {
    id,
    type: "sudoku",
    prompt: `Fill in the blanks so that each row AND each column adds up to ${targetSum}.`,
    data: {
      targetSum,
      puzzle,
      gaps,
    },
    correctAnswer: solution,
  };
}
