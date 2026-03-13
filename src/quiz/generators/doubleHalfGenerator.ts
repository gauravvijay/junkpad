import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDoubleHalfQuestion(id: number): Question {
  const variant = randInt(0, 1);
  if (variant === 0) {
    const num = randInt(5, 250);
    return {
      id, type: "double-half", category: "Doubling & Halving",
      prompt: `What is double ${num}?`,
      data: { num, operation: "double" },
      correctAnswer: num * 2,
    };
  } else {
    const num = randInt(4, 250) * 2;
    return {
      id, type: "double-half", category: "Doubling & Halving",
      prompt: `What is half of ${num}?`,
      data: { num, operation: "half" },
      correctAnswer: num / 2,
    };
  }
}
