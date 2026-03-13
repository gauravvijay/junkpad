import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateTrampolineQuestion(id: number): Question {
  const trampolineHeight = randInt(10, 20) * 10; // 100-200 cm
  const jumpExtra = randInt(15, 40) * 10; // 150-400 cm
  const total = trampolineHeight + jumpExtra;

  const name = ["Alex", "Mia", "Sam", "Zoe", "Leo", "Ava"][randInt(0, 5)];

  return {
    id,
    type: "trampoline",
    prompt: `${name} jumps on a trampoline that is ${trampolineHeight} cm high, and then jumps ${jumpExtra} cm more. How high from the ground did ${name} get?`,
    data: {
      name,
      trampolineHeight,
      jumpExtra,
    },
    correctAnswer: total,
  };
}
