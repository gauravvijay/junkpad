import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const NumberLineRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { start, end, endShow, midpoint } = question.data as {
    start: number;
    end: number;
    endShow: number[];
    midpoint: number;
  };

  const [value, setValue] = useState("");
  const locked = result?.answered;

  const handleSubmit = () => {
    onAnswer(Number(value));
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.numberLineContainer}>
        <svg viewBox="0 0 600 100" width="100%" height="100" className={styles.numberLineSvg}>
          {/* Main line */}
          <line x1="30" y1="50" x2="570" y2="50" stroke="#333" strokeWidth="3" />

          {/* Left tick + label */}
          <line x1="40" y1="35" x2="40" y2="65" stroke="#333" strokeWidth="2" />
          <text x="40" y="85" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
            {start}
          </text>

          {/* Midpoint tick */}
          <line x1="300" y1="30" x2="300" y2="70" stroke="#e91e63" strokeWidth="3" />
          <text x="300" y="25" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#e91e63">
            ?
          </text>

          {/* Right ticks for endShow */}
          {endShow.map((n, i) => {
            const x = 490 + i * 40;
            return (
              <g key={n}>
                <line x1={x} y1="35" x2={x} y2="65" stroke="#333" strokeWidth="2" />
                <text x={x} y="85" textAnchor="middle" fontSize="14" fill="#333">
                  {n}
                </text>
              </g>
            );
          })}

          {/* Dots to show continuation */}
          <text x="120" y="55" fontSize="20" fill="#999">• • •</text>
          <text x="420" y="55" fontSize="20" fill="#999">• • •</text>
        </svg>
      </div>

      <div className={styles.midpointInfo}>
        Find the midpoint between <strong>{start}</strong> and <strong>{end}</strong>
      </div>

      <div className={styles.inputGroup}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Midpoint"
        />
      </div>
      {locked && (
        <div className={styles.answerReveal}>
          Correct answer: <strong>{midpoint}</strong>
        </div>
      )}
      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={value === ""}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default NumberLineRenderer;
