import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCheckCalculationQuestion(id: number): Question {
  const a = randInt(2, 12);
  const b = randInt(2, 12);
  const product = a * b;

  const name = ["Sanjay", "Emma", "Lucas", "Olivia", "Noah", "Lily"][randInt(0, 5)];

  // Correct answer: product / b (or product / a)
  const correctOption = `${product} ÷ ${b}`;

  // Build wrong options
  const wrongOptions = [
    `${b} × ${product}`,
    `${a} × ${product}`,
    `${a} ÷ ${b}`,
  ];

  // All options shuffled
  const allOptions = [correctOption, ...wrongOptions];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  const correctIndex = allOptions.indexOf(correctOption);

  return {
    id,
    type: "check-calculation",
    prompt: `${name} says ${a} × ${b} = ${product}. Which calculation can ${name} do to check whether this is right?`,
    data: {
      a,
      b,
      product,
      name,
      options: allOptions,
      correctIndex,
    },
    correctAnswer: correctIndex,
  };
}
