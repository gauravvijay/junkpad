import type { Question } from "../types";
import { generatePlaceValueQuestion } from "./placeValueGenerator";
import { generatePencilFractionQuestion } from "./pencilFractionGenerator";
import { generateOrderNumbersQuestion } from "./orderNumbersGenerator";
import { generateSequenceQuestion } from "./sequenceGenerator";
import { generateTrampolineQuestion } from "./trampolineGenerator";
import { generateCheckCalculationQuestion } from "./checkCalculationGenerator";
import { generateCropFractionQuestion } from "./cropFractionGenerator";
import { generateDivisionTeamsQuestion } from "./divisionTeamsGenerator";
import { generateClockTimeQuestion } from "./clockTimeGenerator";
import { generateDanceVideoQuestion } from "./danceVideoGenerator";
import { generateNumberLineQuestion } from "./numberLineGenerator";
import { generateSudokuQuestion } from "./sudokuGenerator";
import { generateSubtractionQuestion } from "./subtractionGenerator";
import { generateSpeedDistanceQuestion } from "./speedDistanceGenerator";
import { generateMoneyQuestion } from "./moneyGenerator";
import { generateComparisonQuestion } from "./comparisonGenerator";
import { generateMissingOperatorQuestion } from "./missingOperatorGenerator";
import { generateShapePerimeterQuestion } from "./shapePerimeterGenerator";
import { generateMeasurementConvertQuestion } from "./measurementConvertGenerator";
import { generateWordProblemMultiplyQuestion } from "./wordProblemMultiplyGenerator";
import { generateSharingEquallyQuestion } from "./sharingEquallyGenerator";
import { generateMonopolyQuestion } from "./monopolyGenerator";
import { generateNotesArithmeticQuestion } from "./notesArithmeticGenerator";
import { generateCatchUpSpeedQuestion } from "./catchUpSpeedGenerator";
import { generateChessQuestion } from "./chessGenerator";

export type GeneratorFn = (id: number) => Question;

export const questionGenerators: GeneratorFn[] = [
  generatePlaceValueQuestion,
  generatePencilFractionQuestion,
  generateOrderNumbersQuestion,
  generateSequenceQuestion,
  generateTrampolineQuestion,
  generateCheckCalculationQuestion,
  generateCropFractionQuestion,
  generateDivisionTeamsQuestion,
  generateClockTimeQuestion,
  generateDanceVideoQuestion,
  generateNumberLineQuestion,
  generateSudokuQuestion,
  generateSubtractionQuestion,
  generateSpeedDistanceQuestion,
  generateMoneyQuestion,
  generateComparisonQuestion,
  generateMissingOperatorQuestion,
  generateShapePerimeterQuestion,
  generateMeasurementConvertQuestion,
  generateWordProblemMultiplyQuestion,
  generateSharingEquallyQuestion,
  generateMonopolyQuestion,
  generateNotesArithmeticQuestion,
  generateCatchUpSpeedQuestion,
  generateChessQuestion,
];

const QUESTIONS_PER_QUIZ = 20;

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateAllQuestions(): Question[] {
  // Shuffle all generators and pick QUESTIONS_PER_QUIZ of them
  const picked = shuffle(questionGenerators).slice(0, QUESTIONS_PER_QUIZ);
  return picked.map((gen, idx) => gen(idx + 1));
}
