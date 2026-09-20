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
import { generateTimeArithmeticQuestion } from "./timeArithmeticGenerator";
import { generateElapsedTimeQuestion } from "./elapsedTimeGenerator";

export type GeneratorFn = (id: number) => Question;

export interface RegisteredTopic {
  id: string;
  label: string;
  category: string;
  generator: GeneratorFn;
}

export const TOPIC_REGISTRY: RegisteredTopic[] = [
  {
    id: "place-value",
    label: "Place Value",
    category: "Number Sense",
    generator: generatePlaceValueQuestion,
  },
  {
    id: "order-numbers",
    label: "Order Numbers",
    category: "Number Sense",
    generator: generateOrderNumbersQuestion,
  },
  {
    id: "number-line",
    label: "Number Line",
    category: "Number Sense",
    generator: generateNumberLineQuestion,
  },
  {
    id: "comparison",
    label: "Comparing Numbers",
    category: "Number Sense",
    generator: generateComparisonQuestion,
  },
  {
    id: "trampoline",
    label: "Addition",
    category: "Arithmetic",
    generator: generateTrampolineQuestion,
  },
  {
    id: "subtraction",
    label: "Subtraction",
    category: "Arithmetic",
    generator: generateSubtractionQuestion,
  },
  {
    id: "missing-operator",
    label: "Missing Operators",
    category: "Arithmetic",
    generator: generateMissingOperatorQuestion,
  },
  {
    id: "check-calculation",
    label: "Inverse Operations",
    category: "Arithmetic",
    generator: generateCheckCalculationQuestion,
  },
  {
    id: "division-teams",
    label: "Division Teams",
    category: "Multiplication & Division",
    generator: generateDivisionTeamsQuestion,
  },
  {
    id: "sharing-equally",
    label: "Sharing Equally",
    category: "Multiplication & Division",
    generator: generateSharingEquallyQuestion,
  },
  {
    id: "word-problem-multiply",
    label: "Multiplication Problems",
    category: "Multiplication & Division",
    generator: generateWordProblemMultiplyQuestion,
  },
  {
    id: "pencil-fraction",
    label: "Pencil Fractions",
    category: "Fractions",
    generator: generatePencilFractionQuestion,
  },
  {
    id: "crop-fraction",
    label: "Crop Fractions",
    category: "Fractions",
    generator: generateCropFractionQuestion,
  },
  {
    id: "money",
    label: "Coins & Change",
    category: "Money",
    generator: generateMoneyQuestion,
  },
  {
    id: "monopoly",
    label: "Monopoly Money",
    category: "Money",
    generator: generateMonopolyQuestion,
  },
  {
    id: "notes-arithmetic",
    label: "Notes Arithmetic",
    category: "Money",
    generator: generateNotesArithmeticQuestion,
  },
  {
    id: "clock-time",
    label: "Telling Time",
    category: "Time & Measurement",
    generator: generateClockTimeQuestion,
  },
  {
    id: "time-arithmetic",
    label: "Time Arithmetic",
    category: "Time & Measurement",
    generator: generateTimeArithmeticQuestion,
  },
  {
    id: "elapsed-time",
    label: "Elapsed Time",
    category: "Time & Measurement",
    generator: generateElapsedTimeQuestion,
  },
  {
    id: "measurement-convert",
    label: "Unit Conversions",
    category: "Time & Measurement",
    generator: generateMeasurementConvertQuestion,
  },
  {
    id: "shape-perimeter",
    label: "Perimeter & Shapes",
    category: "Geometry",
    generator: generateShapePerimeterQuestion,
  },
  {
    id: "speed-distance",
    label: "Speed & Distance",
    category: "Speed & Travel",
    generator: generateSpeedDistanceQuestion,
  },
  {
    id: "catch-up-speed",
    label: "Catch-Up Speed",
    category: "Speed & Travel",
    generator: generateCatchUpSpeedQuestion,
  },
  {
    id: "sequence",
    label: "Number Patterns",
    category: "Logic & Puzzles",
    generator: generateSequenceQuestion,
  },
  {
    id: "sudoku",
    label: "Mini Sudoku",
    category: "Logic & Puzzles",
    generator: generateSudokuQuestion,
  },
  {
    id: "dance-video",
    label: "Multi-Step Views",
    category: "Logic & Puzzles",
    generator: generateDanceVideoQuestion,
  },
  {
    id: "chess",
    label: "Chess Moves",
    category: "Logic & Puzzles",
    generator: generateChessQuestion,
  },
];

export function getAllTopicIds(): string[] {
  return TOPIC_REGISTRY.map((t) => t.id);
}

export function getTopicsByCategory(): Record<string, RegisteredTopic[]> {
  const groups: Record<string, RegisteredTopic[]> = {};
  for (const topic of TOPIC_REGISTRY) {
    if (!groups[topic.category]) {
      groups[topic.category] = [];
    }
    groups[topic.category].push(topic);
  }
  return groups;
}

export function getGeneratorsByIds(ids?: string[]): GeneratorFn[] {
  if (!ids || ids.length === 0) {
    return TOPIC_REGISTRY.map((t) => t.generator);
  }
  const idSet = new Set(ids);
  const matched = TOPIC_REGISTRY.filter((t) => idSet.has(t.id)).map((t) => t.generator);
  return matched.length > 0 ? matched : TOPIC_REGISTRY.map((t) => t.generator);
}
