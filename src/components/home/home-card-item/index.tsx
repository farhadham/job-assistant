"use client";
import { InferResponseType } from "hono";
import { format, formatDistanceToNow } from "date-fns";
import { Check, X, MoveRight } from "lucide-react";
import { Card } from "@heroui/card";
import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { getJobPostings } from "@/services/job-posting";
import { DeleteDialog } from "../delete";
import { ApplicationStatus } from "./application-status";
import { MarkAsApplied } from "./mark-as-applied";

export const HomeItemCard = ({
  data,
}: {
  data: InferResponseType<typeof getJobPostings>["data"][number];
}) => {
  const {
    keySkillsMatched,
    keySkillsMissing,
    languageMatch,
    overallMatch,
    postingLanguage,
    relocationAvailable,
    suggestions,
    appliedAt,
    companyUrl,
    companyName,
    id,
    location,
    platform,
    postingDate,
    recruiter,
    title,
    url,
    applicationStatus,
  } = data;

  return (
    <Card className="border-1 border-divider" shadow="md">
      <div className="p-4 flex gap-8 items-start">
        <div className="flex-1 items-start">
          <p className="text-xl">{title}</p>
          <div className="flex gap-2 items-center">
            {postingDate ? (
              <p>Posted {formatDistanceToNow(new Date(postingDate))} ago</p>
            ) : null}
            <Chip color="primary" size="sm">
              {platform}
            </Chip>
          </div>
          <Chip
            color={
              overallMatch >= 80
                ? "success"
                : overallMatch >= 50
                ? "warning"
                : "danger"
            }
            size="lg"
          >
            {overallMatch}% match
          </Chip>
        </div>

        <div className="flex flex-col flex-1 items-start">
          <div className="flex gap-2">
            <div>{location}</div>
            <Chip color={relocationAvailable ? "success" : "danger"} size="sm">
              Foreigners {relocationAvailable ? "accepted" : "not accepted"}
            </Chip>
          </div>
          <p className="text-muted-foreground">
            Post language{" "}
            <span className="font-semibold">{postingLanguage}</span>
          </p>
          <p>
            Languages sufficiency{" "}
            {languageMatch ? (
              <Check className="inline-block text-success-500" size={18} />
            ) : (
              <X className="inline-block text-red-400" size={18} />
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xl font-semibold capitalize">{companyName}</div>
          <div className="flex items-center gap-2">
            {recruiter ? (
              <a target="_blank" rel="noopener noreferrer" href={recruiter}>
                <Button size="sm">Recruiter</Button>
              </a>
            ) : null}
            {companyUrl ? (
              <a target="_blank" rel="noopener noreferrer" href={companyUrl}>
                <Button size="sm" color="primary">
                  LinkedIn
                </Button>
              </a>
            ) : null}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="flex gap-4">
            <div className="flex">Matched skills</div>
            <div className="flex flex-wrap gap-2">
              {keySkillsMatched.map((item) => (
                <Chip key={item} color="success" size="sm">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex">Missing skills</div>
            <div className="flex flex-wrap gap-2">
              {keySkillsMissing.map((item) => (
                <Chip key={item} color="warning" size="sm">
                  {item}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {appliedAt ? null : (
          <Accordion variant="bordered">
            <AccordionItem
              key="1"
              aria-label="Suggestion accordion"
              title="Suggestions"
            >
              <ul className="list-disc pl-5">
                {suggestions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        )}
      </div>
      <div className="flex items-end gap-4">
        {appliedAt ? (
          <div className="p-4 space-y-4 flex-1">
            {applicationStatus ? (
              <ApplicationStatus
                applicationStatus={applicationStatus}
                id={id}
              />
            ) : null}
          </div>
        ) : null}

        <div className="p-4 flex items-center ml-auto gap-2">
          {appliedAt ? (
            <span className="text-sm text-muted-foreground">
              Applied on {format(new Date(appliedAt), "dd/MM/yyyy")}
            </span>
          ) : (
            <MarkAsApplied id={id} />
          )}
          {appliedAt ? null : <DeleteDialog id={id} />}
          <a target="_blank" rel="noopener noreferrer" href={url}>
            <Button color="primary" endContent={<MoveRight size={20} />}>
              Visit posting
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
};
