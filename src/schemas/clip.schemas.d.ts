import { z } from "zod";
export declare const clipPlanSchema: z.ZodObject<{
    totalDuration: z.ZodNumber;
    clipDuration: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type ClipPlanInput = z.infer<typeof clipPlanSchema>;
export declare const processVideoSchema: z.ZodObject<{
    clipDuration: z.ZodCoercedNumber<unknown>;
    youtubeUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ProcessVideoInput = z.infer<typeof processVideoSchema>;
//# sourceMappingURL=clip.schemas.d.ts.map