import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router";

import StickyPlayerContainer from "./components/Player/StickyPlayerContainer";
import PageIndex from "./pages/PageIndex";

function App() {
  const router = createBrowserRouter(createRoutesFromElements(<Route path="/" element={<PageIndex />} />));

  return (
    <>
      <RouterProvider router={router} />
      <StickyPlayerContainer />
    </>
  );
}

export default App;
