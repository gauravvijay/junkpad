import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateNumberLineQuestion(id: number): Question {
  // Generate a range where the midpoint is a whole number
  // Pick start in hundreds, end small, midpoint will be (start + end) / 2
  const half = randInt(50, 500);
  const offset = randInt(5, 50);
  const start = half + offset;
  const end = half - offset;
  // midpoint = half exactly
  const midpoint = half;

  // Show 3 consecutive numbers near the end to hint at the number line scale
  const endShow = [end - 1, end, end + 1];

  return {
    id,
    type: "number-line",
    prompt: `On this number line, you see ${start} on the left and ${endShow.join(", ")} on the right. What is the midpoint?`,
    data: {
      start,
      end,
      endShow,
      midpoint,
    },
    correctAnswer: midpoint,
  };
}
