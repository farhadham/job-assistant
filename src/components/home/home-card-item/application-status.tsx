import {
  getJobPostings,
  updateApplicationStatus,
} from "@/services/job-posting";
import { InferRequestType, InferResponseType } from "hono";
import { Select, SelectItem } from "@heroui/select";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleApiResponse } from "@/lib/api";
import { addToast } from "@heroui/toast";
import { JobPostingType } from "@/types";

type Props = {
  id: number;
  applicationStatus: Exclude<
    InferResponseType<
      typeof getJobPostings
    >["data"][number]["applicationStatus"],
    null
  >;
};

const statuses: { key: JobPostingType["applicationStatus"]; label: string }[] =
  [
    { key: "success", label: "Final talks!" },
    { key: "waiting", label: "Waiting for invitation" },
    { key: "invited", label: "Invited to interview" },
    { key: "fail", label: "Failed interview" },
  ];

export const ApplicationStatus = ({ applicationStatus, id }: Props) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (
      data: InferRequestType<typeof updateApplicationStatus>["json"]
    ) =>
      handleApiResponse(
        updateApplicationStatus({
          param: { id: id.toString() },
          json: data,
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job-postings"],
      });
      addToast({
        description: "Success",
        color: "success",
      });
    },
    onError: (error) => {
      addToast({
        description: error.message,
        color: "danger",
      });
    },
  });

  return (
    <Select
      className="max-w-xs"
      defaultSelectedKeys={[applicationStatus]}
      label="Application status"
      onChange={(event) =>
        mutate({
          applicationStatus: event.target.value as Exclude<
            JobPostingType["applicationStatus"],
            null
          >,
        })
      }
    >
      {statuses.map((status) => (
        <SelectItem key={status.key}>{status.label}</SelectItem>
      ))}
    </Select>
  );
};
