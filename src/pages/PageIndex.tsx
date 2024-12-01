import { Outlet } from "react-router";
import { Box } from "@mantine/core";

import StationSelector from "../components/StationSelector/StationSelector";

const PageIndex = () => {
  return (
    <>
      <Box p="32px">
        <StationSelector />
      </Box>
      <Outlet />
    </>
  );
};

export default PageIndex;
