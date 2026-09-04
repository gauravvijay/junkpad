import React, { useState } from "react";
import type { QuestionRendererProps } from "../types";
import styles from "./renderers.module.css";

interface NotePickerData {
  price: number;
  hand: number[];
  property: string;
  bankNotes?: number[];
}

const DENOM_LABELS: Record<number, string> = {
  10000: "₹10K",
  1000: "₹1K",
  500: "₹500",
  200: "₹200",
  100: "₹100",
  50: "₹50",
};

function fmt(n: number): string {
  return `₹${n.toLocaleString()}`;
}

function noteLabel(n: number): string {
  return DENOM_LABELS[n] ?? fmt(n);
}

function noteColor(n: number): { bg: string; border: string; text: string } {
  if (n >= 10000) return { bg: "linear-gradient(135deg,#1a237e,#3949ab)", border: "#1a237e", text: "#fff" };
  if (n >= 1000)  return { bg: "linear-gradient(135deg,#1b5e20,#388e3c)", border: "#1b5e20", text: "#fff" };
  return           { bg: "linear-gradient(135deg,#b71c1c,#e53935)", border: "#b71c1c", text: "#fff" };
}

const MonopolyNotePickerRenderer: React.FC<QuestionRendererProps> = ({ question, onAnswer, result }) => {
  const { price, hand, bankNotes = [10000, 1000, 500] } = question.data as unknown as NotePickerData;
  const locked = result?.answered;
  const isCorrect = result?.correct;

  // Giving: track which indices from `hand` are selected
  const [giveIndexes, setGiveIndexes] = useState<Set<number>>(new Set());
  // Receiving: count per denomination from bank
  const [receiveSelected, setReceiveSelected] = useState<Record<number, number>>({});

  const totalGive = hand.reduce((s, n, i) => s + (giveIndexes.has(i) ? n : 0), 0);
  const totalReceive = Object.entries(receiveSelected).reduce(
    (s, [d, c]) => s + Number(d) * c, 0
  );
  const netPayment = totalGive - totalReceive;
  const netMatchesPrice = netPayment === price;
  const canSubmit = totalGive >= price;

  const toggleGive = (idx: number) => {
    if (locked) return;
    setGiveIndexes(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const adjustReceive = (denom: number, delta: number) => {
    if (locked) return;
    setReceiveSelected(prev => {
      const cur = prev[denom] ?? 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [denom]: next };
    });
  };

  const handleSubmit = () => {
    if (canSubmit) onAnswer(netPayment);
  };

  return (
    <div className={styles.questionContainer}>

      {/* ── Section 1: Notes you give ── */}
      <div style={{
        background: "#f3e5f5", borderRadius: 12, padding: "12px 16px",
        border: "2px solid #ce93d8",
      }}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14, color: "#6a1b9a" }}>
          💜 Notes you give the bank
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666" }}>Tap a note to give it / tap again to take it back</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
          {hand.map((n, i) => {
            const sel = giveIndexes.has(i);
            const c = noteColor(n);
            return (
              <button
                key={i}
                onClick={() => toggleGive(i)}
                disabled={!!locked}
                style={{
                  padding: "10px 16px",
                  fontSize: 15, fontWeight: 700,
                  background: sel ? c.bg : "#ede7f6",
                  border: `2px solid ${sel ? c.border : "#ce93d8"}`,
                  borderRadius: 10,
                  color: sel ? c.text : "#6a1b9a",
                  cursor: locked ? "default" : "pointer",
                  transform: sel ? "scale(0.95)" : "scale(1)",
                  transition: "all 0.12s",
                  opacity: locked ? 0.75 : 1,
                  textDecoration: sel ? "none" : "none",
                  boxShadow: sel ? "0 2px 6px rgba(0,0,0,.25)" : "none",
                }}
              >
                {noteLabel(n)}
              </button>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
          Giving: <span style={{ color: "#6a1b9a" }}>{fmt(totalGive)}</span>
        </p>
      </div>

      {/* ── Section 2: Change you expect ── */}
      <div style={{
        background: "#e8f5e9", borderRadius: 12, padding: "12px 16px",
        border: "2px solid #81c784", marginTop: 8,
      }}>
        <p style={{ margin: "0 0 8px", fontWeight: 700, fontSize: 14, color: "#1b5e20" }}>
          💚 Change you expect back from the bank
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#666" }}>Use + / − to pick how many notes of each type</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {bankNotes.map(denom => {
            const count = receiveSelected[denom] ?? 0;
            const c = noteColor(denom);
            return (
              <div key={denom} style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                <span style={{
                  display: "inline-block", padding: "6px 14px",
                  background: c.bg, color: c.text,
                  borderRadius: 8, fontWeight: 700, fontSize: 14, minWidth: 60, textAlign: "center",
                }}>
                  {noteLabel(denom)}
                </span>
                <button
                  onClick={() => adjustReceive(denom, -1)}
                  disabled={!!locked || count === 0}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: "2px solid #81c784",
                    background: count === 0 ? "#f1f8e9" : "#c8e6c9", fontWeight: 700, fontSize: 18,
                    cursor: locked || count === 0 ? "default" : "pointer", lineHeight: 1,
                  }}
                >−</button>
                <span style={{ fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: "center" }}>{count}</span>
                <button
                  onClick={() => adjustReceive(denom, 1)}
                  disabled={!!locked}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: "2px solid #81c784",
                    background: "#c8e6c9", fontWeight: 700, fontSize: 18,
                    cursor: locked ? "default" : "pointer", lineHeight: 1,
                  }}
                >+</button>
                {count > 0 && (
                  <span style={{ fontSize: 13, color: "#555" }}>= {fmt(denom * count)}</span>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontWeight: 700, fontSize: 15, textAlign: "center" }}>
          Expecting back: <span style={{ color: "#1b5e20" }}>{fmt(totalReceive)}</span>
        </p>
      </div>

      {/* ── Net payment indicator ── */}
      <div style={{
        background: netMatchesPrice ? "#e8f5e9" : "#fff3e0",
        border: `2px solid ${netMatchesPrice ? "#81c784" : "#ffb74d"}`,
        borderRadius: 12, padding: "10px 16px", marginTop: 8, textAlign: "center",
      }}>
        <span style={{ fontSize: 14, color: "#555" }}>
          Net payment: {fmt(totalGive)} − {fmt(totalReceive)} = {" "}
        </span>
        <span style={{
          fontWeight: 700, fontSize: 16,
          color: netMatchesPrice ? "#1b5e20" : "#e65100",
        }}>
          {fmt(netPayment)}
        </span>
        {netMatchesPrice
          ? <span style={{ color: "#2e7d32", fontWeight: 700 }}> = {fmt(price)} ✓</span>
          : <span style={{ color: "#bf360c" }}> (should be {fmt(price)})</span>
        }
      </div>

      {!locked && (
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          ✓ Submit
        </button>
      )}
      {!canSubmit && !locked && totalGive > 0 && (
        <p style={{ textAlign: "center", fontSize: 13, color: "#e53935", margin: "4px 0 0" }}>
          Give at least {fmt(price)} to the bank
        </p>
      )}

      {locked && (
        <div style={{
          padding: "12px 20px", borderRadius: 10, fontSize: 15, fontWeight: 600,
          textAlign: "center",
          background: isCorrect ? "#e8f5e9" : "#ffebee",
          color: isCorrect ? "#2e7d32" : "#c62828",
          marginTop: 4,
        }}>
          {isCorrect
            ? `🎉 Correct! You gave ${fmt(totalGive)} and got ${fmt(totalReceive)} change — net ${fmt(netPayment)}.`
            : `❌ Net payment is ${fmt(netPayment)} but the price is ${fmt(price)}. Check your change!`}
        </div>
      )}
    </div>
  );
};

export default MonopolyNotePickerRenderer;
