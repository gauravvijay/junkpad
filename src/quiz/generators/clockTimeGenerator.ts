import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateClockTimeQuestion(id: number): Question {
  const hour = randInt(1, 12);
  const minuteSlot = randInt(0, 11);
  const minutes = minuteSlot * 5;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const correctAnswer = `${hour}:${formattedMinutes}`;
  return {
    category: "Telling Time",
    id,
    type: "clock-time",
    prompt: "Look at the clock and tell me the time!",
    data: { hour, minutes },
    correctAnswer,
  };
}
