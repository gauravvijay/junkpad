import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const TimeArithmeticRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { hour, minutes, ampm, options, correctIndex } = question.data as {
    hour: number;
    minutes: number;
    ampm: string;
    options: string[];
    correctIndex: number;
  };

  const [selected, setSelected] = useState<number | null>(null);
  const locked = result?.answered;

  const minuteAngle = (minutes ?? 0) * 6;
  const hourAngle = ((hour ?? 12) % 12) * 30 + (minutes ?? 0) * 0.5;

  const handleSubmit = () => {
    if (selected !== null) onAnswer(selected);
  };

  return (
    <div className={styles.questionContainer}>
      <div
        className={styles.clockContainer}
        style={{
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <svg viewBox="0 0 200 200" width="200" height="200" className={styles.clockSvg}>
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
                <text
                  x={textX}
                  y={textY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="14"
                  fontWeight="bold"
                  fill="#333"
                >
                  {i === 0 ? 12 : i}
                </text>
              </g>
            );
          })}
          <line
            x1="100"
            y1="100"
            x2={100 + 75 * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
            y2={100 + 75 * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
            stroke="#2196F3"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="100"
            y1="100"
            x2={100 + 50 * Math.cos((hourAngle - 90) * (Math.PI / 180))}
            y2={100 + 50 * Math.sin((hourAngle - 90) * (Math.PI / 180))}
            stroke="#333"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="100" cy="100" r="5" fill="#333" />
        </svg>

        <span
          style={{
            background: ampm?.toLowerCase() === "pm" ? "#1e293b" : "#fef08a",
            color: ampm?.toLowerCase() === "pm" ? "#f8fafc" : "#854d0e",
            padding: "4px 14px",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {ampm?.toLowerCase() === "pm" ? "🌙 Afternoon / Evening (PM)" : "☀️ Morning (AM)"}
        </span>
      </div>

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

      {locked && (
        <div className={styles.answerReveal}>
          Correct answer: <strong>{options[correctIndex]}</strong>
        </div>
      )}

      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default TimeArithmeticRenderer;
