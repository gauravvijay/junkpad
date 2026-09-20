import { describe, it, expect } from "vitest";
import { generateTimeArithmeticQuestion, formatTime12 } from "../generators/timeArithmeticGenerator";
import { generateElapsedTimeQuestion, formatDuration } from "../generators/elapsedTimeGenerator";
import { checkAnswer } from "../answerChecker";
import { TOPIC_REGISTRY } from "../generators/registry";
import { generateAllQuestions } from "../generators";

describe("Time Arithmetic & Elapsed Time Question Generators", () => {
  describe("timeArithmeticGenerator", () => {
    it("should format 12-hour times correctly with AM/PM and no 0:xx", () => {
      expect(formatTime12(0)).toBe("12:00 am"); // midnight
      expect(formatTime12(60)).toBe("1:00 am");
      expect(formatTime12(12 * 60)).toBe("12:00 pm"); // noon
      expect(formatTime12(12 * 60 + 30)).toBe("12:30 pm");
      expect(formatTime12(13 * 60)).toBe("1:00 pm");
      expect(formatTime12(23 * 60 + 45)).toBe("11:45 pm");
    });

    it("should produce a valid question with 4 unique options and correct answer index", () => {
      for (let i = 1; i <= 30; i++) {
        const q = generateTimeArithmeticQuestion(i);
        expect(q.id).toBe(i);
        expect(q.type).toBe("time-arithmetic");
        expect(q.category).toBe("Time & Measurement");

        const { options, correctIndex } = q.data as { options: string[]; correctIndex: number };
        expect(options.length).toBe(4);
        expect(new Set(options).size).toBe(4); // No duplicate choices!
        expect(correctIndex).toBeGreaterThanOrEqual(0);
        expect(correctIndex).toBeLessThan(4);
        expect(q.correctAnswer).toBe(correctIndex);

        // Verify all options match 12-hour time format
        for (const opt of options) {
          expect(opt).toMatch(/^(1[0-2]|[1-9]):[0-5][0-9] (am|pm)$/);
        }

        // Answer checker verification
        expect(checkAnswer(q, correctIndex)).toBe(true);
        expect(checkAnswer(q, (correctIndex + 1) % 4)).toBe(false);
      }
    });
  });

  describe("elapsedTimeGenerator", () => {
    it("should format duration correctly", () => {
      expect(formatDuration(5, 30)).toBe("5 hours 30 minutes");
      expect(formatDuration(1, 15)).toBe("1 hour 15 minutes");
      expect(formatDuration(4, 0)).toBe("4 hours");
      expect(formatDuration(0, 45)).toBe("45 minutes");
      expect(formatDuration(1, 0)).toBe("1 hour");
    });

    it("should produce valid elapsed time questions with 4 unique options and correct answer index", () => {
      for (let i = 1; i <= 30; i++) {
        const q = generateElapsedTimeQuestion(i);
        expect(q.id).toBe(i);
        expect(q.type).toBe("elapsed-time");
        expect(q.category).toBe("Time & Measurement");

        const { options, correctIndex } = q.data as { options: string[]; correctIndex: number };
        expect(options.length).toBe(4);
        expect(new Set(options).size).toBe(4); // No duplicate choices!
        expect(correctIndex).toBeGreaterThanOrEqual(0);
        expect(correctIndex).toBeLessThan(4);
        expect(q.correctAnswer).toBe(correctIndex);

        // Verify options match expected duration format
        for (const opt of options) {
          expect(opt).toMatch(/^(\d+ hours?)( \d+ minutes?)?$|^\d+ minutes?$/);
        }

        // Answer checker verification
        expect(checkAnswer(q, correctIndex)).toBe(true);
        expect(checkAnswer(q, (correctIndex + 1) % 4)).toBe(false);
      }
    });
  });

  describe("Registry and Generator Integration", () => {
    it("should register both generators in TOPIC_REGISTRY under Time & Measurement", () => {
      const topicIds = TOPIC_REGISTRY.map((t) => t.id);
      expect(topicIds).toContain("time-arithmetic");
      expect(topicIds).toContain("elapsed-time");

      const timeArith = TOPIC_REGISTRY.find((t) => t.id === "time-arithmetic")!;
      expect(timeArith.category).toBe("Time & Measurement");
      expect(timeArith.label).toBe("Time Arithmetic");

      const elapsedTime = TOPIC_REGISTRY.find((t) => t.id === "elapsed-time")!;
      expect(elapsedTime.category).toBe("Time & Measurement");
      expect(elapsedTime.label).toBe("Elapsed Time");
    });

    it("should generate a full 20-question quiz filtered to time-arithmetic only", () => {
      const questions = generateAllQuestions(["time-arithmetic"]);
      expect(questions.length).toBe(20);
      for (const q of questions) {
        expect(q.type).toBe("time-arithmetic");
      }
    });

    it("should generate a full 20-question quiz filtered to elapsed-time only", () => {
      const questions = generateAllQuestions(["elapsed-time"]);
      expect(questions.length).toBe(20);
      for (const q of questions) {
        expect(q.type).toBe("elapsed-time");
      }
    });
  });
});
