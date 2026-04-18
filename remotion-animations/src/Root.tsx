import React from "react";
import { Composition } from "remotion";
import { Pipeline } from "./Pipeline";
import { ResearchFlow, RESEARCH_FLOW_DURATION } from "./ResearchFlow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/*
        Animation 1: LLM Pipeline
        Shows pre-generation → generation → post-generation phases
        with tokens flowing through the pipeline.
        6 seconds at 30fps = 180 frames.
      */}
      <Composition
        id="Pipeline"
        component={Pipeline}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={380}
      />

      {/*
        Animation 2: Three-Stage Research Flow
        Stage 1: Behavioral & Bias Analysis
        Stage 2: Query Complexity Estimation
        Stage 3: Agentic Model Routing
        11 seconds at 30fps = 330 frames.
      */}
      <Composition
        id="ResearchFlow"
        component={ResearchFlow}
        durationInFrames={RESEARCH_FLOW_DURATION}
        fps={30}
        width={1080}
        height={680}
      />
    </>
  );
};
