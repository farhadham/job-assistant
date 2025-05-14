import { Hono } from "hono";
import { zValidator } from "../../(utils)";
import {
  createJobPostingRequestSchema,
  getAppliedJobsQuerySchema,
  jobPostingIdSchema,
  updateApplicationStatusRequestSchema,
} from "./validators";

import { getGeminiPredictResult } from "./controllers";
import {
  deleteJobPosting,
  insertJobPosting,
  selectAppliedJobPostings,
  selectInProgressJobPostings,
  selectJobPostingById,
  selectJobPostingByUrl,
  selectJobPostings,
  updateJobPostingApplicationStatus,
  updateJobPostingToApplied,
} from "./services";
import { selectUser } from "../user/services";

const app = new Hono().post(
  "/extension",
  zValidator("json", createJobPostingRequestSchema),
  async (c) => {
    const payload = c.req.valid("json");

    // Prevent duplicate job posting
    const duplicateJobPosting = await selectJobPostingByUrl(payload.url);
    if (duplicateJobPosting) {
      return c.json({ error: "Job posting already exist" }, 400);
    }

    // Getting Gemini key from fellow
    const selectedUser = await selectUser();
    if (!selectedUser) {
      return c.json({ error: "Your profile is not complete" }, 401);
    }
    if (!selectedUser.geminiKey) {
      return c.json({ error: "Gemini api key not found" }, 404);
    }
    if (!selectedUser.resumeContent) {
      return c.json({ error: "Resume content not found" }, 404);
    }

    const { jobDescription, ...payloadRest } = payload;

    // using Gemini
    const [aiResult, aiModel] = await getGeminiPredictResult(
      payloadRest.title,
      jobDescription,
      selectedUser.resumeContent,
      selectedUser.geminiKey
    );

    await insertJobPosting({ aiModel, aiResult, payload: payloadRest });

    return c.json({ message: "success" }, 201);
  }
);

const jobPostingRoute = app
  .get("/", zValidator("query", getAppliedJobsQuerySchema), async (c) => {
    const queries = c.req.valid("query");

    const selectedJobPostings = await selectJobPostings(queries);
    const selectedUser = await selectUser();

    return c.json({ data: selectedJobPostings, selectedUser }, 200);
  })
  .post("/", zValidator("json", createJobPostingRequestSchema), async (c) => {
    const payload = c.req.valid("json");

    // Prevent duplicate job posting
    const duplicateJobPosting = await selectJobPostingByUrl(payload.url);
    if (duplicateJobPosting) {
      return c.json({ error: "Job posting already exist" }, 400);
    }

    // Getting Gemini key from fellow
    const selectedFellow = await selectUser();
    if (!selectedFellow) {
      return c.json({ error: "Your profile is not complete" }, 401);
    }
    if (!selectedFellow.geminiKey) {
      return c.json({ error: "Gemini api key not found" }, 404);
    }
    if (!selectedFellow.resumeContent) {
      return c.json({ error: "Resume content not found" }, 404);
    }

    const { jobDescription, ...payloadRest } = payload;

    // using Gemini
    const [aiResult, aiModel] = await getGeminiPredictResult(
      payloadRest.title,
      jobDescription,
      selectedFellow.resumeContent,
      selectedFellow.geminiKey
    );

    await insertJobPosting({ aiModel, aiResult, payload: payloadRest });

    return c.json({ message: "success" }, 201);
  })
  .get(
    "/applied",
    zValidator("query", getAppliedJobsQuerySchema),
    async (c) => {
      const queries = c.req.valid("query");

      const selectedJobPostings = await selectAppliedJobPostings(queries);

      return c.json({ data: selectedJobPostings }, 200);
    }
  )
  .get(
    "/in-progress",
    zValidator("query", getAppliedJobsQuerySchema),
    async (c) => {
      const queries = c.req.valid("query");

      const selectedJobPostings = await selectInProgressJobPostings(queries);

      return c.json({ data: selectedJobPostings }, 200);
    }
  )
  .delete("/:id", zValidator("param", jobPostingIdSchema), async (c) => {
    const { id } = c.req.valid("param");

    const selectedJobPosting = await selectJobPostingById(id);

    if (!selectedJobPosting) {
      return c.json({ error: "Job posting doesn't exist" }, 404);
    }

    await deleteJobPosting(id);

    return c.json({ message: "Success" }, 200);
  })
  .patch("/:id/applied", zValidator("param", jobPostingIdSchema), async (c) => {
    const { id } = c.req.valid("param");

    const selectedJobPosting = await selectJobPostingById(id);
    if (!selectedJobPosting) {
      return c.json({ error: "Job posting doesn't exist" }, 404);
    }

    await updateJobPostingToApplied(id);

    return c.json({ message: "Success" }, 200);
  })
  .patch(
    "/:id/application-status",
    zValidator("param", jobPostingIdSchema),
    zValidator("json", updateApplicationStatusRequestSchema),
    async (c) => {
      const { id } = c.req.valid("param");

      const payload = c.req.valid("json");

      const selectedJobPosting = await selectJobPostingById(id);
      if (!selectedJobPosting) {
        return c.json({ error: "Job posting doesn't exist" }, 404);
      }

      await updateJobPostingApplicationStatus(id, payload);

      return c.json({ message: "Success" }, 200);
    }
  );

export default jobPostingRoute;
