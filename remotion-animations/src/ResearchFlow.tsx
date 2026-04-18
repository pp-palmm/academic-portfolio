import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";

loadOutfit();
loadInstrumentSerif();

const C = {
  nearBlack: "#111111",
  mid: "#3a3a3c",
  muted: "#6e6e73",
  border: "#d2d2d7",
  bg: "#f5f5f7",
  bgDark: "#ebebef",
  white: "#ffffff",
  blue: "#0071e3",
  blueFade: "rgba(0,113,227,0.08)",
  blueBorder: "rgba(0,113,227,0.20)",
  greenFade: "rgba(52,199,89,0.08)",
  greenBorder: "rgba(52,199,89,0.22)",
  green: "#34c759",
};

function spr(frame: number, start: number, fps: number, damping = 18, stiffness = 120) {
  return spring({ frame: frame - start, fps, config: { damping, stiffness } });
}

function fadeIn(frame: number, start: number, dur = 10) {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function StageLabel({ num, color }: { num: string; color?: string }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: color ?? C.blue,
        marginBottom: 10,
      }}
    >
      {num}
    </div>
  );
}

function StageBadge({
  label,
  frame,
  start,
  fps,
}: {
  label: string;
  frame: number;
  start: number;
  fps: number;
}) {
  const p = spr(frame, start, fps);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [20, 0])}px)`,
        fontSize: 22,
        fontFamily: "'Instrument Serif', serif",
        fontWeight: 400,
        color: C.nearBlack,
        marginBottom: 24,
        lineHeight: 1.25,
      }}
    >
      {label}
    </div>
  );
}

function ConnectorArrow({ frame, start, fps }: { frame: number; start: number; fps: number }) {
  const p = fadeIn(frame, start, 12);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        opacity: p,
        margin: "16px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 2v12M2 8l6 6 6-6"
          stroke={C.muted}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

// ── Stage 1: Behavioral & Bias Analysis ──────────────────────────────────────

const BIASES = [
  { label: "Over-elaboration bias", model: "Reasoning", side: "left" },
  { label: "Positional bias", model: "Both", side: "both" },
  { label: "Self-reinforcement bias", model: "Reasoning", side: "left" },
  { label: "Conciseness advantage", model: "Non-Reasoning", side: "right" },
];

function Stage1({ frame, fps }: { frame: number; fps: number }) {
  const cardP = spr(frame, 0, fps);

  return (
    <div style={{ opacity: fadeIn(frame, 0) }}>
      <StageLabel num="Stage 1" />
      <StageBadge label={"Behavioral &\nBias Analysis"} frame={frame} start={4} fps={fps} />

      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        {/* Reasoning Model card */}
        {[
          {
            title: "Reasoning Model",
            sub: "Think → then respond",
            color: C.blue,
            bg: C.blueFade,
            border: C.blueBorder,
            traits: ["Deep inference", "More tokens", "May over-elaborate"],
          },
          {
            title: "Non-Reasoning Model",
            sub: "Respond directly",
            color: C.muted,
            bg: C.bg,
            border: C.border,
            traits: ["Fast response", "Concise output", "Optimal for simple tasks"],
          },
        ].map((m, mi) => {
          const mp = spr(frame, 8 + mi * 8, fps);
          return (
            <div
              key={mi}
              style={{
                flex: 1,
                background: m.bg,
                border: `1px solid ${m.border}`,
                borderRadius: 14,
                padding: "16px 18px",
                opacity: mp,
                transform: `translateY(${interpolate(mp, [0, 1], [16, 0])}px)`,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: m.color, marginBottom: 4 }}>
                {m.title}
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 12 }}>{m.sub}</div>
              {m.traits.map((t, ti) => {
                const tp = fadeIn(frame, 20 + mi * 10 + ti * 6);
                return (
                  <div
                    key={ti}
                    style={{
                      fontSize: 11,
                      color: C.mid,
                      padding: "4px 0",
                      opacity: tp,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span style={{ color: m.color, fontWeight: 700 }}>·</span>
                    {t}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Bias findings */}
      <div
        style={{
          background: C.bg,
          borderRadius: 12,
          padding: "12px 16px",
          opacity: fadeIn(frame, 50),
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Bias Findings
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {BIASES.map((b, bi) => (
            <div
              key={bi}
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: b.side === "left" ? C.blue : b.side === "right" ? C.mid : C.muted,
                background: b.side === "left" ? C.blueFade : C.bgDark,
                border: `1px solid ${b.side === "left" ? C.blueBorder : C.border}`,
                borderRadius: 100,
                padding: "4px 10px",
                opacity: fadeIn(frame, 55 + bi * 8),
              }}
            >
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Stage 2: Query Complexity Estimation ──────────────────────────────────────

const QUERIES = [
  {
    text: "What is GDP?",
    score: 0.12,
    label: "Low",
    color: C.green,
    bg: C.greenFade,
    border: C.greenBorder,
    model: "Non-Reasoning",
  },
  {
    text: "How do transformer attention mechanisms relate to biological neural processing?",
    score: 0.89,
    label: "High",
    color: C.blue,
    bg: C.blueFade,
    border: C.blueBorder,
    model: "Reasoning",
  },
  {
    text: "List three capital cities.",
    score: 0.08,
    label: "Low",
    color: C.green,
    bg: C.greenFade,
    border: C.greenBorder,
    model: "Non-Reasoning",
  },
];

function ComplexityBar({ score, color, frame, startFrame }: { score: number; color: string; frame: number; startFrame: number }) {
  const barW = interpolate(frame, [startFrame, startFrame + 20], [0, score], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: C.bgDark, borderRadius: 100, overflow: "hidden" }}>
        <div
          style={{
            width: `${barW * 100}%`,
            height: "100%",
            background: color,
            borderRadius: 100,
          }}
        />
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, color, width: 28, textAlign: "right" }}>
        {(score * 100).toFixed(0)}%
      </div>
    </div>
  );
}

function Stage2({ frame, fps }: { frame: number; fps: number }) {
  return (
    <div style={{ opacity: fadeIn(frame, 0) }}>
      <StageLabel num="Stage 2" />
      <StageBadge label={"Query Complexity\nEstimation"} frame={frame} start={4} fps={fps} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {QUERIES.map((q, qi) => {
          const qp = spr(frame, 8 + qi * 12, fps);
          return (
            <div
              key={qi}
              style={{
                background: q.bg,
                border: `1px solid ${q.border}`,
                borderRadius: 12,
                padding: "12px 16px",
                opacity: qp,
                transform: `translateX(${interpolate(qp, [0, 1], [-16, 0])}px)`,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: C.mid,
                  marginBottom: 8,
                  lineHeight: 1.4,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                "{q.text}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <ComplexityBar
                    score={q.score}
                    color={q.color}
                    frame={frame}
                    startFrame={16 + qi * 12}
                  />
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: q.color,
                    background: q.border,
                    borderRadius: 100,
                    padding: "3px 10px",
                    whiteSpace: "nowrap",
                  }}
                >
                  → {q.model}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          fontSize: 11,
          color: C.muted,
          fontStyle: "italic",
          marginTop: 12,
          opacity: fadeIn(frame, 48),
        }}
      >
        Signal derived from semantic complexity, syntax structure &amp; sub-question decomposition
      </div>
    </div>
  );
}

// ── Stage 3: Agentic Model Routing ───────────────────────────────────────────

function Stage3({ frame, fps }: { frame: number; fps: number }) {
  const agentP = spr(frame, 4, fps);
  const queryP = spr(frame, 10, fps);
  const arrowP = fadeIn(frame, 22, 10);
  const model1P = spr(frame, 28, fps);
  const model2P = spr(frame, 36, fps);
  const outputP = spr(frame, 50, fps);

  return (
    <div style={{ opacity: fadeIn(frame, 0) }}>
      <StageLabel num="Stage 3" />
      <StageBadge label={"Agentic Model\nRouting"} frame={frame} start={4} fps={fps} />

      {/* Row: query → agent → models */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        {/* Incoming query */}
        <div
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 14px",
            opacity: queryP,
            transform: `translateX(${interpolate(queryP, [0, 1], [-14, 0])}px)`,
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 3 }}>Query</div>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.nearBlack }}>Any request</div>
        </div>

        {/* Arrow */}
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ opacity: arrowP, flexShrink: 0 }}>
          <path d="M0 6h18M12 0l6 6-6 6" stroke={C.border} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Routing agent */}
        <div
          style={{
            flex: 1,
            background: C.nearBlack,
            borderRadius: 14,
            padding: "14px 16px",
            opacity: agentP,
            transform: `scale(${interpolate(agentP, [0, 1], [0.92, 1])})`,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: C.white, marginBottom: 4 }}>
            Routing Agent
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            complexity score · bias profile
          </div>
        </div>

        {/* Arrow */}
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ opacity: arrowP, flexShrink: 0 }}>
          <path d="M0 6h18M12 0l6 6-6 6" stroke={C.border} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Models */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <div
            style={{
              background: C.blueFade,
              border: `1px solid ${C.blueBorder}`,
              borderRadius: 10,
              padding: "8px 14px",
              opacity: model1P,
              transform: `translateX(${interpolate(model1P, [0, 1], [14, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: C.blue }}>Reasoning Model</div>
            <div style={{ fontSize: 10, color: C.muted }}>High complexity</div>
          </div>
          <div
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: "8px 14px",
              opacity: model2P,
              transform: `translateX(${interpolate(model2P, [0, 1], [14, 0])}px)`,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: C.mid }}>Non-Reasoning Model</div>
            <div style={{ fontSize: 10, color: C.muted }}>Low complexity</div>
          </div>
        </div>
      </div>

      {/* Outcome row */}
      <div
        style={{
          background: C.bg,
          borderRadius: 12,
          padding: "12px 16px",
          opacity: outputP,
          transform: `translateY(${interpolate(outputP, [0, 1], [12, 0])}px)`,
          display: "flex",
          gap: 16,
        }}
      >
        {[
          { icon: "↓", text: "Reduced output bias" },
          { icon: "↓", text: "Lower inference cost" },
          { icon: "↑", text: "Output quality" },
          { icon: "✓", text: "Transparent & auditable" },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              textAlign: "center",
              opacity: fadeIn(frame, 54 + i * 6),
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: i < 2 ? C.green : C.blue }}>
              {item.icon}
            </div>
            <div style={{ fontSize: 10, color: C.mid, lineHeight: 1.4 }}>{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Root Composition ──────────────────────────────────────────────────────────

// Timing constants (frames at 30fps)
const S1_START = 0;    // 0s  — Stage 1 begins
const S1_DUR = 120;    // 4s  — Stage 1 visible
const CONN1 = 110;     // frame connector 1→2 appears
const S2_START = 120;  // 4s  — Stage 2 begins
const S2_DUR = 120;    // 4s
const CONN2 = 230;     // frame connector 2→3 appears
const S3_START = 240;  // 8s  — Stage 3 begins
const S3_DUR = 90;     // 3s

export const RESEARCH_FLOW_DURATION = S3_START + S3_DUR; // 330 frames = 11s

export const ResearchFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        fontFamily: "'Outfit', sans-serif",
        padding: "40px 56px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: fadeIn(frame, 0, 14),
          transform: `translateY(${interpolate(frame, [0, 14], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          marginBottom: 28,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: C.muted, marginBottom: 6 }}>
          Research Plan
        </div>
        <div style={{ fontSize: 26, fontFamily: "'Instrument Serif', serif", color: C.nearBlack, lineHeight: 1.2 }}>
          Three-Stage Framework
        </div>
      </div>

      {/* Stages container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Stage 1 */}
        <Sequence from={S1_START} durationInFrames={S1_DUR + S2_DUR + S3_DUR + 20}>
          <Stage1 frame={frame - S1_START} fps={fps} />
        </Sequence>

        {/* Connector 1 → 2 */}
        <ConnectorArrow frame={frame} start={CONN1} fps={fps} />

        {/* Stage 2 */}
        <Sequence from={S2_START} durationInFrames={S2_DUR + S3_DUR + 20}>
          <Stage2 frame={frame - S2_START} fps={fps} />
        </Sequence>

        {/* Connector 2 → 3 */}
        <ConnectorArrow frame={frame} start={CONN2} fps={fps} />

        {/* Stage 3 */}
        <Sequence from={S3_START} durationInFrames={S3_DUR + 10}>
          <Stage3 frame={frame - S3_START} fps={fps} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};
