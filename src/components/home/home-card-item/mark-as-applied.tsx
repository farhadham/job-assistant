import { handleApiResponse } from "@/lib/api";
import { markJobPostingAsApplied } from "@/services/job-posting";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import { addToast } from "@heroui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  id: number;
};

export const MarkAsApplied = ({ id }: Props) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: () =>
      handleApiResponse(
        markJobPostingAsApplied({ param: { id: id.toString() } })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["job-postings"],
      });
      addToast({
        description: "Success",
        color: "success",
      });
      onClose();
    },
    onError: (error) => {
      addToast({
        description: error.message,
        color: "danger",
      });
    },
  });

  const handleMarkAsApply = () => mutate();

  return (
    <>
      <Button variant="flat" onPress={onOpen}>
        Mark as applied
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mark this job as applied
              </ModalHeader>
              <ModalBody>
                This means the coaches will know about your application and they
                will recommend you to the company
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} isLoading={isPending}>
                  Close
                </Button>
                <Button
                  color="primary"
                  isLoading={isPending}
                  onPress={handleMarkAsApply}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
