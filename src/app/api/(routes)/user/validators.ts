import { z } from "zod";

export const updateUserRequestSchema = z.object({
  resumeContent: z.string().min(1500).max(5000),
  geminiKey: z.string().min(10),
});
export type UpdateUserRequestType = z.infer<typeof updateUserRequestSchema>;
