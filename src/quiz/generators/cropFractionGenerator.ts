import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCropFractionQuestion(id: number): Question {
  const denominator = [4, 6, 8, 10][randInt(0, 3)];
  const horse1 = randInt(1, Math.floor(denominator / 2) - 1);
  let horse2: number;
  do {
    horse2 = randInt(1, denominator - horse1 - 1);
  } while (horse1 + horse2 >= denominator);
  const remaining = denominator - horse1 - horse2;
  const remainingFraction = `${remaining}/${denominator}`;
  return {
    category: "Fractions",
    id,
    type: "crop-fraction",
    prompt: `A farmer feeds ${horse1}/${denominator} of crop to one horse and ${horse2}/${denominator} to another. How much crop is left? (write as a fraction like ${remaining}/${denominator})`,
    data: { denominator, horse1, horse2, remaining },
    correctAnswer: remainingFraction,
  };
}
