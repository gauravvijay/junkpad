import type { Question } from "../types";
import { generatePlaceValueQuestion } from "./placeValueGenerator";
import { generatePencilFractionQuestion } from "./pencilFractionGenerator";
import { generateOrderNumbersQuestion } from "./orderNumbersGenerator";
import { generateSequenceQuestion } from "./sequenceGenerator";
import { generateMinecraftBlocksQuestion } from "./minecraftBlocksGenerator";
import { generateTrampolineQuestion } from "./trampolineGenerator";
import { generateCheckCalculationQuestion } from "./checkCalculationGenerator";
import { generateCropFractionQuestion } from "./cropFractionGenerator";
import { generateDivisionTeamsQuestion } from "./divisionTeamsGenerator";
import { generateClockTimeQuestion } from "./clockTimeGenerator";
import { generateDanceVideoQuestion } from "./danceVideoGenerator";
import { generateNumberLineQuestion } from "./numberLineGenerator";
import { generateSudokuQuestion } from "./sudokuGenerator";
import { generateGraphApplesQuestion } from "./graphApplesGenerator";
import { generateSubtractionQuestion } from "./subtractionGenerator";
import { generateSpeedDistanceQuestion } from "./speedDistanceGenerator";

export type GeneratorFn = (id: number) => Question;

export const questionGenerators: GeneratorFn[] = [
  generatePlaceValueQuestion,       // 1
  generatePencilFractionQuestion,   // 2
  generateOrderNumbersQuestion,     // 3
  generateSequenceQuestion,         // 4
  generateMinecraftBlocksQuestion,  // 5
  generateTrampolineQuestion,       // 6
  generateCheckCalculationQuestion, // 7
  generateCropFractionQuestion,     // 8
  generateDivisionTeamsQuestion,    // 9
  generateClockTimeQuestion,        // 10
  generateDanceVideoQuestion,       // 11
  generateNumberLineQuestion,       // 12
  generateSudokuQuestion,           // 13
  generateGraphApplesQuestion,      // 14
  generateSubtractionQuestion,      // 15
  generateSpeedDistanceQuestion,    // 16
];

export function generateAllQuestions(): Question[] {
  return questionGenerators.map((gen, idx) => gen(idx + 1));
}
