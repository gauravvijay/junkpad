import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateSpeedDistanceQuestion(id: number): Question {
  const metersPerSec = randInt(2, 8);
  // Randomly choose variant: how many meters in X seconds, or how many seconds for Y meters
  const variant = randInt(0, 1);

  if (variant === 0) {
    const seconds = randInt(3, 12);
    const totalMeters = metersPerSec * seconds;
    return {
      id,
      type: "speed-distance",
      prompt: `A girl runs ${metersPerSec} meters in 1 second. How many meters does she run in ${seconds} seconds?`,
      data: {
        metersPerSec,
        seconds,
        variant: "meters",
      },
      correctAnswer: totalMeters,
    };
  } else {
    const seconds = randInt(3, 12);
    const totalMeters = metersPerSec * seconds;
    return {
      id,
      type: "speed-distance",
      prompt: `A girl runs ${metersPerSec} meters in 1 second. How many seconds does it take to run ${totalMeters} meters?`,
      data: {
        metersPerSec,
        totalMeters,
        variant: "seconds",
      },
      correctAnswer: seconds,
    };
  }
}
