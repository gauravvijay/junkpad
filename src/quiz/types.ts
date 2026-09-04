// Core types for the quiz engine

export interface Question {
  id: number;
  type: string;
  category: string;
  prompt: string;
  data: Record<string, unknown>;
  correctAnswer: unknown;
}

export interface QuestionResult {
  questionId: number;
  answered: boolean;
  correct: boolean | null;
  userAnswer: unknown;
  timeTaken?: number; // seconds
}

export interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: unknown) => void;
  result: QuestionResult | undefined;
}

export type QuestionGenerator = () => Question;
