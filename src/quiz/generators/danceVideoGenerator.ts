import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateDanceVideoQuestion(id: number): Question {
  const videoMinutes = randInt(2, 5);
  const secondsPerStep = randInt(2, 5);
  const totalSeconds = videoMinutes * 60;
  const totalSteps = totalSeconds / secondsPerStep;
  const daysPerStep = 1;
  const totalDays = totalSteps * daysPerStep;
  return {
    category: "Multi-Step Problems",
    id,
    type: "dance-video",
    prompt: `A ${videoMinutes}-minute dance video has steps that each take ${secondsPerStep} seconds. Each step takes 1 day to learn. How many days to learn the full dance?`,
    data: { videoMinutes, secondsPerStep, totalSeconds, totalSteps },
    correctAnswer: totalDays,
  };
}
