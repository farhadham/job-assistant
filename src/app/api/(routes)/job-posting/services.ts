import { db } from "@/database";
import {
  GetAppliedJobsQueryType,
  JobPostingAiResultType,
  UpdateApplicationStatusRequestType,
  type CreateJobPostingRequestType,
} from "./validators";
import { desc, eq, inArray, isNotNull, isNull } from "drizzle-orm";
import { jobPostingAnalyzeTable, jobPostingTable } from "@/database/schema";
import { jobPostingItemPerPage } from "@/data/constants";

type InsertJobPostingType = {
  payload: Omit<CreateJobPostingRequestType, "jobDescription">;
  aiResult: JobPostingAiResultType;
  aiModel: string;
};

export const selectJobPostingByUrl = async (url: string) => {
  return db
    .select({ id: jobPostingTable.id })
    .from(jobPostingTable)
    .where(eq(jobPostingTable.url, url))
    .then((rows) => rows.at(0));
};

export const insertJobPosting = async ({
  payload,
  aiModel,
  aiResult,
}: InsertJobPostingType) => {
  const { postingDate, ...payloadRest } = payload;

  return db.transaction(async (tx) => {
    const insertedJobPosting = await tx
      .insert(jobPostingTable)
      .values({
        ...payloadRest,
        postingDate: postingDate,
      })
      .returning({ id: jobPostingTable.id })
      .then((rows) => rows.at(0));

    if (!insertedJobPosting)
      throw new Error(`Failed to insert new job posting`);

    await tx
      .insert(jobPostingAnalyzeTable)
      .values({ ...aiResult, aiModel, jobsPostingId: insertedJobPosting.id });
  });
};

export const selectJobPostings = async (queries: GetAppliedJobsQueryType) => {
  return db
    .select({
      appliedAt: jobPostingTable.appliedAt,
      companyUrl: jobPostingTable.companyUrl,
      companyName: jobPostingTable.companyName,
      id: jobPostingTable.id,
      location: jobPostingTable.location,
      platform: jobPostingTable.platform,
      postingDate: jobPostingTable.postingDate,
      recruiter: jobPostingTable.recruiter,
      title: jobPostingTable.title,
      url: jobPostingTable.url,
      keySkillsMatched: jobPostingAnalyzeTable.keySkillsMatched,
      keySkillsMissing: jobPostingAnalyzeTable.keySkillsMissing,
      languageMatch: jobPostingAnalyzeTable.languageMatch,
      overallMatch: jobPostingAnalyzeTable.overallMatch,
      postingLanguage: jobPostingAnalyzeTable.postingLanguage,
      relocationAvailable: jobPostingAnalyzeTable.relocationAvailable,
      suggestions: jobPostingAnalyzeTable.suggestions,
      applicationStatus: jobPostingTable.applicationStatus,
    })
    .from(jobPostingTable)
    .where(isNull(jobPostingTable.appliedAt))
    .innerJoin(
      jobPostingAnalyzeTable,
      eq(jobPostingAnalyzeTable.jobsPostingId, jobPostingTable.id)
    )
    .limit(jobPostingItemPerPage)
    .offset(jobPostingItemPerPage * (queries.page - 1))
    .orderBy(desc(jobPostingTable.createdAt));
};

export const selectAppliedJobPostings = async (
  queries: GetAppliedJobsQueryType
) => {
  return db
    .select({
      appliedAt: jobPostingTable.appliedAt,
      companyUrl: jobPostingTable.companyUrl,
      companyName: jobPostingTable.companyName,
      id: jobPostingTable.id,
      location: jobPostingTable.location,
      platform: jobPostingTable.platform,
      postingDate: jobPostingTable.postingDate,
      recruiter: jobPostingTable.recruiter,
      title: jobPostingTable.title,
      url: jobPostingTable.url,
      keySkillsMatched: jobPostingAnalyzeTable.keySkillsMatched,
      keySkillsMissing: jobPostingAnalyzeTable.keySkillsMissing,
      languageMatch: jobPostingAnalyzeTable.languageMatch,
      overallMatch: jobPostingAnalyzeTable.overallMatch,
      postingLanguage: jobPostingAnalyzeTable.postingLanguage,
      relocationAvailable: jobPostingAnalyzeTable.relocationAvailable,
      suggestions: jobPostingAnalyzeTable.suggestions,
      applicationStatus: jobPostingTable.applicationStatus,
    })
    .from(jobPostingTable)
    .where(isNotNull(jobPostingTable.appliedAt))
    .innerJoin(
      jobPostingAnalyzeTable,
      eq(jobPostingAnalyzeTable.jobsPostingId, jobPostingTable.id)
    )
    .limit(jobPostingItemPerPage)
    .offset(jobPostingItemPerPage * (queries.page - 1))
    .orderBy(desc(jobPostingTable.createdAt));
};

export const selectInProgressJobPostings = async (
  queries: GetAppliedJobsQueryType
) => {
  return db
    .select({
      appliedAt: jobPostingTable.appliedAt,
      companyUrl: jobPostingTable.companyUrl,
      companyName: jobPostingTable.companyName,
      id: jobPostingTable.id,
      location: jobPostingTable.location,
      platform: jobPostingTable.platform,
      postingDate: jobPostingTable.postingDate,
      recruiter: jobPostingTable.recruiter,
      title: jobPostingTable.title,
      url: jobPostingTable.url,
      keySkillsMatched: jobPostingAnalyzeTable.keySkillsMatched,
      keySkillsMissing: jobPostingAnalyzeTable.keySkillsMissing,
      languageMatch: jobPostingAnalyzeTable.languageMatch,
      overallMatch: jobPostingAnalyzeTable.overallMatch,
      postingLanguage: jobPostingAnalyzeTable.postingLanguage,
      relocationAvailable: jobPostingAnalyzeTable.relocationAvailable,
      suggestions: jobPostingAnalyzeTable.suggestions,
      applicationStatus: jobPostingTable.applicationStatus,
    })
    .from(jobPostingTable)
    .where(inArray(jobPostingTable.applicationStatus, ["invited", "success"]))
    .innerJoin(
      jobPostingAnalyzeTable,
      eq(jobPostingAnalyzeTable.jobsPostingId, jobPostingTable.id)
    )
    .limit(jobPostingItemPerPage)
    .offset(jobPostingItemPerPage * (queries.page - 1))
    .orderBy(desc(jobPostingTable.createdAt));
};

export const selectJobPostingById = async (id: number) => {
  return db
    .select({ id: jobPostingTable.id })
    .from(jobPostingTable)
    .where(eq(jobPostingTable.id, id))
    .then((rows) => rows.at(0));
};

export const updateJobPostingToApplied = (id: number) => {
  return db
    .update(jobPostingTable)
    .set({ appliedAt: new Date().toISOString(), applicationStatus: "waiting" })
    .where(eq(jobPostingTable.id, id));
};

export const updateJobPostingApplicationStatus = (
  id: number,
  payload: UpdateApplicationStatusRequestType
) => {
  return db
    .update(jobPostingTable)
    .set(payload)
    .where(eq(jobPostingTable.id, id));
};

export const deleteJobPosting = (id: number) => {
  return db.delete(jobPostingTable).where(eq(jobPostingTable.id, id));
};
