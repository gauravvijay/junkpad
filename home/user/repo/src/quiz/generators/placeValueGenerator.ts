import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePlaceValueQuestion(id: number): Question {
  const numbers = [
    randInt(100, 999),
    randInt(100, 999),
    randInt(100, 999),
  ];

  // For each number extract ones, tens, hundreds
  const places = numbers.map((n) => ({
    number: n,
    ones: n % 10,
    tens: Math.floor((n % 100) / 10),
    hundreds: Math.floor(n / 100),
  }));

  // Build match pairs: shuffle descriptions
  const matchItems = places.flatMap((p) => [
    { label: `${p.ones} ones`, belongsTo: p.number },
    { label: `${p.tens} tens`, belongsTo: p.number },
    { label: `${p.hundreds} hundreds`, belongsTo: p.number },
  ]);

  // Shuffle matchItems
  for (let i = matchItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matchItems[i], matchItems[j]] = [matchItems[j], matchItems[i]];
  }

  const correctAnswer: Record<string, number> = {};
  matchItems.forEach((item, idx) => {
    correctAnswer[`item_${idx}`] = item.belongsTo;
  });

  return {
    id,
    type: "place-value",
    prompt: "Match each description to the correct number:",
    data: {
      numbers,
      matchItems,
    },
    correctAnswer,
  };
}
