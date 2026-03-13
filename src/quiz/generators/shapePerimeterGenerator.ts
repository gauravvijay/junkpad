import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateShapePerimeterQuestion(id: number): Question {
  const variant = randInt(0, 2);
  if (variant === 0) {
    const side = randInt(3, 15);
    return {
      id, type: "shape-perimeter", category: "Geometry",
      prompt: `A square has sides of ${side} cm. What is its perimeter?`,
      data: { shape: "square", side, perimeter: 4 * side },
      correctAnswer: 4 * side,
    };
  } else if (variant === 1) {
    const w = randInt(3, 12);
    const h = randInt(3, 12);
    return {
      id, type: "shape-perimeter", category: "Geometry",
      prompt: `A rectangle is ${w} cm wide and ${h} cm tall. What is its perimeter?`,
      data: { shape: "rectangle", width: w, height: h, perimeter: 2 * (w + h) },
      correctAnswer: 2 * (w + h),
    };
  } else {
    const side = randInt(3, 15);
    return {
      id, type: "shape-perimeter", category: "Geometry",
      prompt: `An equilateral triangle has sides of ${side} cm. What is its perimeter?`,
      data: { shape: "triangle", side, perimeter: 3 * side },
      correctAnswer: 3 * side,
    };
  }
}
