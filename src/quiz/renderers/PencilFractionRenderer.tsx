import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface PencilOption {
  blackCount: number;
  totalCount: number;
}

const PencilFractionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { options, correctIndex } = question.data as {
    options: PencilOption[];
    correctIndex: number;
  };

  const [selected, setSelected] = useState<number | null>(null);
  const locked = result?.answered;

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.pencilGrid}>
        {options.map((opt, idx) => {
          const pencils = [];
          for (let i = 0; i < opt.totalCount; i++) {
            pencils.push(
              <div
                key={i}
                className={`${styles.pencil} ${i < opt.blackCount ? styles.pencilBlack : styles.pencilWhite}`}
              >
                <div className={styles.pencilTip} />
                <div className={styles.pencilBody} />
                <div className={styles.pencilEraser} />
              </div>
            );
          }
          const isCorrect = locked && idx === correctIndex;
          const isWrong = locked && idx === selected && idx !== correctIndex;
          return (
            <div
              key={idx}
              className={`${styles.pencilSet} ${selected === idx && !locked ? styles.pencilSetSelected : ""} ${isCorrect ? styles.correct : ""} ${isWrong ? styles.wrong : ""}`}
              onClick={() => !locked && setSelected(idx)}
            >
              <div className={styles.pencilSetLabel}>Option {String.fromCharCode(65 + idx)}</div>
              <div className={styles.pencilRow}>{pencils}</div>
            </div>
          );
        })}
      </div>
      {locked && (
        <div className={styles.answerReveal}>
          The correct answer is <strong>Option {String.fromCharCode(65 + correctIndex)}</strong> ({options[correctIndex].blackCount}/{options[correctIndex].totalCount} black)
        </div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={selected === null} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default PencilFractionRenderer;
