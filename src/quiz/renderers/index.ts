import type { QuestionRendererProps } from "../types";
import PlaceValueRenderer from "./PlaceValueRenderer";
import PencilFractionRenderer from "./PencilFractionRenderer";
import OrderNumbersRenderer from "./OrderNumbersRenderer";
import SimpleInputRenderer from "./SimpleInputRenderer";
import MultipleChoiceRenderer from "./MultipleChoiceRenderer";
import FractionInputRenderer from "./FractionInputRenderer";
import ClockTimeRenderer from "./ClockTimeRenderer";
import NumberLineRenderer from "./NumberLineRenderer";
import SudokuRenderer from "./SudokuRenderer";
import GraphApplesRenderer from "./GraphApplesRenderer";
import SequenceRenderer from "./SequenceRenderer";
import ShapePerimeterRenderer from "./ShapePerimeterRenderer";
import ChessboardRenderer from "./ChessboardRenderer";
import MonopolyNotePickerRenderer from "./MonopolyNotePickerRenderer";

type RendererComponent = React.FC<QuestionRendererProps>;

export const rendererMap: Record<string, RendererComponent> = {
  "place-value": PlaceValueRenderer,
  "pencil-fraction": PencilFractionRenderer,
  "order-numbers": OrderNumbersRenderer,
  "sequence": SequenceRenderer,
  "minecraft-blocks": SimpleInputRenderer,
  "trampoline": SimpleInputRenderer,
  "check-calculation": MultipleChoiceRenderer,
  "crop-fraction": FractionInputRenderer,
  "division-teams": SimpleInputRenderer,
  "clock-time": ClockTimeRenderer,
  "dance-video": SimpleInputRenderer,
  "number-line": NumberLineRenderer,
  "sudoku": SudokuRenderer,
  "graph-apples": GraphApplesRenderer,
  "subtraction": SimpleInputRenderer,
  "speed-distance": SimpleInputRenderer,
  "rounding": SimpleInputRenderer,
  "money": SimpleInputRenderer,
  "comparison": MultipleChoiceRenderer,
  "missing-operator": MultipleChoiceRenderer,
  "shape-perimeter": ShapePerimeterRenderer,
  "even-odd": SimpleInputRenderer,
  "measurement-convert": SimpleInputRenderer,
  "double-half": SimpleInputRenderer,
  "word-problem-multiply": SimpleInputRenderer,
  "sharing-equally": SimpleInputRenderer,
  "monopoly-mcq": MultipleChoiceRenderer,
  "monopoly-note-picker": MonopolyNotePickerRenderer,
  "notes-arithmetic": SimpleInputRenderer,
  "catchup-speed": SimpleInputRenderer,
  "chess": ChessboardRenderer,
};

export function getRenderer(type: string): RendererComponent {
  return rendererMap[type] ?? SimpleInputRenderer;
}
