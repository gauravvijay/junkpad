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
  { property: "Spain",   rent: 1000, hand: [500, 500],        owner: "Papa"  },
  { property: "Italy",   rent: 1500, hand: [1000, 500, 500],  owner: "Dadi"  },
  { property: "France",  rent: 500,  hand: [1000],            owner: "Dadi"  },
  { property: "Germany", rent: 1000, hand: [1000, 500],       owner: "Papa"  },
  { property: "Brazil",  rent: 1500, hand: [1000, 1000, 500], owner: "Papa"  },
  { property: "Egypt",   rent: 500,  hand: [500, 500],        owner: "Dadi"  },
  { property: "India",   rent: 1000, hand: [500, 500, 500],   owner: "Dadi"  },
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
    // Note-picker: Rent scenario with papa/dadi context
    const r = pick(RENT_SCENARIOS);
    const handDesc = (() => {
      const counts: Record<number, number> = {};
      r.hand.forEach(n => { counts[n] = (counts[n] || 0) + 1; });
      return Object.entries(counts).map(([n, c]) => `${c}×₹${Number(n) >= 1000 ? Number(n)/1000+"K" : n}`).join(", ");
    })();
    return {
      id, type: "monopoly-note-picker", category: "Monopoly Money",
      prompt: `You are playing Business with ${r.owner}! You landed on ${r.property} — ${r.owner} owns it, so you owe ₹${r.rent.toLocaleString()} rent. Select the notes to give from your hand, and pick any change you expect back. (Hand: ${handDesc})`,
      data: { price: r.rent, hand: r.hand, property: r.property, bankNotes: [1000, 500] },
      correctAnswer: r.rent,
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
    prompt: `You want to buy ${scenario.property} for ₹${scenario.price.toLocaleString()}. Select notes from your hand to give the bank, and pick the change you expect back. (Hand: ${handDesc})`,
    data: { price: scenario.price, hand: scenario.hand, property: scenario.property, bankNotes: [10000, 1000, 500] },
    correctAnswer: scenario.price,
  };
}
