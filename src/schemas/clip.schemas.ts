import {z} from "zod";

export const clipPlanSchema = z.object({
  totalDuration: z.number().min(1, {message: "Total duration must be at least 1 second."}),
  clipDuration: z.coerce.number().min(1, {
  message: "Clip duration must be at least 1 second."
}), // z.coerce.number() "I only accept an actual JavaScript number."
});

export type ClipPlanInput = z.infer<typeof clipPlanSchema>;


// Instead of creating the same type manually:

// interface ClipPlanInput {
//   totalDuration: number;
//   clipDuration: number;
// }

// Zod can generate the TypeScript type from the schema.
// Schema specifically for /process
export const processVideoSchema = z.object({
  clipDuration: z.coerce.number().min(1, {
    message: "Clip duration must be at least 1 second.",
  }),
   youtubeUrl: z.string().url().optional(),
});

export type ProcessVideoInput = z.infer<typeof processVideoSchema>;