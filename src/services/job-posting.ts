import { honoClientJobPosting } from "@/lib/api";

export const getJobPostings = honoClientJobPosting.index.$get;
export const getAppliedJobPostings = honoClientJobPosting.applied.$get;
export const getInProgressJobPostings =
  honoClientJobPosting["in-progress"].$get;
export const markJobPostingAsApplied =
  honoClientJobPosting[":id"].applied.$patch;
export const deleteJobPosting = honoClientJobPosting[":id"].$delete;
export const updateApplicationStatus =
  honoClientJobPosting[":id"]["application-status"].$patch;
export const createJobPosting = honoClientJobPosting.index.$post;
