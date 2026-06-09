import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicNavbar from "../navigation/PublicNavbar";
import PublicFooter from "../navigation/PublicFooter";

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <PublicNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
