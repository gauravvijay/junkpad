import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSharingEquallyQuestion(id: number): Question {
  const people = randInt(2, 6);
  const each = randInt(3, 12);
  const total = people * each;
  const items = ["sweets", "stickers", "pencils", "apples", "biscuits", "toys"];
  const item = items[randInt(0, items.length - 1)];
  const names = ["Mum", "Dad", "The teacher", "Grandma", "Coach"];
  const who = names[randInt(0, names.length - 1)];

  return {
    id, type: "sharing-equally", category: "Division",
    prompt: `${who} shares ${total} ${item} equally among ${people} children. How many ${item} does each child get?`,
    data: { total, people, item, who },
    correctAnswer: each,
  };
}
