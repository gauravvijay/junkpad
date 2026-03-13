import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMissingOperatorQuestion(id: number): Question {
  const opIdx = randInt(0, 3);
  let a: number, b: number, result: number;

  if (opIdx === 0) {
    a = randInt(5, 50); b = randInt(5, 50); result = a + b;
  } else if (opIdx === 1) {
    b = randInt(5, 30); a = b + randInt(5, 50); result = a - b;
  } else if (opIdx === 2) {
    a = randInt(2, 12); b = randInt(2, 12); result = a * b;
  } else {
    b = randInt(2, 12); a = b * randInt(2, 12); result = a / b;
  }

  const allOptions = ["+", "-", "\u00d7", "\u00f7"];

  return {
    id, type: "missing-operator", category: "Operations",
    prompt: `What goes in the blank?  ${a}  ___  ${b}  =  ${result}`,
    data: { a, b, result, options: allOptions, correctIndex: opIdx },
    correctAnswer: opIdx,
  };
}
