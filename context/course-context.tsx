"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

const Context = createContext<{
  queryClient: QueryClient;
}>({
  queryClient: new QueryClient(),
});

export const CourseProvider = Context.Provider;

export const useCourseContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return context;
};

export const CourseContext = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <Context.Provider value={{ queryClient }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Context.Provider>
  );
};
