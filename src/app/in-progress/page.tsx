"use client";
import { handleApiResponse } from "@/lib/api";
import { getInProgressJobPostings } from "@/services/job-posting";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import { HomeItemCard } from "@/components/home/home-card-item";
import { Button } from "@heroui/button";
import { useEffect, useState } from "react";
import { jobPostingItemPerPage } from "@/data/constants";
import { Input } from "@heroui/input";

export default function AppliedPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());

      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["job-postings", "applied", page, debouncedSearchTerm],
    queryFn: () =>
      handleApiResponse(
        getInProgressJobPostings({
          query: { page: page.toString(), name: debouncedSearchTerm },
        })
      ),
    placeholderData: keepPreviousData,
  });

  if (isPending) return <Spinner />;

  if (isError) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="space-y-4">
      <h1>Jobs in progress</h1>

      <Input
        className="pt-4 w-1/2"
        label="Search by company"
        labelPlacement="outside"
        type="text"
        value={searchTerm}
        onValueChange={setSearchTerm}
        isRequired
        variant="bordered"
      />

      {data.data.length === 0 ? (
        <p className="text-center font-semibold text-2xl">
          No jobs found. Time to go scavenging!
        </p>
      ) : (
        <div className="space-y-8">
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
