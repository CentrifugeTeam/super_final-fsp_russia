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
import { RequestEdit } from "@/features/RequestEdit";
import { SolutionEdit } from "@/features/SolutionEdit";
import { RatingEdit } from "@/features/RatingEdit";
import { NewRequest } from "@/pages/NewRequest";
import { FeedPage } from "@/pages/FeedPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { WelcomePage } from "@/pages/WelcomePage";
import { ProfileEdit } from "@/features/EditProfile";
import { EditRequest } from "@/pages/EditRequest";
import { SendEmail } from "@/pages/SendEmail";
import { RegionByIdPage } from "@/pages/RegionByIdPage";
import { EmailVerified } from "@/pages/EmailVerified";
import { ChangePassword } from "@/pages/ChangePassword";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Перенаправление на /about_us по умолчанию */}
      <Route index element={<Navigate to="/about_us" />} />

      {/* Открытые страницы */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/auth_loading" element={<SendCode />} />
      <Route path="/about_us" element={<WelcomePage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/regions" element={<FeedPage />} />
      <Route path="/regions/region/:id" element={<RegionByIdPage />} />
      <Route path="requests/:id/edit" element={<EditRequest />} />
      <Route path="/send_email" element={<SendEmail />} />
      <Route path="/email_verified" element={<EmailVerified />} />
      <Route path="/change_pass" element={<ChangePassword />} />

      {/* Защищенные страницы */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />}>
          {/* Вложенные маршруты для различных вкладок профиля */}
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="requests" element={<RequestEdit />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="requests/:id/edit" element={<EditRequest />} />

          {/* Маршрут для редактирования заявки */}
          <Route path="solutions" element={<SolutionEdit />} />
          <Route path="solutions" element={<SolutionEdit />} />

          <Route path="rating" element={<RatingEdit />} />
        </Route>
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
