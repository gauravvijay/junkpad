import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

const PROPERTIES = [
  { name: "Spain",   price: 4500 },
  { name: "Italy",   price: 6000 },
  { name: "USA",     price: 8500 },
  { name: "France",  price: 3000 },
  { name: "Germany", price: 7000 },
  { name: "India",   price: 2500 },
  { name: "Brazil",  price: 5500 },
  { name: "Egypt",   price: 3500 },
  { name: "Japan",   price: 9500 },
];

const RENT_SCENARIOS = [
  { property: "Spain",   rent: 1000, hand: [500, 500],       give: "2 × ₹500 = ₹1,000" },
  { property: "Italy",   rent: 1500, hand: [1000, 500, 500], give: "₹1,000 + ₹500 = ₹1,500" },
  { property: "France",  rent: 500,  hand: [1000],           give: "₹1,000 (get ₹500 change)" },
  { property: "Germany", rent: 1000, hand: [1000, 500],      give: "₹1,000 note exactly" },
  { property: "Brazil",  rent: 1500, hand: [1000, 1000, 500], give: "₹1,000 + ₹500 = ₹1,500" },
];

const NOTE_PICKER_SCENARIOS = [
  { property: "Egypt",  price: 3500, hand: [10000, 1000, 1000, 500] },
  { property: "Brazil", price: 5500, hand: [10000, 1000, 500, 500]  },
  { property: "Japan",  price: 9500, hand: [10000, 500]             },
  { property: "Spain",  price: 4500, hand: [1000, 1000, 1000, 1000, 500, 500] },
  { property: "France", price: 3000, hand: [1000, 1000, 1000, 500]  },
  { property: "Germany",price: 7000, hand: [10000, 1000, 500]       },
];

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function makeMCQOptions(correct: string, wrongs: string[]): { options: string[]; correctIndex: number } {
  const all = shuffle([correct, ...wrongs.slice(0, 3)]);
  return { options: all, correctIndex: all.indexOf(correct) };
}

export function generateMonopolyQuestion(id: number): Question {
  const variant = randInt(0, 3);

  if (variant === 0) {
    // MCQ: How much change from ₹10,000?
    const p = pick(PROPERTIES.filter(x => x.price < 10000));
    const change = 10000 - p.price;
    const fmt = (n: number) => `₹${n.toLocaleString()}`;
    const wrongs = [change + 500, change - 500, change + 1000].map(fmt);
    const { options, correctIndex } = makeMCQOptions(fmt(change), wrongs);
    return {
      id, type: "monopoly-mcq", category: "Monopoly Money",
      prompt: `You buy ${p.name} for ₹${p.price.toLocaleString()}. You give the bank a ₹10,000 note. How much change do you get back?`,
      data: { options, correctIndex },
      correctAnswer: correctIndex,
    };
  }

  if (variant === 1) {
    // MCQ: How many ₹1,000 notes to pay exactly?
    const choices = [
      { name: "France", price: 3000, count: 3 },
      { name: "Germany", price: 7000, count: 7 },
      { name: "Italy", price: 5000, count: 5 },
      { name: "Brazil", price: 6000, count: 6 },
    ];
    const p = pick(choices);
    const wrongs = [p.count - 1, p.count + 1, p.count + 2].map(n => `${n} notes`);
    const { options, correctIndex } = makeMCQOptions(`${p.count} notes`, wrongs);
    return {
      id, type: "monopoly-mcq", category: "Monopoly Money",
      prompt: `${p.name} costs ₹${p.price.toLocaleString()}. How many ₹1,000 notes do you need to pay exactly?`,
      data: { options, correctIndex },
      correctAnswer: correctIndex,
    };
  }

  if (variant === 2) {
    // MCQ: Rent scenario
    const r = pick(RENT_SCENARIOS);
    const fmt = (n: number) => `₹${n.toLocaleString()}`;
    const wrongOpts = [`${fmt(r.rent + 500)} (too much)`, `${fmt(r.rent - 500)} (too little)`, "Nothing — rent is optional!"];
    const { options, correctIndex } = makeMCQOptions(r.give, wrongOpts);
    return {
      id, type: "monopoly-mcq", category: "Monopoly Money",
      prompt: `You land on ${r.property}. Rent is ${fmt(r.rent)}. You have: ${r.hand.map(n => fmt(n)).join(", ")}. What do you pay?`,
      data: { options, correctIndex },
      correctAnswer: correctIndex,
    };
  }

  // variant === 3: Interactive note picker
  const scenario = pick(NOTE_PICKER_SCENARIOS);
  const handDesc = (() => {
    const counts: Record<number, number> = {};
    scenario.hand.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
    return Object.entries(counts).map(([n, c]) => `${c}×₹${Number(n) >= 1000 ? Number(n) / 1000 + "K" : n}`).join(", ");
  })();
  return {
    id, type: "monopoly-note-picker", category: "Monopoly Money",
    prompt: `You want to buy ${scenario.property} for ₹${scenario.price.toLocaleString()}. Tap notes from your hand to give the bank. (Hand: ${handDesc})`,
    data: { price: scenario.price, hand: scenario.hand, property: scenario.property },
    correctAnswer: scenario.price,
  };
}
