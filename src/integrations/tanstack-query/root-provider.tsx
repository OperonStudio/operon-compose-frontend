import { QueryClient } from "@tanstack/react-query";

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disabled as requested
      },
      mutations: {
        retry: false, // Disabled as requested
      },
    },
  });

  return {
    queryClient,
  };
}
export default function TanstackQueryProvider() {}
