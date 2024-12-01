import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import Providers from "./Providers";

import "@mantine/core/styles.css";
import "./theme/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
);
