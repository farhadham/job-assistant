"use client";
import { handleApiResponse } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@heroui/spinner";
import { getUserProfile } from "@/services/user";
import { UpdateUserForm } from "@/components/profile/update-user-form";

export default function ProfilePage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["fellow-profile"],
    queryFn: () => handleApiResponse(getUserProfile()),
  });

  if (isPending) return <Spinner />;

  if (isError) return <p className="text-red-500">{error.message}</p>;

  return <UpdateUserForm data={data} />;
}
