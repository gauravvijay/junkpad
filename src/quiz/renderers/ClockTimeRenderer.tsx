import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const ClockTimeRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { hour, minutes } = question.data as { hour: number; minutes: number };
  const [hourInput, setHourInput] = useState("");
  const [minuteInput, setMinuteInput] = useState("");
  const locked = result?.answered;

  const minuteAngle = minutes * 6;
  const hourAngle = (hour % 12) * 30 + minutes * 0.5;

  const handleSubmit = () => {
    const formattedMin = minuteInput.padStart(2, "0");
    onAnswer(`${hourInput}:${formattedMin}`);
  };

  return (
    <div className={styles.questionContainer}>
      <div className={styles.clockContainer}>
        <svg viewBox="0 0 200 200" width="220" height="220" className={styles.clockSvg}>
          <circle cx="100" cy="100" r="95" fill="white" stroke="#333" strokeWidth="3" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x1 = 100 + 80 * Math.cos(angle);
            const y1 = 100 + 80 * Math.sin(angle);
            const x2 = 100 + 90 * Math.cos(angle);
            const y2 = 100 + 90 * Math.sin(angle);
            const textX = 100 + 70 * Math.cos(angle);
            const textY = 100 + 70 * Math.sin(angle);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="2" />
                <text x={textX} y={textY} textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="bold" fill="#333">
                  {i === 0 ? 12 : i}
                </text>
              </g>
            );
          })}
          <line x1="100" y1="100"
            x2={100 + 75 * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
            y2={100 + 75 * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
            stroke="#2196F3" strokeWidth="3" strokeLinecap="round" />
          <line x1="100" y1="100"
            x2={100 + 50 * Math.cos((hourAngle - 90) * (Math.PI / 180))}
            y2={100 + 50 * Math.sin((hourAngle - 90) * (Math.PI / 180))}
            stroke="#333" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill="#333" />
        </svg>
      </div>
      <div className={styles.timeInputRow}>
        <input type="number" value={hourInput} onChange={(e) => setHourInput(e.target.value)}
          disabled={!!locked} className={`${styles.numberInput} ${styles.timeInput}`} placeholder="H" min={1} max={12} />
        <span className={styles.timeColon}>:</span>
        <input type="number" value={minuteInput} onChange={(e) => setMinuteInput(e.target.value)}
          disabled={!!locked} className={`${styles.numberInput} ${styles.timeInput}`} placeholder="MM" min={0} max={59} />
      </div>
      {locked && (
        <div className={styles.answerReveal}>
          Correct answer: <strong>{String(question.correctAnswer)}</strong>
        </div>
      )}
      {!locked && (
        <button onClick={handleSubmit} disabled={hourInput === "" || minuteInput === ""} className={styles.submitBtn}>
          Submit
        </button>
      )}
    </div>
  );
};

export default ClockTimeRenderer;
