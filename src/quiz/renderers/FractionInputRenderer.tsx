import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const FractionInputRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { denominator, horse1, horse2 } = question.data as {
    denominator: number;
    horse1: number;
    horse2: number;
    remaining: number;
  };

  const [numerator, setNumerator] = useState("");
  const locked = result?.answered;

  const handleSubmit = () => {
    onAnswer(`${numerator}/${denominator}`);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.fractionVisual}>
        <div className={styles.fractionBar}>
          {Array.from({ length: denominator }).map((_, i) => {
            let cls = styles.fractionSlice;
            if (i < horse1) cls += " " + styles.sliceHorse1;
            else if (i < horse1 + horse2) cls += " " + styles.sliceHorse2;
            else cls += " " + styles.sliceRemaining;
            return <div key={i} className={cls} />;
          })}
        </div>
        <div className={styles.fractionLegend}>
          <span className={styles.legendHorse1}>{"\uD83D\uDC34"} Horse 1: {horse1}/{denominator}</span>
          <span className={styles.legendHorse2}>{"\uD83D\uDC34"} Horse 2: {horse2}/{denominator}</span>
          <span className={styles.legendRemaining}>{"\u2753"} Left: ?/{denominator}</span>
        </div>
      </div>
      <div className={styles.fractionInputRow}>
        <input
          type="number"
          value={numerator}
          onChange={(e) => setNumerator(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${styles.fractionNumerator} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="?"
          min={0}
        />
        <span className={styles.fractionSlash}>/ {denominator}</span>
      </div>
      {locked && (
        <div className={styles.answerReveal}>
          Correct answer: <strong>{String(question.correctAnswer)}</strong>
        </div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={numerator === ""} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default FractionInputRenderer;
