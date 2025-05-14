import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobPostingTable = sqliteTable("job_posting", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  location: text("location").notNull(),
  title: text("title").notNull(),
  platform: text("platform"),
  companyName: text("company_name").notNull(),
  companyUrl: text("company_url"),
  url: text("url").notNull().unique(),
  postingDate: text("posting_date"),
  recruiter: text("recruiter"),
  appliedAt: text("applied_at"),
  applicationStatus: text("application_status", {
    enum: ["waiting", "invited", "fail", "success"],
  }),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const jobPostingAnalyzeTable = sqliteTable(
  "job_posting_analyze",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    jobsPostingId: integer("jobs_posting_id")
      .references(() => jobPostingTable.id, { onDelete: "cascade" })
      .notNull(),
    postingLanguage: text("posting_language").notNull(),
    aiModel: text("ai_model").notNull(),
    relocationAvailable: integer("relocation_available", {
      mode: "boolean",
    }).notNull(),
    languageMatch: integer("language_match", { mode: "boolean" }).notNull(),
    keySkillsMatched: text("key_skills_matched", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default([]),
    keySkillsMissing: text("key_skills_missing", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default([]),
    suggestions: text("suggestions", { mode: "json" })
      .notNull()
      .$type<string[]>()
      .default([]),
    overallMatch: integer("overall_match").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("job_posting_id_idx").on(table.jobsPostingId)]
);

export const userTable = sqliteTable("user", {
  geminiKey: text("gemini_key").primaryKey(),
  resumeContent: text("resume_content"),
});
