import { ReactNode } from "react";
import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import queryClient from "./api/clients/queryClient";
import { joinInTheme } from "./theme/joinInTheme";

interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <MantineProvider theme={joinInTheme}>{children}</MantineProvider>
    </QueryClientProvider>
  );
};

export default Providers;
