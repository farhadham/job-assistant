import jobPostingRoute from "@/app/api/(routes)/job-posting";
import userRoute from "@/app/api/(routes)/user";
import { APIErrorResponseType } from "@/types";
import { ClientResponse, hc } from "hono/client";

const apiPrefix = "/api";

export const honoClientJobPosting = hc<typeof jobPostingRoute>(
  `${apiPrefix}/job-posting`
);
export const honoClientUser = hc<typeof userRoute>(`${apiPrefix}/user`);

export async function handleApiResponse<T>(
  requestPromise: Promise<ClientResponse<T | APIErrorResponseType>>
): Promise<T> {
  try {
    const res = await requestPromise;

    if (!res.ok) {
      const errorData = (await res.json()) as APIErrorResponseType;
      throw new Error(errorData.error || "Unknown error occurred");
    }

    return res.json() as T;
  } catch (error) {
    // Handle network or other unexpected errors
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}

export async function handleBlobResponse(
  requestPromise: Promise<ClientResponse<object | APIErrorResponseType>>
): Promise<string> {
  try {
    const res = await requestPromise;

    if (!res.ok) {
      const errorData = (await res.json()) as APIErrorResponseType;
      throw new Error(errorData.error || "Unknown error occurred");
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
  }
}
