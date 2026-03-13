import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

const SudokuRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
  result,
}) => {
  const { targetSum, puzzle, gaps } = question.data as {
    targetSum: number;
    puzzle: number[][];
    gaps: [number, number][];
  };

  const solution = question.correctAnswer as number[][];

  const [inputs, setInputs] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    gaps.forEach(([r, c]) => {
      init[`${r}_${c}`] = "";
    });
    return init;
  });

  const locked = result?.answered;

  const isGap = (r: number, c: number) =>
    gaps.some(([gr, gc]) => gr === r && gc === c);

  const handleChange = (r: number, c: number, val: string) => {
    setInputs((prev) => ({ ...prev, [`${r}_${c}`]: val }));
  };

  const handleSubmit = () => {
    // Build the user's grid
    const userGrid = puzzle.map((row) => [...row]);
    gaps.forEach(([r, c]) => {
      userGrid[r][c] = Number(inputs[`${r}_${c}`] || 0);
    });
    onAnswer(userGrid);
  };

  const allFilled = Object.values(inputs).every((v) => v !== "");

  return (
    <div className={styles.questionContainer}>
      <div className={styles.sudokuInfo}>
        Each row and column must add to <strong>{targetSum}</strong>
      </div>
      <table className={styles.sudokuGrid}>
        <tbody>
          {puzzle.map((row, r) => (
            <tr key={r}>
              {row.map((cell, c) => {
                if (isGap(r, c)) {
                  const key = `${r}_${c}`;
                  let cellClass = styles.sudokuCell + " " + styles.sudokuGap;
                  if (locked) {
                    if (Number(inputs[key]) === solution[r][c]) {
                      cellClass += " " + styles.correct;
                    } else {
                      cellClass += " " + styles.wrong;
                    }
                  }
                  return (
                    <td key={c} className={cellClass}>
                      <input
                        type="number"
                        value={inputs[key]}
                        onChange={(e) => handleChange(r, c, e.target.value)}
                        disabled={!!locked}
                        className={styles.sudokuInput}
                      />
                      {locked && Number(inputs[key]) !== solution[r][c] && (
                        <div className={styles.sudokuCorrectVal}>{solution[r][c]}</div>
                      )}
                    </td>
                  );
                }
                return (
                  <td key={c} className={styles.sudokuCell}>
                    {cell}
                  </td>
                );
              })}
              <td className={styles.sudokuSum}>= {targetSum}</td>
            </tr>
          ))}
          <tr>
            {[0, 1, 2].map((c) => (
              <td key={c} className={styles.sudokuColSum}>
                ↓ {targetSum}
              </td>
            ))}
            <td />
          </tr>
        </tbody>
      </table>
      {!locked && (
        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className={styles.submitBtn}
        >
          Submit
        </button>
      )}
    </div>
  );
};

export default SudokuRenderer;
