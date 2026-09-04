import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

// Each scenario: find THEIR speed from YOUR speed + times
const FIND_THEIR_SPEED = [
  { them: "Bua and Fufu", tLeave: 8,  uLeave: 9,  uSpeed: 80,  meet: 12 },
  // dist = 3×80=240, theirTime=4, theirSpeed=60
  { them: "Papa",         tLeave: 7,  uLeave: 9,  uSpeed: 60,  meet: 13 },
  // dist = 4×60=240, theirTime=6, theirSpeed=40
  { them: "Nani",         tLeave: 6,  uLeave: 9,  uSpeed: 90,  meet: 12 },
  // dist = 3×90=270, theirTime=6, theirSpeed=45
  { them: "your friend",  tLeave: 8,  uLeave: 10, uSpeed: 100, meet: 12 },
  // dist = 2×100=200, theirTime=4, theirSpeed=50
  { them: "Dadi",         tLeave: 7,  uLeave: 10, uSpeed: 70,  meet: 13 },
  // dist = 3×70=210, theirTime=6, theirSpeed=35
  { them: "Fufu",         tLeave: 6,  uLeave: 10, uSpeed: 80,  meet: 14 },
  // dist = 4×80=320, theirTime=8, theirSpeed=40
];

// Each scenario: find YOUR speed to catch up
const FIND_YOUR_SPEED = [
  { them: "Bua",   tLeave: 8, tSpeed: 60, uLeave: 9,  meet: 12 },
  // dist=4×60=240, yourTime=3, yourSpeed=80
  { them: "Fufu",  tLeave: 7, tSpeed: 40, uLeave: 9,  meet: 13 },
  // dist=6×40=240, yourTime=4, yourSpeed=60
  { them: "Nani",  tLeave: 6, tSpeed: 45, uLeave: 9,  meet: 12 },
  // dist=6×45=270, yourTime=3, yourSpeed=90
  { them: "Papa",  tLeave: 8, tSpeed: 50, uLeave: 10, meet: 12 },
  // dist=4×50=200, yourTime=2, yourSpeed=100
  { them: "Dadi",  tLeave: 6, tSpeed: 35, uLeave: 10, meet: 13 },
  // dist=7×35=245, yourTime=3, yourSpeed≈81.7 -- skip (not integer)
];

function timeStr(h: number): string {
  if (h === 12) return "12:00 noon";
  if (h > 12) return `${h - 12}:00 pm`;
  return `${h}:00 am`;
}

export function generateCatchUpSpeedQuestion(id: number): Question {
  const findTheirs = randInt(0, 1) === 0;

  if (findTheirs) {
    const s = pick(FIND_THEIR_SPEED);
    const uTime = s.meet - s.uLeave;
    const tTime = s.meet - s.tLeave;
    const dist = uTime * s.uSpeed;
    const theirSpeed = dist / tTime;
    const cap = s.them.charAt(0).toUpperCase() + s.them.slice(1);
    return {
      id, type: "catchup-speed", category: "Speed & Distance",
      prompt: `${cap} left at ${timeStr(s.tLeave)}. You left at ${timeStr(s.uLeave)} travelling at ${s.uSpeed} km/h. You caught up to ${s.them} exactly at ${timeStr(s.meet)}. What was ${s.them}'s speed in km/h?`,
      data: { them: s.them, tLeave: s.tLeave, uLeave: s.uLeave, uSpeed: s.uSpeed, meet: s.meet, uTime, tTime, dist, answer: theirSpeed },
      correctAnswer: theirSpeed,
    };
  } else {
    const valid = FIND_YOUR_SPEED.filter(s => {
      const tTime = s.meet - s.tLeave;
      const uTime = s.meet - s.uLeave;
      const dist = tTime * s.tSpeed;
      return Number.isInteger(dist / uTime);
    });
    const s = pick(valid);
    const tTime = s.meet - s.tLeave;
    const uTime = s.meet - s.uLeave;
    const dist = tTime * s.tSpeed;
    const yourSpeed = dist / uTime;
    return {
      id, type: "catchup-speed", category: "Speed & Distance",
      prompt: `${s.them} left at ${timeStr(s.tLeave)} at ${s.tSpeed} km/h. You left at ${timeStr(s.uLeave)}. You want to catch up to ${s.them} by ${timeStr(s.meet)}. How fast (km/h) must you travel?`,
      data: { them: s.them, tLeave: s.tLeave, tSpeed: s.tSpeed, uLeave: s.uLeave, meet: s.meet, tTime, uTime, dist, answer: yourSpeed },
      correctAnswer: yourSpeed,
    };
  }
}
