import { z } from "zod";

export const jobPostingIdSchema = z.object({
  id: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().positive()),
});

export const createJobPostingRequestSchema = z.object({
  companyName: z.string().trim(),
  companyUrl: z.string().url().trim().optional(),
  location: z.string().trim(),
  title: z.string().trim(),
  jobDescription: z.string().trim(),
  platform: z.string().trim(),
  url: z.string().trim().url(),
  postingDate: z.string().datetime().optional(),
  recruiter: z.string().trim().optional(),
});
export type CreateJobPostingRequestType = z.infer<
  typeof createJobPostingRequestSchema
>;

export const jobPostingAiResultSchema = z.object({
  postingLanguage: z.string().min(1),
  relocationAvailable: z.boolean(),
  languageMatch: z.boolean(),
  keySkillsMatched: z.array(z.string()),
  keySkillsMissing: z.array(z.string()),
  suggestions: z.array(z.string()),
  overallMatch: z.number().int(),
});
export type JobPostingAiResultType = z.infer<typeof jobPostingAiResultSchema>;

export const updateApplicationStatusRequestSchema = z.object({
  applicationStatus: z.enum(["waiting", "fail", "invited", "success"]),
});
export type UpdateApplicationStatusRequestType = z.infer<
  typeof updateApplicationStatusRequestSchema
>;

export const getAppliedJobsQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().min(1)),
  name: z
    .string()
    .trim()
    .optional()
    .transform((val) => (val ? val : undefined)),
});
export type GetAppliedJobsQueryType = z.infer<typeof getAppliedJobsQuerySchema>;
