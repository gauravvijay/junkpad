import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMoneyQuestion(id: number): Question {
  const variant = randInt(0, 2);
  const names = ["Emma", "Liam", "Zara", "Noah", "Ava", "Kai"];
  const name = names[randInt(0, names.length - 1)];
  const items = ["toy", "book", "candy bar", "sticker pack", "pencil case", "water bottle"];

  if (variant === 0) {
    const price = randInt(1, 9) * 10 + randInt(0, 9);
    const paidAmount = Math.max(Math.ceil(price / 50) * 50 + 50, price + randInt(1, 20));
    const change = paidAmount - price;
    const item = items[randInt(0, items.length - 1)];
    return {
      id, type: "money", category: "Money",
      prompt: `${name} buys a ${item} that costs ${price}p. ${name} pays with ${paidAmount}p. How much change does ${name} get?`,
      data: { price, paid: paidAmount, item, name },
      correctAnswer: change,
    };
  } else if (variant === 1) {
    const price1 = randInt(10, 50);
    const price2 = randInt(10, 50);
    const item1 = items[randInt(0, 2)];
    const item2 = items[randInt(3, 5)];
    const total = price1 + price2;
    return {
      id, type: "money", category: "Money",
      prompt: `${name} buys a ${item1} for ${price1}p and a ${item2} for ${price2}p. How much did ${name} spend in total?`,
      data: { price1, price2, item1, item2, name },
      correctAnswer: total,
    };
  } else {
    const unitPrice = randInt(2, 10);
    const budget = unitPrice * randInt(3, 8);
    const count = budget / unitPrice;
    const item = items[randInt(0, items.length - 1)];
    return {
      id, type: "money", category: "Money",
      prompt: `Each ${item} costs ${unitPrice}p. ${name} has ${budget}p. How many can ${name} buy?`,
      data: { unitPrice, budget, item, name },
      correctAnswer: count,
    };
  }
}
