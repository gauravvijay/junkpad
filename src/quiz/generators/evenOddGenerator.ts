import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEvenOddQuestion(id: number): Question {
  const count = randInt(5, 7);
  const numbers: number[] = [];
  for (let i = 0; i < count; i++) { numbers.push(randInt(1, 200)); }
  const askEven = randInt(0, 1) === 0;
  const answer = numbers.filter((n) => askEven ? n % 2 === 0 : n % 2 !== 0).length;

  return {
    id, type: "even-odd", category: "Even & Odd",
    prompt: `Look at these numbers: ${numbers.join(", ")}. How many of them are ${askEven ? "even" : "odd"}?`,
    data: { numbers, askEven },
    correctAnswer: answer,
  };
}
