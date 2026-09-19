import type { Question } from "../types";
import {
  TOPIC_REGISTRY,
  getAllTopicIds,
  getTopicsByCategory,
  getGeneratorsByIds,
  type GeneratorFn,
  type RegisteredTopic,
} from "./registry";

export type { GeneratorFn, RegisteredTopic };
export { TOPIC_REGISTRY, getAllTopicIds, getTopicsByCategory };

// Re-export questionGenerators for backwards compatibility
export const questionGenerators: GeneratorFn[] = TOPIC_REGISTRY.map((t) => t.generator);

export const QUESTIONS_PER_QUIZ = 20;

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a quiz with QUESTIONS_PER_QUIZ questions based on selected topic IDs.
 * If selectedIds is empty or invalid, falls back to all registered topics.
 * If selected topics are fewer than QUESTIONS_PER_QUIZ, samples with replacement
 * so the quiz is always complete with exactly QUESTIONS_PER_QUIZ questions.
 */
export function generateAllQuestions(selectedIds?: string[]): Question[] {
  const pool = getGeneratorsByIds(selectedIds);
  const activePool = pool.length > 0 ? pool : questionGenerators;

  let chosenGenerators: GeneratorFn[];

  if (activePool.length >= QUESTIONS_PER_QUIZ) {
    chosenGenerators = shuffle(activePool).slice(0, QUESTIONS_PER_QUIZ);
  } else {
    // If fewer than QUESTIONS_PER_QUIZ, sample with replacement to reach 20 questions
    chosenGenerators = [];
    while (chosenGenerators.length < QUESTIONS_PER_QUIZ) {
      const shuffled = shuffle(activePool);
      for (const gen of shuffled) {
        chosenGenerators.push(gen);
        if (chosenGenerators.length === QUESTIONS_PER_QUIZ) break;
      }
    }
  }

  return chosenGenerators.map((gen, idx) => gen(idx + 1));
}
