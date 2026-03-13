import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMeasurementConvertQuestion(id: number): Question {
  const variant = randInt(0, 3);
  if (variant === 0) {
    const cm = randInt(2, 20);
    return {
      id, type: "measurement-convert", category: "Measurement",
      prompt: `How many millimetres are in ${cm} centimetres?`,
      data: { from: "cm", to: "mm", value: cm },
      correctAnswer: cm * 10,
    };
  } else if (variant === 1) {
    const m = randInt(1, 10);
    return {
      id, type: "measurement-convert", category: "Measurement",
      prompt: `How many centimetres are in ${m} metres?`,
      data: { from: "m", to: "cm", value: m },
      correctAnswer: m * 100,
    };
  } else if (variant === 2) {
    const hours = randInt(1, 5);
    return {
      id, type: "measurement-convert", category: "Measurement",
      prompt: `How many minutes are in ${hours} hour${hours > 1 ? "s" : ""}?`,
      data: { from: "hours", to: "minutes", value: hours },
      correctAnswer: hours * 60,
    };
  } else {
    const kg = randInt(1, 8);
    return {
      id, type: "measurement-convert", category: "Measurement",
      prompt: `How many grams are in ${kg} kilogram${kg > 1 ? "s" : ""}?`,
      data: { from: "kg", to: "g", value: kg },
      correctAnswer: kg * 1000,
    };
  }
}
