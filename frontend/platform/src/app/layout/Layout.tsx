import { Outlet, useLocation } from "react-router-dom";
import styles from "./layout.module.scss";
import { Header } from "@/components/Header/ui";

export const Layout = () => {
  const location = useLocation();

  // Список путей, где Header должен отображаться
  const showHeaderOnRoutes = ["/feed"];

  const shouldShowHeader = showHeaderOnRoutes.includes(location.pathname);

  return (
    <div className={styles.layout}>
      {shouldShowHeader && <Header />}
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
