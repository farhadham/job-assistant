import {
  fellowTable,
  jobPostingAnalyzeTable,
  jobPostingTable,
} from "@/database/schema";
import { InferSelectModel } from "drizzle-orm";

// Error message sent by the RPC endpoint
export type APIErrorResponseType = {
  error: string;
};

export type FellowType = InferSelectModel<typeof fellowTable>;
export type JobPostingType = InferSelectModel<typeof jobPostingTable>;
export type JobPostingAnalyzeType = InferSelectModel<
  typeof jobPostingAnalyzeTable
>;
