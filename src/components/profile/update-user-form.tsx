import { handleApiResponse } from "@/lib/api";
import { getUserProfile, updateUser } from "@/services/user";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useState } from "react";

import { z } from "zod";

type Props = {
  data: InferResponseType<typeof getUserProfile, 200>;
};

const formSchema = z.object({
  resumeContent: z.string().min(1500).max(5000),
  geminiKey: z.string().min(10),
});

export const UpdateUserForm = ({ data }: Props) => {
  const queryClient = useQueryClient();

  const [errors, setErrors] = useState({});

  const { isPending, mutate } = useMutation({
    mutationFn: (values: InferRequestType<typeof updateUser>["json"]) =>
      handleApiResponse(updateUser({ json: values })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fellow-profile"] });
      addToast({
        description: "Your data is successfully updated",
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parseResult = formSchema.safeParse(data);

    if (!parseResult.success) {
      setErrors(parseResult.error.flatten().fieldErrors);
      return;
    }

    mutate(parseResult.data);
  };

  return (
    <Form className="mt-16" validationErrors={errors} onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4 w-full">
        <Input
          name="geminiKey"
          defaultValue={data.geminiKey ?? ""}
          labelPlacement="outside"
          description={
            <>
              In order to use AI for analyzing the job description, you have to
              get a Gemini api key from{" "}
              <Link href="https://aistudio.google.com/" size="sm">
                Google
              </Link>
            </>
          }
          label="Gemini api key"
          type="text"
          isRequired
          variant="bordered"
        />
        <Textarea
          className="col-span-2"
          name="resumeContent"
          defaultValue={data.resumeContent ?? ""}
          labelPlacement="outside"
          label="Resume content"
          placeholder="Your resume content between 1500 to 5000 characters"
          type="text"
          isRequired
          variant="bordered"
        />
      </div>
      <Button
        color="primary"
        type="submit"
        isLoading={isPending}
        className="mt-4"
      >
        Save
      </Button>
    </Form>
  );
};
