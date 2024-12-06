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
import { ProtectedRoute } from "@/features/ProtectedRoute";
import { ProfilePage } from "@/pages/ProfilePage";
import SendCodeVk from "@/pages/SendCodeVk/SendCodeVk";
import { FeedPage } from "@/pages/FeedPage";
import { SendEmail } from "@/pages/SendEmail";
import { SendPassword } from "@/pages/SendPassword";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Redirect to /about_us by default */}
      <Route index element={<Navigate to="/about_us" replace />} />

      {/* Открытые страницы */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/auth_loading" element={<SendCode />} />
      <Route path="/auth_loading_vk" element={<SendCodeVk />} />
      <Route path="/about_us" element={<FeedPage />} />
      <Route path="/send_email" element={<SendEmail />} />
      <Route path="/send_password" element={<SendPassword />} />

      {/* Защищенные страницы */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
