import { describe, it, expect, beforeEach } from "vitest";
import { loadConfig, saveConfig, resetConfig, STORAGE_KEY } from "../config";
import { getAllTopicIds, TOPIC_REGISTRY } from "../generators/registry";
import { generateAllQuestions, QUESTIONS_PER_QUIZ } from "../generators";

// Mock localStorage for Node/Vitest environment
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string): string | null => store[key] ?? null,
    setItem: (key: string, value: string): void => {
      store[key] = String(value);
    },
    removeItem: (key: string): void => {
      delete store[key];
    },
    clear: (): void => {
      store = {};
    },
  };
})();

// Attach mock to global window
Object.defineProperty(globalThis, "window", {
  value: { localStorage: localStorageMock },
  writable: true,
});

describe("Quiz Topic Configuration & Persistence", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  // Test 1: Persistence Roundtrip & Reset
  it("Test 1: should correctly persist, retrieve, and reset topic configuration in storage", () => {
    const allIds = getAllTopicIds();
    expect(allIds.length).toBeGreaterThan(0);

    // Initial state: defaults to all topics
    expect(loadConfig()).toEqual(allIds);

    // Save subset
    const subset = ["chess", "monopoly", "place-value"];
    saveConfig(subset);
    expect(loadConfig()).toEqual(subset);

    // Reset back to defaults
    const resetResult = resetConfig();
    expect(resetResult).toEqual(allIds);
    expect(loadConfig()).toEqual(allIds);
    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
  });

  // Test 2: Defensive Storage & Stale ID Pruning
  it("Test 2: should handle corrupted JSON, non-array data, and prune obsolete/deleted topic IDs", () => {
    const allIds = getAllTopicIds();

    // 1. Corrupted JSON string
    localStorageMock.setItem(STORAGE_KEY, "{bad-json-syntax:");
    expect(() => loadConfig()).not.toThrow();
    expect(loadConfig()).toEqual(allIds);

    // 2. Non-array JSON
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify({ selected: "all" }));
    expect(loadConfig()).toEqual(allIds);

    // 3. Obsolete / deleted topic IDs mixed with valid IDs
    const mixed = ["obsolete_topic_2023", "chess", "non_existent_generator", "trampoline"];
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(mixed));
    expect(loadConfig()).toEqual(["chess", "trampoline"]);

    // 4. Only obsolete IDs -> fallback to all
    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(["only_deleted_id"]));
    expect(loadConfig()).toEqual(allIds);
  });

  // Test 3: Generator Filtering Strictness
  it("Test 3: should only generate questions from the explicitly selected topics", () => {
    const selected = ["chess", "catch-up-speed"];
    const questions = generateAllQuestions(selected);

    expect(questions.length).toBe(QUESTIONS_PER_QUIZ);

    // Valid types for these two topics
    const validTypes = new Set(["chess", "catchup-speed"]);

    for (const q of questions) {
      expect(validTypes.has(q.type)).toBe(true);
    }

    // Verify unselected types never appear
    const unselectedTypes = TOPIC_REGISTRY.filter((t) => !selected.includes(t.id)).map(
      (t) => t.id
    );
    for (const q of questions) {
      expect(unselectedTypes.includes(q.type)).toBe(false);
    }
  });

  // Test 4: Adaptive Sizing with Low Selection Count (Sampling with Replacement)
  it("Test 4: should always generate 20 questions with sequential IDs even when only 1 topic is selected", () => {
    const selected = ["chess"];
    const questions = generateAllQuestions(selected);

    expect(questions.length).toBe(20);

    // Every question should be chess
    for (const q of questions) {
      expect(q.type).toBe("chess");
    }

    // Question IDs must be strictly sequential 1..20
    const ids = questions.map((q) => q.id);
    expect(ids).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  // Test 5: Empty Selection Guardrail
  it("Test 5: should fall back to all available topics and never return an empty question array", () => {
    // Empty array passed
    const emptyResult = generateAllQuestions([]);
    expect(emptyResult.length).toBe(QUESTIONS_PER_QUIZ);

    // Undefined passed
    const undefinedResult = generateAllQuestions(undefined);
    expect(undefinedResult.length).toBe(QUESTIONS_PER_QUIZ);

    // Diverse topics generated (not all identical)
    const uniqueTypes = new Set(emptyResult.map((q) => q.type));
    expect(uniqueTypes.size).toBeGreaterThan(1);
  });
});
