import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePlaceValueQuestion(id: number): Question {
  // Generate 3 numbers, but only pick 5 random place descriptions (not all 9)
  const numbers = [
    randInt(100, 999),
    randInt(100, 999),
    randInt(100, 999),
  ];

  const places = numbers.map((n) => ({
    number: n,
    ones: n % 10,
    tens: Math.floor((n % 100) / 10),
    hundreds: Math.floor(n / 100),
  }));

  // Build all possible match items
  const allItems = places.flatMap((p) => [
    { label: `${p.ones} ones`, belongsTo: p.number },
    { label: `${p.tens} tens`, belongsTo: p.number },
    { label: `${p.hundreds} hundreds`, belongsTo: p.number },
  ]);

  // Shuffle all items
  for (let i = allItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
  }

  // Pick only 5 items
  const matchItems = allItems.slice(0, 5);

  const correctAnswer: Record<string, number> = {};
  matchItems.forEach((item, idx) => {
    correctAnswer[`item_${idx}`] = item.belongsTo;
  });

  return {
    id,
    type: "place-value",
    category: "Place Value",
    prompt: "Match each description to the correct number:",
    data: { numbers, matchItems },
    correctAnswer,
  };
}
