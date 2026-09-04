import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface NotePickerData {
  price: number;
  hand: number[];
  property: string;
}

function fmtRupee(n: number): string {
  return `₹${n >= 1000 ? (n / 1000) + "K" : n}`;
}

const MonopolyNotePickerRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, result }) => {
  const { price, hand } = question.data as unknown as NotePickerData;
  const locked = result?.answered;

  const handCounts: Record<number, number> = {};
  hand.forEach(n => { handCounts[n] = (handCounts[n] || 0) + 1; });
  const denominations = [10000, 1000, 500].filter(n => (handCounts[n] ?? 0) > 0);

  const [selected, setSelected] = useState<Record<number, number>>({});

  const totalGiven = Object.entries(selected).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count,
    0
  );
  const changeAmt = totalGiven - price;

  const toggle = (denom: number) => {
    if (locked) return;
    setSelected(prev => {
      const cur = prev[denom] ?? 0;
      return { ...prev, [denom]: cur < (handCounts[denom] ?? 0) ? cur + 1 : 0 };
    });
  };

  const handlePay = () => {
    if (totalGiven >= price) onAnswer(totalGiven);
  };

  return (
    <div className={styles.questionContainer}>
      <p style={{ fontSize: 14, color: "#666", margin: 0 }}>Tap notes to give to the bank:</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {denominations.flatMap(n => {
          const count = handCounts[n];
          const sel = selected[n] ?? 0;
          return Array.from({ length: count }, (_, i) => (
            <button
              key={`${n}-${i}`}
              onClick={() => toggle(n)}
              disabled={!!locked}
              style={{
                padding: "12px 20px",
                fontSize: 16,
                fontWeight: 700,
                border: `3px solid ${i < sel ? "#00c853" : "#7c4dff"}`,
                borderRadius: 12,
                background: i < sel
                  ? "linear-gradient(135deg,#00c853,#69f0ae)"
                  : "linear-gradient(135deg,#ede7f6,#d1c4e9)",
                color: i < sel ? "#fff" : "#4527a0",
                cursor: locked ? "default" : "pointer",
                transform: i < sel ? "scale(0.95)" : "scale(1)",
                transition: "all 0.15s",
                opacity: locked ? 0.7 : 1,
              }}
            >
              {fmtRupee(n)}
            </button>
          ));
        })}
      </div>

      <div style={{ fontSize: 15, padding: "10px 16px", background: "#f5f5f5", borderRadius: 10, minWidth: 220, textAlign: "center" }}>
        Giving: <strong>₹{totalGiven.toLocaleString()}</strong>
        {totalGiven > 0 && totalGiven < price && (
          <span style={{ color: "#e53935", fontWeight: 600 }}> — need ₹{(price - totalGiven).toLocaleString()} more</span>
        )}
        {totalGiven === price && (
          <span style={{ color: "#43a047", fontWeight: 600 }}> ✓ Exact!</span>
        )}
        {totalGiven > price && (
          <span style={{ color: "#7c4dff", fontWeight: 600 }}> → change: ₹{changeAmt.toLocaleString()}</span>
        )}
      </div>

      {!locked && (
        <button
          className={styles.submitBtn}
          onClick={handlePay}
          disabled={totalGiven < price}
        >
          ✓ Pay!
        </button>
      )}

      {locked && (
        <div style={{ padding: "12px 20px", background: "#e8f5e9", borderRadius: 10, fontSize: 15, fontWeight: 600, color: "#2e7d32", textAlign: "center" }}>
          {result?.correct
            ? totalGiven === price
              ? "🎉 Perfect — exact amount!"
              : `🎉 Paid! Bank gives you ₹${changeAmt.toLocaleString()} change.`
            : "❌ Not quite — tap notes that total at least the price."}
        </div>
      )}
    </div>
  );
};

export default MonopolyNotePickerRenderer;
