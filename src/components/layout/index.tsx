"use client";

import { Navbar } from "./navbar";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <div className="container">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 h-full">{children}</div>
      </main>
    </div>
  );
};
