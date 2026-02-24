import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * PageLayout component provides consistent layout structure across all pages.
 * Ensures uniform padding, min-height, and overflow behavior.
 */
export default function PageLayout({
  children,
  className = "",
  contentClassName = "",
}: PageLayoutProps) {
  return (
    <div className={`w-full min-h-screen ${className}`}>
      <main className="p-3 sm:p-4 md:p-6 lg:p-8 flex-1 w-full max-w-[100%] overflow-x-hidden">
        <div className={`page-container ${contentClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
