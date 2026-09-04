import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface BoardData {
  mode: "mcq" | "clickable";
  size: number;
  pieces: Array<{ sq: string; piece: string }>;
  attackSquares?: string[];
  safeSquares?: string[];
  highlightSquares?: string[];
  // MCQ mode
  options?: string[];
  correctIndex?: number;
  // Clickable mode
  validAnswers?: string[];
}

const PIECE_SYMBOLS: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

function sq2rc(sq: string, size: number): [number, number] {
  const c = sq.charCodeAt(0) - 65;
  const r = size - parseInt(sq[1]);
  return [c, r];
}

function BoardSVG({
  data,
  selectedSquare,
  locked,
  isCorrect,
  correctAnswer,
  onSquareClick,
}: {
  data: BoardData;
  selectedSquare: string | null;
  locked: boolean;
  isCorrect: boolean | null | undefined;
  correctAnswer: string;
  onSquareClick: (sq: string) => void;
}) {
  const { size = 6, pieces = [], safeSquares = [], highlightSquares = [], mode } = data;
  const cs = 42;
  const W = size * cs;
  const H = size * cs;
  const cols = "ABCDEFGH".slice(0, size);
  const isClickable = mode === "clickable";

  return (
    <svg
      width={W + 32}
      height={H + 24}
      viewBox={`-32 0 ${W + 32} ${H + 24}`}
      style={{ fontFamily: "sans-serif", display: "block", margin: "0 auto" }}
    >
      {/* Base squares */}
      {Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => {
          const sq = `${cols[c]}${size - r}`;
          return (
            <rect
              key={`sq-${r}-${c}`}
              x={c * cs} y={r * cs}
              width={cs} height={cs}
              fill={(r + c) % 2 === 0 ? "#f0d9b5" : "#b58863"}
              onClick={() => isClickable && onSquareClick(sq)}
              style={{ cursor: isClickable && !locked ? "pointer" : "default" }}
            />
          );
        })
      )}

      {/* Attack squares intentionally not highlighted — kids must reason from the pieces */}

      {/* Safe squares */}
      {safeSquares.map(sq => {
        const [c, r] = sq2rc(sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key={`safe-${sq}`} x={c * cs} y={r * cs} width={cs} height={cs}
          fill="rgba(0,180,100,.38)" pointerEvents="none" />;
      })}

      {/* Highlight squares */}
      {highlightSquares.map(sq => {
        const [c, r] = sq2rc(sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key={`hl-${sq}`} x={c * cs} y={r * cs} width={cs} height={cs}
          fill="rgba(255,210,0,.6)" pointerEvents="none" />;
      })}

      {/* Selected square (clickable mode) */}
      {isClickable && selectedSquare && (() => {
        const [c, r] = sq2rc(selectedSquare, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        const fill = !locked
          ? "rgba(255,220,0,.65)"
          : isCorrect ? "rgba(0,200,80,.6)" : "rgba(255,60,60,.6)";
        return <rect key="selected" x={c * cs} y={r * cs} width={cs} height={cs}
          fill={fill} pointerEvents="none" />;
      })()}

      {/* Show canonical correct square in green after wrong (clickable mode) */}
      {isClickable && locked && !isCorrect && (() => {
        const [c, r] = sq2rc(correctAnswer, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key="correct-sq" x={c * cs} y={r * cs} width={cs} height={cs}
          fill="rgba(0,200,80,.6)" pointerEvents="none" />;
      })()}

      {/* Pieces */}
      {pieces.map(p => {
        const [c, r] = sq2rc(p.sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        const isWhite = p.piece === p.piece.toUpperCase();
        return (
          <text
            key={`piece-${p.sq}`}
            x={c * cs + cs / 2} y={r * cs + cs / 2 + 9}
            textAnchor="middle" fontSize="28"
            fill={isWhite ? "#fff" : "#222"}
            stroke={isWhite ? "#444" : "#ccc"} strokeWidth="0.7"
            pointerEvents="none"
          >
            {PIECE_SYMBOLS[p.piece] ?? p.piece}
          </text>
        );
      })}

      {Array.from({ length: size }, (_, c) => (
        <text key={`col-${c}`} x={c * cs + cs / 2} y={H + 18}
          textAnchor="middle" fontSize="12" fill="#636e72">{cols[c]}</text>
      ))}
      {Array.from({ length: size }, (_, r) => (
        <text key={`row-${r}`} x={-16} y={r * cs + cs / 2 + 5}
          textAnchor="middle" fontSize="12" fill="#636e72">{size - r}</text>
      ))}
    </svg>
  );
}

const ChessboardRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, result }) => {
  const data = question.data as unknown as BoardData;
  const locked = !!result?.answered;
  const isCorrect = result?.correct;

  // MCQ state
  const [mcqSelected, setMcqSelected] = useState<number | null>(null);
  // Clickable state
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);

  const correctAnswer = String(question.correctAnswer);

  if (data.mode === "clickable") {
    return (
      <div className={styles.questionContainer}>
        <BoardSVG
          data={data}
          selectedSquare={selectedSquare}
          locked={!!locked}
          isCorrect={isCorrect}
          correctAnswer={correctAnswer}
          onSquareClick={sq => !locked && setSelectedSquare(sq)}
        />
        {!locked && (
          <p style={{ textAlign: "center", fontSize: 14, color: selectedSquare ? "#555" : "#888", margin: "4px 0" }}>
            {selectedSquare
              ? <>Selected: <strong>{selectedSquare}</strong> — tap again to change</>
              : "Tap a square on the board"}
          </p>
        )}
        {!locked && (
          <button onClick={() => selectedSquare && onAnswer(selectedSquare)}
            disabled={!selectedSquare} className={styles.submitBtn}>
            Submit
          </button>
        )}
        {locked && (
          <div style={{
            padding: "12px 20px", borderRadius: 10, fontSize: 15, fontWeight: 600,
            textAlign: "center",
            background: isCorrect ? "#e8f5e9" : "#ffebee",
            color: isCorrect ? "#2e7d32" : "#c62828",
          }}>
            {isCorrect
              ? `✅ ${selectedSquare} — correct!`
              : `❌ ${selectedSquare} is not the right answer. One correct square is ${correctAnswer} (shown in green).`}
          </div>
        )}
      </div>
    );
  }

  // MCQ mode
  const { options = [], correctIndex = 0 } = data;
  return (
    <div className={styles.questionContainer}>
      <BoardSVG
        data={data}
        selectedSquare={null}
        locked={!!locked}
        isCorrect={isCorrect}
        correctAnswer={correctAnswer}
        onSquareClick={() => {}}
      />
      <div className={styles.mcOptions}>
        {options.map((opt, idx) => {
          let cls = styles.mcOption;
          if (mcqSelected === idx && !locked) cls += " " + styles.mcSelected;
          if (locked && idx === correctIndex) cls += " " + styles.correct;
          if (locked && idx === mcqSelected && idx !== correctIndex) cls += " " + styles.wrong;
          return (
            <button key={idx} className={cls}
              onClick={() => !locked && setMcqSelected(idx)}
              disabled={!!locked}>
              {opt}
            </button>
          );
        })}
      </div>
      {!locked && (
        <button onClick={() => mcqSelected !== null && onAnswer(mcqSelected)}
          disabled={mcqSelected === null} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default ChessboardRenderer;
