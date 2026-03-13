import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePencilFractionQuestion(id: number): Question {
  const total = 10;
  const targetBlack = randInt(3, 8); // e.g. 6
  const targetFraction = `${targetBlack}/10`;

  // Create 4 options, one of which is correct
  const correctIndex = randInt(0, 3);
  const options: { blackCount: number; totalCount: number }[] = [];

  const usedCounts = new Set<number>();
  usedCounts.add(targetBlack);

  for (let i = 0; i < 4; i++) {
    if (i === correctIndex) {
      options.push({ blackCount: targetBlack, totalCount: total });
    } else {
      let bc: number;
      do {
        bc = randInt(1, 9);
      } while (usedCounts.has(bc));
      usedCounts.add(bc);
      options.push({ blackCount: bc, totalCount: total });
    }
  }

  return {
    id,
    type: "pencil-fraction",
    prompt: `Which set of pencils has ${targetFraction} black?`,
    data: {
      targetFraction,
      targetBlack,
      total,
      options,
      correctIndex,
    },
    correctAnswer: correctIndex,
  };
}
