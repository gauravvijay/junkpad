import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateCheckCalculationQuestion(id: number): Question {
  const name = ["Sanjay", "Emma", "Lucas", "Olivia", "Noah", "Lily"][randInt(0, 5)];

  // Pick which operation to present: 0 = multiply, 1 = add, 2 = subtract
  const opType = randInt(0, 2);

  let a: number, b: number, result: number;
  let opSymbol: string;
  let correctOption: string;
  let wrongOptions: string[];

  if (opType === 0) {
    // Multiplication: check with division
    a = randInt(2, 12);
    b = randInt(2, 12);
    result = a * b;
    opSymbol = "\u00d7";
    correctOption = `${result} \u00f7 ${b}`;
    wrongOptions = [
      `${b} \u00d7 ${result}`,
      `${a} \u00d7 ${result}`,
      `${a} \u00f7 ${b}`,
    ];
  } else if (opType === 1) {
    // Addition: check with subtraction
    a = randInt(10, 99);
    b = randInt(10, 99);
    result = a + b;
    opSymbol = "+";
    correctOption = `${result} - ${b}`;
    wrongOptions = [
      `${result} + ${b}`,
      `${a} - ${result}`,
      `${b} - ${a}`,
    ];
  } else {
    // Subtraction: check with addition
    a = randInt(30, 150);
    b = randInt(10, a - 5);
    result = a - b;
    opSymbol = "-";
    correctOption = `${result} + ${b}`;
    wrongOptions = [
      `${result} - ${b}`,
      `${a} + ${result}`,
      `${b} - ${result}`,
    ];
  }

  const allOptions = [correctOption, ...wrongOptions];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }
  const correctIndex = allOptions.indexOf(correctOption);

  return {
    id,
    type: "check-calculation",
    category: "Inverse Operations",
    prompt: `${name} says ${a} ${opSymbol} ${b} = ${result}. Which calculation can ${name} do to check whether this is right?`,
    data: { a, b, result, name, options: allOptions, correctIndex },
    correctAnswer: correctIndex,
  };
}
