import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateOrderNumbersQuestion(id: number): Question {
  const count = randInt(4, 6);
  const numbers: number[] = [];
  const usedNumbers = new Set<number>();

  while (numbers.length < count) {
    const n = randInt(10, 999);
    if (!usedNumbers.has(n)) {
      usedNumbers.add(n);
      numbers.push(n);
    }
  }

  const sorted = [...numbers].sort((a, b) => a - b);

  // Shuffle the numbers for presentation
  const shuffled = [...numbers];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return {
    id,
    type: "order-numbers",
    prompt: "Order the numbers from smallest to largest. Drag them into the correct order!",
    data: {
      numbers: shuffled,
    },
    correctAnswer: sorted,
  };
}
