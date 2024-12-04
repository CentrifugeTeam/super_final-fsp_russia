import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "../layout";
import { LoginPage } from "@/pages/LoginPage";
import { RegistrationPage } from "@/pages/RegistrationPage";
import { SendCode } from "@/pages/SendCode";
import { ProtectedRoute } from "@/features/ProtectedRoute"; // Импортируем защищенный маршрут
import { ProfilePage } from "@/pages/ProfilePage";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Открытые страницы */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/auth_loading" element={<SendCode />} />

      {/* Защищенные страницы */}
      <Route element={<ProtectedRoute />}>
        {/* Эти маршруты будут доступны только для авторизованных пользователей */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
