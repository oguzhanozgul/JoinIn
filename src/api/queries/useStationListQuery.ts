import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Station } from "../../types/Station";
import apiClient, { API_URL } from "../clients/apiClient";

const useStationListQuery = () => {
  const [unknownError, setBadRequestError] = useState(false);

  const query = useQuery<{ data: Station[] }>({
    queryKey: ["StationList"],
    queryFn: async () => {
      const { data } = await apiClient.get(API_URL);
      return data;
    },
    retry: true,
    retryDelay: retryCount => Math.min(1000 * 2 ** retryCount, 30000),
  });

  useEffect(() => {
    if (query.isError) {
      if (query.error instanceof AxiosError && query.error.response) {
        if (query.error.response.status === 400) {
          switch (query.error.response.data.errorCode) {
            default:
              setBadRequestError(true);
              return;
          }
        }
        setBadRequestError(true);
        return;
      }
    }
  }, [query.error, query.isError]);

  return {
    ...query,
    unknownError,
  };
};

export default useStationListQuery;
