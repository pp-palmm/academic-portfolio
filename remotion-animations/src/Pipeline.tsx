import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
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
  white: "#ffffff",
  blue: "#0071e3",
  blueFade: "rgba(0,113,227,0.10)",
};

const ease = Easing.bezier(0.16, 1, 0.3, 1);

function fadeUp(frame: number, start: number, fps: number) {
  return spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 120 } });
}

// A token chip that slides across the track
function Token({
  label,
  startFrame,
  trackWidth,
  frame,
  fps,
}: {
  label: string;
  startFrame: number;
  trackWidth: number;
  frame: number;
  fps: number;
}) {
  const chipW = 88;
  const travel = trackWidth + chipW + 80;
  const duration = 90;
  const localFrame = (frame - startFrame) % (duration + 40);
  const x = interpolate(localFrame, [0, duration], [-chipW - 20, travel], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
  const opacity = interpolate(localFrame, [0, 6, duration - 6, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (frame < startFrame) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        transform: `translate(${x}px, -50%)`,
        background: C.blue,
        color: C.white,
        borderRadius: 100,
        padding: "7px 16px",
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "'Outfit', sans-serif",
        whiteSpace: "nowrap",
        opacity,
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  );
}

const PHASES = [
  {
    label: "Pre-Generation",
    sub: "Model selection",
    active: true,
    badge: "This Research",
    icon: "⚡",
  },
  {
    label: "Generation",
    sub: "Output production",
    active: false,
    icon: "🤖",
  },
  {
    label: "Post-Generation",
    sub: "Verification & evaluation",
    active: false,
    icon: "✓",
  },
];

const TOKENS_DATA = [
  { label: "What is AI?", startFrame: 50 },
  { label: "Explain attention…", startFrame: 85 },
  { label: "How does GPT…", startFrame: 120 },
  { label: "Compare models…", startFrame: 70 },
  { label: "Why reasoning…", startFrame: 105 },
];

export const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const padH = 56;
  const padV = 48;
  const innerW = width - padH * 2;
  const phaseW = (innerW - 40) / 3; // 40 = 2 arrows × 20px

  // Track section sits below phases
  const trackTop = padV + 180 + 28;
  const trackH = 56;
  const trackW = innerW;

  return (
    <AbsoluteFill
      style={{
        background: C.white,
        fontFamily: "'Outfit', sans-serif",
        padding: `${padV}px ${padH}px`,
      }}
    >
      {/* ── Phases row ── */}
      <div style={{ display: "flex", alignItems: "stretch", gap: 0, height: 180 }}>
        {PHASES.map((phase, i) => {
          const p = fadeUp(frame, i * 10, fps);
          return (
            <React.Fragment key={i}>
              {/* Arrow connector */}
              {i > 0 && (
                <div
                  style={{
                    width: 20,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: interpolate(frame, [20 + i * 10, 35 + i * 10], [0, 1], {
                      extrapolateLeft: "clamp",
                      extrapolateRight: "clamp",
                    }),
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M2 9H16M10 3l6 6-6 6"
                      stroke={C.border}
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Phase card */}
              <div
                style={{
                  flex: 1,
                  background: phase.active ? C.nearBlack : C.bg,
                  borderRadius: 20,
                  padding: "24px 22px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  opacity: p,
                  transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Glow for active */}
                {phase.active && (
                  <div
                    style={{
                      position: "absolute",
                      top: -60,
                      left: -60,
                      width: 180,
                      height: 180,
                      background: `radial-gradient(circle, ${C.blue}22 0%, transparent 70%)`,
                      pointerEvents: "none",
                    }}
                  />
                )}
                {phase.badge && (
                  <div
                    style={{
                      display: "inline-block",
                      alignSelf: "flex-start",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      background: C.blue,
                      color: C.white,
                      padding: "4px 12px",
                      borderRadius: 100,
                      marginBottom: 12,
                      opacity: interpolate(frame, [20, 35], [0, 1], {
                        extrapolateLeft: "clamp",
                        extrapolateRight: "clamp",
                      }),
                    }}
                  >
                    {phase.badge}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: phase.active ? C.white : C.nearBlack,
                    marginBottom: 6,
                  }}
                >
                  {phase.label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: phase.active ? "rgba(255,255,255,0.5)" : C.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {phase.sub}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Track label row ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 16,
          marginBottom: 8,
          opacity: interpolate(frame, [40, 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>Query in</span>
        <span style={{ fontSize: 11, fontWeight: 500, color: C.muted }}>Output out</span>
      </div>

      {/* ── Token flow track ── */}
      <div
        style={{
          position: "relative",
          height: trackH,
          background: C.bg,
          borderRadius: 100,
          overflow: "hidden",
          opacity: interpolate(frame, [40, 55], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        {/* Phase zone highlights */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "33%",
            background: `linear-gradient(90deg, ${C.blue}18 0%, transparent 100%)`,
          }}
        />

        {TOKENS_DATA.map((t, i) => (
          <Token
            key={i}
            label={t.label}
            startFrame={t.startFrame}
            trackWidth={trackW}
            frame={frame}
            fps={fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
