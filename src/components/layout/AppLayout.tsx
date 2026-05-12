import type { PropsWithChildren } from "react";
import { Header } from "./Header";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-loop-bg text-white">
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
