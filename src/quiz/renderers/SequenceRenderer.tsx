import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const SequenceRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { sequence } = question.data as { sequence: number[]; step: number };
  const [value, setValue] = useState("");
  const locked = result?.answered;
  const handleSubmit = () => { onAnswer(Number(value)); };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.sequenceRow}>
        {sequence.map((n, i) => (
          <span key={i} className={styles.sequenceNum}>{n}</span>
        ))}
        <span className={styles.sequenceBlank}>?</span>
      </div>
      <div className={styles.inputGroup}>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)}
          disabled={!!locked}
          className={`${styles.numberInput} ${locked ? (result?.correct ? styles.correct : styles.wrong) : ""}`}
          placeholder="Next number" />
      </div>
      {locked && (
        <div className={styles.answerReveal}>Correct answer: <strong>{String(question.correctAnswer)}</strong></div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={value === ""} className={styles.submitBtn}>Submit</button>
      )}
    </div>
  );
};

export default SequenceRenderer;
