import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMinecraftBlocksQuestion(id: number): Question {
  const w = randInt(2, 5);
  const h = randInt(2, 5);
  const d = randInt(2, 5);
  const total = w * h * d;

  return {
    id,
    type: "minecraft-blocks",
    prompt: `You are playing Minecraft! You need to build a castle of ${w}×${h}×${d} blocks. How many total blocks will you need?`,
    data: {
      width: w,
      height: h,
      depth: d,
    },
    correctAnswer: total,
  };
}
