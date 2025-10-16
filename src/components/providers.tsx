"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SearchProvider } from "@/contexts/SearchContext";
import { BookingProvider } from "@/contexts/BookingContext";
import { TripsProvider } from "@/contexts/TripsContext";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <TripsProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </TripsProvider>
      </SearchProvider>
    </QueryClientProvider>
  );
}
