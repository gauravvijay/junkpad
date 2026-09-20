import type { Question } from "../types";

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatTime12(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;
  const ampm = h24 >= 12 ? "pm" : "am";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateTimeArithmeticQuestion(id: number): Question {
  const startH = randInt(1, 12);
  const minuteChoices = [0, 15, 30, 45, 10, 20, 25, 40, 50];
  const startM = minuteChoices[randInt(0, minuteChoices.length - 1)];
  const startAmPm = Math.random() > 0.5 ? "am" : "pm";

  const addHours = randInt(1, 7);
  const addMinuteChoices = [0, 15, 30, 45, 20, 40];
  const addMinutes = addMinuteChoices[randInt(0, addMinuteChoices.length - 1)];

  const startH24 = (startH % 12) + (startAmPm === "pm" ? 12 : 0);
  const startTotalMin = startH24 * 60 + startM;
  const durationMin = addHours * 60 + addMinutes;
  const correctTotalMin = startTotalMin + durationMin;
  const correctAnswerStr = formatTime12(correctTotalMin);

  // Build duration phrasing
  let durationPhrase = `${addHours} hour${addHours > 1 ? "s" : ""}`;
  if (addMinutes > 0) {
    durationPhrase += ` and ${addMinutes} minutes`;
  }

  const startTimeStr = `${startH}:${startM.toString().padStart(2, "0")} ${startAmPm}`;
  const prompt = `The clock shows the time right now (${startAmPm.toUpperCase()}). What time will it be in ${durationPhrase}?`;

  // Distractors based on typical childhood math pitfalls:
  const distractorsSet = new Set<string>();

  // 1. Off-by-one counting error (fencepost): kid starts counting from start time (e.g. 3, 4, 5, 6 instead of 7)
  distractorsSet.add(formatTime12(correctTotalMin - 60));

  // 2. Overshoot off-by-one: kid counts 1 hour too many
  distractorsSet.add(formatTime12(correctTotalMin + 60));

  // 3. AM/PM flip: correct time of day mistaken or forgotten meridiem
  distractorsSet.add(formatTime12(correctTotalMin + 720));

  // 4. Minute rollover without carrying hour (base-100 decimal fallacy)
  if (startM + addMinutes >= 60) {
    // Forgot to add the carried hour to the clock
    distractorsSet.add(formatTime12(correctTotalMin - 60));
    // Subtracted 100 instead of 60 for minutes or stayed in same hour
    const uncarriedH = formatTime12(startTotalMin + addHours * 60 + ((startM + addMinutes) % 60));
    distractorsSet.add(uncarriedH);
  } else {
    // Off by 15 or 30 minutes
    distractorsSet.add(formatTime12(correctTotalMin + 30));
  }

  // Ensure distractors do not contain correct answer
  distractorsSet.delete(correctAnswerStr);

  // Guarantee exactly 3 unique distractors (4 choices total)
  let fallbackOffset = 15;
  while (distractorsSet.size < 3) {
    const candidate = formatTime12(correctTotalMin + fallbackOffset);
    if (candidate !== correctAnswerStr) {
      distractorsSet.add(candidate);
    }
    fallbackOffset += 15;
  }

  const distractorList = Array.from(distractorsSet).slice(0, 3);
  const options = shuffle([correctAnswerStr, ...distractorList]);
  const correctIndex = options.indexOf(correctAnswerStr);

  return {
    id,
    type: "time-arithmetic",
    category: "Time & Measurement",
    prompt,
    data: {
      hour: startH,
      minutes: startM,
      ampm: startAmPm,
      options,
      correctIndex,
      startTime: startTimeStr,
      duration: durationPhrase,
    },
    correctAnswer: correctIndex,
  };
}
