import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateNumberLineQuestion(id: number): Question {
  // Keep all numbers positive and under 200
  // leftEnd >= 1, rightEnd <= 199, midpoint = (leftEnd + rightEnd) / 2
  const midpoint = randInt(30, 170);
  // offset must keep leftEnd >= 1 and rightEnd <= 199
  const maxOffset = Math.min(midpoint - 1, 199 - midpoint);
  const offset = randInt(5, Math.min(maxOffset, 60));
  const leftEnd = midpoint - offset;
  const rightEnd = midpoint + offset;

  // Show 3 consecutive numbers near the left end
  const leftShow = [leftEnd, leftEnd + 1, leftEnd + 2];

  // Show 3 consecutive numbers near the right end
  const rightShow = [rightEnd - 2, rightEnd - 1, rightEnd];

  return {
    id,
    type: "number-line",
    category: "Number Line",
    prompt: `On this number line, you see ${leftShow.join(", ")} on the left and ${rightShow.join(", ")} on the right. What is the midpoint?`,
    data: { leftEnd, rightEnd, leftShow, rightShow, midpoint },
    correctAnswer: midpoint,
  };
}
