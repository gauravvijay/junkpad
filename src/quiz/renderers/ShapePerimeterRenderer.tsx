import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const ShapePerimeterRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const data = question.data as Record<string, unknown>;
  const shape = data.shape as string;
  const [value, setValue] = useState("");
  const locked = result?.answered;
  const handleSubmit = () => { onAnswer(Number(value)); };

  const renderShape = () => {
    if (shape === "square") {
      const side = data.side as number;
      return (
        <svg viewBox="0 0 200 200" width="180" height="180" className={styles.shapeSvg}>
          <rect x="30" y="30" width="140" height="140" fill="#e3f2fd" stroke="#1565c0" strokeWidth="3" />
          <text x="100" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1565c0">{side} cm</text>
          <text x="185" y="105" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#1565c0">{side} cm</text>
        </svg>
      );
    } else if (shape === "rectangle") {
      const w = data.width as number;
      const h = data.height as number;
      return (
        <svg viewBox="0 0 240 180" width="220" height="160" className={styles.shapeSvg}>
          <rect x="20" y="30" width="180" height="120" fill="#e8f5e9" stroke="#2e7d32" strokeWidth="3" />
          <text x="110" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2e7d32">{w} cm</text>
          <text x="215" y="95" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2e7d32">{h} cm</text>
        </svg>
      );
    } else {
      const side = data.side as number;
      return (
        <svg viewBox="0 0 200 200" width="180" height="180" className={styles.shapeSvg}>
          <polygon points="100,20 20,170 180,170" fill="#fce4ec" stroke="#c62828" strokeWidth="3" />
          <text x="100" y="190" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#c62828">{side} cm</text>
        </svg>
      );
    }
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.shapeVisual}>{renderShape()}</div>
      <div className={styles.inputGroup}>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Perimeter (cm)" />
      </div>
      {locked && (
        <div className={styles.answerReveal}>Correct answer: <strong>{String(question.correctAnswer)} cm</strong></div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={value === ""} className={styles.submitBtn}>Submit</button>
      )}
    </div>
  );
};

export default ShapePerimeterRenderer;
