import type { Question } from "./types";

export function checkAnswer(question: Question, userAnswer: unknown): boolean {
  switch (question.type) {
    case "place-value": {
      const correct = question.correctAnswer as Record<string, number>;
      const user = userAnswer as Record<string, number>;
      return Object.keys(correct).every((key) => correct[key] === user[key]);
    }
    case "pencil-fraction":
    case "check-calculation":
    case "comparison":
    case "missing-operator":
      return userAnswer === question.correctAnswer;
    case "order-numbers": {
      const correctArr = question.correctAnswer as number[];
      const userArr = userAnswer as number[];
      return correctArr.length === userArr.length && correctArr.every((val, idx) => val === userArr[idx]);
    }
    case "sequence":
    case "minecraft-blocks":
    case "trampoline":
    case "division-teams":
    case "dance-video":
    case "number-line":
    case "subtraction":
    case "speed-distance":
    case "rounding":
    case "money":
    case "shape-perimeter":
    case "even-odd":
    case "measurement-convert":
    case "double-half":
    case "word-problem-multiply":
    case "sharing-equally":
    case "notes-arithmetic":
    case "catchup-speed":
      return Number(userAnswer) === Number(question.correctAnswer);
    case "monopoly-mcq":
      return userAnswer === question.correctAnswer;
    case "chess": {
      const mode = (question.data as Record<string, unknown>).mode;
      if (mode === "clickable") {
        const validAnswers = (question.data as Record<string, unknown>).validAnswers;
        if (Array.isArray(validAnswers)) {
          return (validAnswers as string[]).includes(String(userAnswer).toUpperCase());
        }
      }
      return userAnswer === question.correctAnswer;
    }
    case "monopoly-note-picker":
      return Number(userAnswer) === Number(question.correctAnswer);
    case "crop-fraction":
      return String(userAnswer).trim() === String(question.correctAnswer).trim();
    case "clock-time": {
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
      return solution.every((row, r) => row.every((val, c) => val === userGrid[r][c]));
    }
    case "graph-apples": {
      const correct = question.correctAnswer as { perGroup: number; total: number };
      const user = userAnswer as { perGroup: number; total: number };
      return Number(user.perGroup) === correct.perGroup && Number(user.total) === correct.total;
    }
    default:
      return String(userAnswer) === String(question.correctAnswer);
  }
}
