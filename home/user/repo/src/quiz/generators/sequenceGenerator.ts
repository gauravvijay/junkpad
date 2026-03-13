import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSequenceQuestion(id: number): Question {
  const step = randInt(2, 12);
  const start = randInt(1, 10) * step;
  const sequence = [start, start + step, start + 2 * step];
  const answer = start + 3 * step;

  return {
    id,
    type: "sequence",
    prompt: `What is the next number in the sequence?`,
    data: {
      sequence,
      step,
    },
    correctAnswer: answer,
  };
}
