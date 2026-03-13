import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRoundingQuestion(id: number): Question {
  const variant = randInt(0, 1);
  if (variant === 0) {
    const num = randInt(11, 999);
    const rounded = Math.round(num / 10) * 10;
    return {
      id, type: "rounding", category: "Rounding",
      prompt: `Round ${num} to the nearest 10.`,
      data: { num, target: 10 },
      correctAnswer: rounded,
    };
  } else {
    const num = randInt(51, 999);
    const rounded = Math.round(num / 100) * 100;
    return {
      id, type: "rounding", category: "Rounding",
      prompt: `Round ${num} to the nearest 100.`,
      data: { num, target: 100 },
      correctAnswer: rounded,
    };
  }
}
