"use client";

import { handleApiResponse } from "@/lib/api";
import { getJobPostings } from "@/services/job-posting";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import { HomeItemCard } from "@/components/home/home-card-item";
import { useState } from "react";
import { Button } from "@heroui/button";
import { jobPostingItemPerPage } from "@/data/constants";

export default function HomePage() {
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["job-postings", "not-applied", page],
    queryFn: () =>
      handleApiResponse(getJobPostings({ query: { page: page.toString() } })),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <Spinner />;

  if (isError) return <p className="text-red-500">{error.message}</p>;

  if (!data.selectedUser) {
    return (
      <h1 className="text-3xl">
        Please set your profile before searching for jobs
      </h1>
    );
  }

  return (
    <div className="space-y-4">
      <h1>New jobs</h1>
      {data.data.length === 0 ? (
        <p className="text-center font-semibold text-2xl">
          No jobs found. Time to go scavenging!
        </p>
      ) : (
        <div className="space-y-12">
          {data.data.map((item) => (
            <HomeItemCard key={item.id} data={item} />
          ))}
        </div>
      )}
      <div className="flex items-center gap-4 mx-auto justify-center">
        <Button
          onPress={() => {
            if (page > 1) {
              setPage((prev) => prev - 1);
            }
          }}
          color="primary"
          size="sm"
        >
          Previous page
        </Button>
        <Button
          onPress={() => {
            if (data.data.length === jobPostingItemPerPage) {
              setPage((prev) => prev + 1);
            }
          }}
          color="primary"
          size="sm"
        >
          Next page
        </Button>
      </div>
    </div>
  );
}
