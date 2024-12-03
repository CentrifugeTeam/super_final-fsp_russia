import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../layout";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
