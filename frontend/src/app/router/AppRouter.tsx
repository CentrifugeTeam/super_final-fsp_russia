import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../layout";
import { LoginPage } from "@/pages/LoginPage";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<LoginPage />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
