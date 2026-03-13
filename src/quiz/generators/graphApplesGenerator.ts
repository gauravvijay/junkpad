import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateGraphApplesQuestion(id: number): Question {
  const numBars = randInt(5, 7);
  const bars: { children: number; apples: number }[] = [];
  for (let i = 0; i < numBars; i++) {
    bars.push({ children: i + 1, apples: randInt(1, 8) });
  }
  const askIndex = randInt(0, numBars - 1);
  const askChildren = bars[askIndex].children;
  const askApples = bars[askIndex].apples;
  const totalApples = bars.reduce((sum, bar) => sum + bar.children * bar.apples, 0);
  return {
    category: "Data & Graphs",
    id,
    type: "graph-apples",
    prompt: "Look at the graph showing how many apples each group of children ate.",
    data: { bars, askChildren, askApples, totalApples },
    correctAnswer: { perGroup: askApples, total: totalApples },
  };
}
