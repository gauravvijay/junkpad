import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const NumberLineRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { leftEnd, rightEnd, leftShow, rightShow, midpoint } = question.data as {
    leftEnd: number; rightEnd: number; leftShow: number[]; rightShow: number[]; midpoint: number;
  };

  const [value, setValue] = useState("");
  const locked = result?.answered;
  const handleSubmit = () => { onAnswer(Number(value)); };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.numberLineContainer}>
        <svg viewBox="0 0 600 100" width="100%" height="100" className={styles.numberLineSvg}>
          {/* Main line */}
          <line x1="20" y1="50" x2="580" y2="50" stroke="#333" strokeWidth="3" />

          {/* Left ticks (small numbers) */}
          {leftShow.map((n: number, i: number) => {
            const x = 35 + i * 38;
            return (
              <g key={`l${n}`}>
                <line x1={x} y1="35" x2={x} y2="65" stroke="#333" strokeWidth="2" />
                <text x={x} y="85" textAnchor="middle" fontSize="13" fill="#333">{n}</text>
              </g>
            );
          })}

          {/* Dots after left numbers */}
          <text x="175" y="55" fontSize="20" fill="#999">{"\u2022 \u2022 \u2022"}</text>

          {/* Midpoint tick */}
          <line x1="300" y1="28" x2="300" y2="72" stroke="#e91e63" strokeWidth="3" />
          <text x="300" y="22" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#e91e63">?</text>

          {/* Dots before right numbers */}
          <text x="420" y="55" fontSize="20" fill="#999">{"\u2022 \u2022 \u2022"}</text>

          {/* Right ticks (big numbers) */}
          {rightShow.map((n: number, i: number) => {
            const x = 495 + i * 38;
            return (
              <g key={`r${n}`}>
                <line x1={x} y1="35" x2={x} y2="65" stroke="#333" strokeWidth="2" />
                <text x={x} y="85" textAnchor="middle" fontSize="13" fill="#333">{n}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className={styles.midpointInfo}>
        Find the midpoint between <strong>{leftEnd}</strong> and <strong>{rightEnd}</strong>
      </div>

      <div className={styles.inputGroup}>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Midpoint" />
      </div>
      {locked && (
        <div className={styles.answerReveal}>Correct answer: <strong>{midpoint}</strong></div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={value === ""} className={styles.submitBtn}>Submit</button>
      )}
    </div>
  );
};

export default NumberLineRenderer;
