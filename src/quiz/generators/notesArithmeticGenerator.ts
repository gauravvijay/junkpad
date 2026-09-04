import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function generateNotesArithmeticQuestion(id: number): Question {
  const variant = randInt(0, 2);

  if (variant === 0) {
    // "You only have X-rupee notes. You need to pay Y. How many notes?"
    const scenarios = [
      { denom: 50,   total: 350,  ans: 7  },
      { denom: 50,   total: 1350, ans: 27 },
      { denom: 100,  total: 700,  ans: 7  },
      { denom: 100,  total: 1300, ans: 13 },
      { denom: 200,  total: 1400, ans: 7  },
      { denom: 200,  total: 1800, ans: 9  },
      { denom: 500,  total: 3500, ans: 7  },
      { denom: 500,  total: 4500, ans: 9  },
      { denom: 1000, total: 8000, ans: 8  },
      { denom: 1000, total: 6000, ans: 6  },
    ];
    const s = pick(scenarios);
    return {
      id, type: "notes-arithmetic", category: "Notes & Money",
      prompt: `You only have ₹${s.denom} notes. You need to pay ₹${s.total.toLocaleString()}. How many notes must you give?`,
      data: { denom: s.denom, total: s.total },
      correctAnswer: s.ans,
    };
  }

  if (variant === 1) {
    // "You have N notes of X (= Y total). You need to pay Z. How much more do you need?"
    const scenarios = [
      { n: 5, denom: 1000, pay: 7500, more: 2500 },
      { n: 3, denom: 1000, pay: 4500, more: 1500 },
      { n: 4, denom: 500,  pay: 3500, more: 1500 },
      { n: 7, denom: 1000, pay: 9500, more: 2500 },
      { n: 2, denom: 1000, pay: 3000, more: 1000 },
      { n: 6, denom: 500,  pay: 4500, more: 1500 },
      { n: 3, denom: 500,  pay: 2500, more: 1000 },
    ];
    const s = pick(scenarios);
    const have = s.n * s.denom;
    return {
      id, type: "notes-arithmetic", category: "Notes & Money",
      prompt: `You have ${s.n} notes of ₹${s.denom.toLocaleString()}. You need to pay ₹${s.pay.toLocaleString()}. How much MORE money do you need?`,
      data: { n: s.n, denom: s.denom, have, pay: s.pay },
      correctAnswer: s.more,
    };
  }

  // variant === 2: Two-step (multiply then subtract from note)
  const scenarios = [
    { unitPrice: 50,  count: 4, payNote: 500,  change: 300, item: "sticker packet" },
    { unitPrice: 150, count: 3, payNote: 1000, change: 550, item: "ticket"         },
    { unitPrice: 25,  count: 6, payNote: 200,  change: 50,  item: "pencil"         },
    { unitPrice: 30,  count: 5, payNote: 500,  change: 350, item: "chocolate"      },
    { unitPrice: 75,  count: 4, payNote: 500,  change: 200, item: "eraser set"     },
    { unitPrice: 100, count: 7, payNote: 1000, change: 300, item: "crayon"         },
    { unitPrice: 200, count: 3, payNote: 1000, change: 400, item: "notebook"       },
  ];
  const s = pick(scenarios);
  return {
    id, type: "notes-arithmetic", category: "Notes & Money",
    prompt: `Each ${s.item} costs ₹${s.unitPrice}. You buy ${s.count} of them and pay with a ₹${s.payNote.toLocaleString()} note. What is your change?`,
    data: { unitPrice: s.unitPrice, count: s.count, payNote: s.payNote, item: s.item },
    correctAnswer: s.change,
  };
}
