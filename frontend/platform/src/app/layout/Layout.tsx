import { Outlet, useLocation } from "react-router-dom";
import styles from "./layout.module.scss";
import { Header } from "@/components/Header/ui";
import { Footer } from "@/components/Footer/ui"; // Предполагается, что компонент Footer существует

export const Layout = () => {
  const location = useLocation();

  // Список путей, где Header должен отображаться
  const showHeaderOnRoutes = ["/regions", "/contacts", "/about_us", "/stats"];
  // Список путей, где Footer должен отображаться
  const showFooterOnRoutes = ["/regions", "/contacts", "/about_us", "/stats"];

  const shouldShowHeader =
    showHeaderOnRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/regions/region");
  const shouldShowFooter =
    showFooterOnRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/regions/region");

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

export default Layout;
