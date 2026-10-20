import type { ClipPlanInput } from "../schemas/clip.schemas.js";
interface ClipPart {
    part: number;
    start: number;
    end: number;
    duration: number;
}
interface ClipPlan extends ClipPlanInput {
    totalClips: number;
    clips: ClipPart[];
}
export declare function createClipPlan(input: ClipPlanInput): ClipPlan;
export {};
//# sourceMappingURL=clip.service.d.ts.map