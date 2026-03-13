import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateWordProblemMultiplyQuestion(id: number): Question {
  const scenarios = [
    { thing: "stickers", container: "pack", plural: "packs" },
    { thing: "cookies", container: "box", plural: "boxes" },
    { thing: "crayons", container: "pack", plural: "packs" },
    { thing: "marbles", container: "bag", plural: "bags" },
    { thing: "cards", container: "deck", plural: "decks" },
    { thing: "sweets", container: "jar", plural: "jars" },
  ];
  const s = scenarios[randInt(0, scenarios.length - 1)];
  const perContainer = randInt(3, 12);
  const numContainers = randInt(2, 8);
  const total = perContainer * numContainers;
  const names = ["Sophie", "Jack", "Mia", "Ethan", "Lily", "Oscar"];
  const name = names[randInt(0, names.length - 1)];

  return {
    id, type: "word-problem-multiply", category: "Word Problems",
    prompt: `${name} has ${numContainers} ${numContainers === 1 ? s.container : s.plural} of ${s.thing}. Each ${s.container} has ${perContainer} ${s.thing}. How many ${s.thing} does ${name} have in total?`,
    data: { perContainer, numContainers, thing: s.thing, container: s.container, name },
    correctAnswer: total,
  };
}
