import { Outlet } from "react-router-dom";
import styles from "./layout.module.scss";

export const Layout = () => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
