import { QueryCache, QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      if (axios.isAxiosError(error)) {
        switch (error.response?.status) {
          case 404:
            console.error("An error has occurred while communicating with the server, 404 Not found", error);
            break;
          case 500:
            console.error("An error has occurred while communicating with the server, 500 Server error", error);
            break;
          default: // not checking for 401, 403 etc. since we don't have auth yet.
            console.error("An error has occurred while communicating with the server", error);
            break;
        }
        return;
      }
    },
  }),
});

export default queryClient;
