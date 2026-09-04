import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface BoardData {
  size: number;
  pieces: Array<{ sq: string; piece: string }>;
  attackSquares?: string[];
  safeSquares?: string[];
  highlightSquares?: string[];
  options: string[];
  correctIndex: number;
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

function ChessboardSVG({ data }: { data: BoardData }) {
  const { size = 6, pieces = [], attackSquares = [], safeSquares = [], highlightSquares = [] } = data;
  const cs = 42;
  const W = size * cs;
  const H = size * cs;
  const cols = "ABCDEFGH".slice(0, size);

  return (
    <svg
      width={W + 32}
      height={H + 24}
      viewBox={`-32 0 ${W + 32} ${H + 24}`}
      style={{ fontFamily: "sans-serif", display: "block", margin: "0 auto" }}
    >
      {Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => (
          <rect
            key={`sq-${r}-${c}`}
            x={c * cs} y={r * cs}
            width={cs} height={cs}
            fill={(r + c) % 2 === 0 ? "#f0d9b5" : "#b58863"}
          />
        ))
      )}
      {attackSquares.map(sq => {
        const [c, r] = sq2rc(sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key={`atk-${sq}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="rgba(220,50,50,.38)" />;
      })}
      {safeSquares.map(sq => {
        const [c, r] = sq2rc(sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key={`safe-${sq}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="rgba(0,180,100,.38)" />;
      })}
      {highlightSquares.map(sq => {
        const [c, r] = sq2rc(sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        return <rect key={`hl-${sq}`} x={c * cs} y={r * cs} width={cs} height={cs} fill="rgba(255,210,0,.6)" />;
      })}
      {pieces.map(p => {
        const [c, r] = sq2rc(p.sq, size);
        if (c < 0 || c >= size || r < 0 || r >= size) return null;
        const isWhite = p.piece === p.piece.toUpperCase();
        return (
          <text
            key={`piece-${p.sq}`}
            x={c * cs + cs / 2}
            y={r * cs + cs / 2 + 9}
            textAnchor="middle"
            fontSize="28"
            fill={isWhite ? "#fff" : "#222"}
            stroke={isWhite ? "#444" : "#ccc"}
            strokeWidth="0.7"
          >
            {PIECE_SYMBOLS[p.piece] ?? p.piece}
          </text>
        );
      })}
      {Array.from({ length: size }, (_, c) => (
        <text key={`col-${c}`} x={c * cs + cs / 2} y={H + 18} textAnchor="middle" fontSize="12" fill="#636e72">
          {cols[c]}
        </text>
      ))}
      {Array.from({ length: size }, (_, r) => (
        <text key={`row-${r}`} x={-16} y={r * cs + cs / 2 + 5} textAnchor="middle" fontSize="12" fill="#636e72">
          {size - r}
        </text>
      ))}
    </svg>
  );
}

const ChessboardRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, result }) => {
  const data = question.data as unknown as BoardData;
  const { options, correctIndex } = data;
  const [selected, setSelected] = useState<number | null>(null);
  const locked = result?.answered;

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  return (
    <div className={styles.questionContainer}>
      <ChessboardSVG data={data} />
      <div className={styles.mcOptions}>
        {options.map((opt, idx) => {
          let cls = styles.mcOption;
          if (selected === idx && !locked) cls += " " + styles.mcSelected;
          if (locked && idx === correctIndex) cls += " " + styles.correct;
          if (locked && idx === selected && idx !== correctIndex) cls += " " + styles.wrong;
          return (
            <button
              key={idx}
              className={cls}
              onClick={() => !locked && setSelected(idx)}
              disabled={!!locked}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {!locked && (
        <button onClick={handleSubmit} disabled={selected === null} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default ChessboardRenderer;
