import { Navigate, Outlet, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { Header } from "@/components/Header/ui";
import { Footer } from "@/components/Footer/ui";
import styles from "@/app/layout/layout.module.scss";

export const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const location = useLocation();

  // Список путей, где Header должен отображаться (статические и динамические)
  const showHeaderOnRoutes = [
    "/about_us",
    "/profile",
    "/profile/me",
    "/profile/requests",
    "/profile/solutions",
    "/profile/protocols",
    "/profile/rating",
    "/profile/requests/new",
  ];

  const dynamicHeaderRoutes = [
    "/profile/requests/:id/edit", // Динамический маршрут для Header
    "/profile/solutions/:id/edit", // Динамический маршрут для Header
  ];

  // Список путей, где Footer должен отображаться
  const showFooterOnRoutes = ["/about_us"]; // Example routes where Footer should show

  // Проверяем, отображать ли Header
  const shouldShowHeader =
    showHeaderOnRoutes.includes(location.pathname) ||
    dynamicHeaderRoutes.some((route) => matchPath(route, location.pathname));

  // Проверяем, отображать ли Footer
  const shouldShowFooter = showFooterOnRoutes.includes(location.pathname);

  // Если не авторизован, перенаправляем только для защищенных маршрутов
  if (!isAuthenticated) {
    console.log("isAuthenticated:", isAuthenticated);
    return <Navigate to="/login" replace />;
  }

  // Если авторизован, рендерим дочерние маршруты с Header и Footer
  return (
    <div className={styles.layout}>
      {shouldShowHeader && <Header />}
      <main className={styles.main}>
        <Outlet />
      </main>
      {shouldShowFooter && <Footer />}
    </div>
  );
};
