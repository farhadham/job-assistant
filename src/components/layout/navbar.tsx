"use client";
import { Button } from "@heroui/button";
import { User } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
  return (
    <header className="py-4 flex items-center justify-between sticky top-0 z-10 bg-white/90">
      <Link href="/" className="font-bold">
        <Button>Job helper</Button>
      </Link>
      <div className="flex items-center gap-2">
        <Link href="/custom-post">
          <Button>Create your own posting</Button>
        </Link>
        <Link href="/applied">
          <Button variant="bordered">Applied jobs</Button>
        </Link>
        <Link href="/in-progress">
          <Button variant="bordered">Jobs in progress</Button>
        </Link>
        <Link href="/profile">
          <Button isIconOnly aria-label="profile page" color="primary">
            <User size={20} />
          </Button>
        </Link>
      </div>
    </header>
  );
};
