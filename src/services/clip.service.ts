import type { ClipPlanInput } from "../schemas/clip.schemas.js";

interface ClipPart{
  part:number,
  start:number,
  end:number,
  duration:number
}

interface ClipPlan extends ClipPlanInput{
  totalClips:number,
  clips:ClipPart[]
}

export function createClipPlan(input: ClipPlanInput): ClipPlan {
  const { totalDuration, clipDuration } = input;

  const totalClips = Math.ceil(totalDuration / clipDuration);

  const clips: ClipPart[] = [];

  for (let part = 0; part < totalClips; part++) {
    const start = part * clipDuration;

    const end = Math.min(
      start + clipDuration,
      totalDuration
    );

    const duration = end - start;

    clips.push({
      part: part + 1,
      start,
      end,
      duration
    });
  }

  return {
    ...input,
    totalClips,
    clips
  };
}
