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
import { SendEmail } from "@/pages/SendEmail";
import { SendPassword } from "@/pages/SendPassword";
import { RegionByIdPage } from "@/pages/RegionByIdPage";
import { ProfileEdit } from "@/features/EditProfile";
import { RequestEdit } from "@/features/RequestEdit";
import { SolutionEdit } from "@/features/SolutionEdit";
import { RatingEdit } from "@/features/RatingEdit";
import { NewRequest } from "@/pages/NewRequest";
import { FeedPage } from "@/pages/FeedPage";

export const AppRouter = () => {
  const routes = createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Redirect to /regions by default */}
      <Route index element={<Navigate to="/regions" replace />} />

      {/* Открытые страницы */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/auth_loading" element={<SendCode />} />
      <Route path="/auth_loading_vk" element={<SendCodeVk />} />
      <Route path="/send_email" element={<SendEmail />} />
      <Route path="/send_password" element={<SendPassword />} />
      <Route path="/regions" element={<FeedPage />} />
			<Route path="/regions/region/:id" element={<RegionByIdPage />} />

      {/* Защищенные страницы */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<ProfilePage />}>
          {/* Вложенные маршруты для различных вкладок профиля */}
          <Route path="edit" element={<ProfileEdit />} />
          <Route path="requests" element={<RequestEdit />} />
          <Route path="requests/new" element={<NewRequest />} />
          <Route path="solutions" element={<SolutionEdit />} />
          <Route path="rating" element={<RatingEdit />} />
        </Route>
      </Route>
    </Route>
  );

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};
