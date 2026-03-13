import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateComparisonQuestion(id: number): Question {
  const a = randInt(10, 999);
  let b: number;
  do { b = randInt(10, 999); } while (b === a);

  const options = [`${a} > ${b}`, `${a} < ${b}`, `${a} = ${b}`];
  const correctIndex = a > b ? 0 : a < b ? 1 : 2;

  return {
    id, type: "comparison", category: "Comparing Numbers",
    prompt: `Which symbol correctly completes: ${a} ___ ${b}?`,
    data: { a, b, options, correctIndex },
    correctAnswer: correctIndex,
  };
}
