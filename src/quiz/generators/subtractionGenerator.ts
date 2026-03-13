import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSubtractionQuestion(id: number): Question {
  const total = randInt(150, 400);
  const girls = randInt(50, total - 20);
  const boys = total - girls;
  return {
    category: "Subtraction",
    id,
    type: "subtraction",
    prompt: `There are ${total} students in a class. ${girls} are girls. How many boys are there?`,
    data: { total, girls },
    correctAnswer: boys,
  };
}
