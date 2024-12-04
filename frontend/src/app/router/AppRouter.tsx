import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Layout } from "../layout";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { SendCode } from "@/pages/SendCode";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Если пользователь на корневом маршруте, перенаправляем на /registration */}
      <Route index element={<Navigate to="/registration" replace />} />
      {/* Другие маршруты */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/auth_loading" element={<SendCode />} />
      {/* Если путь не определен, перенаправляем на /registration */}
      <Route path="*" element={<Navigate to="/registration" replace />} />
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
