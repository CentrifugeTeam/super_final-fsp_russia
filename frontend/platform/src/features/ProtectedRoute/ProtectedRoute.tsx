import { Navigate, Outlet, useLocation } from "react-router-dom";
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

  // Проверяем, нужно ли отображать Header для путей, начинающихся с '/profile'
  const shouldShowHeader = location.pathname.startsWith("/profile");

  // Список путей, где Footer должен отображаться
  const showFooterOnRoutes = ["/about_us"]; // Example routes where Footer should show

  // Проверяем, отображать ли Footer
  const shouldShowFooter = showFooterOnRoutes.includes(location.pathname);

  // Если не авторизован, перенаправляем только для защищенных маршрутов
  if (!isAuthenticated) {
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
