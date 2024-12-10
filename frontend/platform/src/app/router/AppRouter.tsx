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
import { Requests } from "@/features/RequestEdit";
import { Solutions } from "@/features/SolutionEdit";
import { RatingEdit } from "@/features/RatingEdit";
import { NewRequest } from "@/pages/NewRequest";
import { FeedPage } from "@/pages/FeedPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { WelcomePage } from "@/pages/WelcomePage";
import { EditRequest } from "@/pages/EditRequest";
import { SendEmail } from "@/pages/SendEmail";
import { RegionByIdPage } from "@/pages/RegionByIdPage";
import { EmailVerified } from "@/pages/EmailVerified";
import { ChangePassword } from "@/pages/ChangePassword";
import { SolutionEditPage } from "@/pages/SolutionEditPage";
import { ProfileCard } from "@/components/ProfileEditCard";
import { ProfileEditChange } from "@/features/ProfileEditChange";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Перенаправление на страницу "О нас" по умолчанию */}
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
          {/* Профиль */}
          <Route path="me" element={<ProfileCard />} />
          <Route path="me/edit" element={<ProfileEditChange />} />
          {/* Заявки */}
          <Route path="requests" element={<Requests />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="requests/:id/edit" element={<EditRequest />} />
          {/* Решения */}
          <Route path="solutions" element={<Solutions />} />
          <Route path="solutions/:id/edit" element={<SolutionEditPage />} />
          {/* Рейтинг */}
          <Route path="rating" element={<RatingEdit />} />
        </Route>
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
