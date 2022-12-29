import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";
import { ErrorPage } from "./pages/ErrorPage";
import { GameAds } from "./pages/GameAds";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/ads/:id",
    element: <GameAds />
  }
]);


function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
