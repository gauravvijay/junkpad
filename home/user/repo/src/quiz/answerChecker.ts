import type { Question } from "./types";

/**
 * Checks whether the user's answer is correct for a given question.
 */
export function checkAnswer(question: Question, userAnswer: unknown): boolean {
  switch (question.type) {
    case "place-value": {
      const correct = question.correctAnswer as Record<string, number>;
      const user = userAnswer as Record<string, number>;
      return Object.keys(correct).every(
        (key) => correct[key] === user[key]
      );
    }

    case "pencil-fraction":
    case "check-calculation":
      return userAnswer === question.correctAnswer;

    case "order-numbers": {
      const correctArr = question.correctAnswer as number[];
      const userArr = userAnswer as number[];
      return (
        correctArr.length === userArr.length &&
        correctArr.every((val, idx) => val === userArr[idx])
      );
    }

    case "sequence":
    case "minecraft-blocks":
    case "trampoline":
    case "division-teams":
    case "dance-video":
    case "number-line":
    case "subtraction":
    case "speed-distance":
      return Number(userAnswer) === Number(question.correctAnswer);

    case "crop-fraction":
      return String(userAnswer).trim() === String(question.correctAnswer).trim();

    case "clock-time": {
      // Normalize both to H:MM
      const normalize = (t: string) => {
        const parts = t.split(":");
        if (parts.length !== 2) return t;
        return `${parseInt(parts[0])}:${parts[1].padStart(2, "0")}`;
      };
      return normalize(String(userAnswer)) === normalize(String(question.correctAnswer));
    }

    case "sudoku": {
      const solution = question.correctAnswer as number[][];
      const userGrid = userAnswer as number[][];
      return solution.every((row, r) =>
        row.every((val, c) => val === userGrid[r][c])
      );
    }

    case "graph-apples": {
      const correct = question.correctAnswer as { perGroup: number; total: number };
      const user = userAnswer as { perGroup: number; total: number };
      return (
        Number(user.perGroup) === correct.perGroup &&
        Number(user.total) === correct.total
      );
    }

    default:
      return String(userAnswer) === String(question.correctAnswer);
  }
}
