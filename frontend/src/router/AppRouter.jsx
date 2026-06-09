import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loader from "../components/common/Loader";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import UserLayout from "../components/layout/UserLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Guards
import ProtectedRoute from "../components/guards/ProtectedRoute";
import AdminRoute from "../components/guards/AdminRoute";

// ── Public pages
import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ServicesPage from "../pages/public/ServicesPage";
import BlogPage from "../pages/public/BlogPage";
import ContactPage from "../pages/public/ContactPage";

// Auth pages
const LoginPage = lazy(() => import("../pages/user/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/user/auth/RegisterPage"));
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLoginPage"));

//  User pages
const DashboardPage = lazy(
  () => import("../pages/user/dashboard/DashboardPage"),
);
const ProfilePage = lazy(() => import("../pages/user/profile/ProfilePage"));
const AddressPage = lazy(() => import("../pages/user/address/AddressPage"));
const KycPage = lazy(() => import("../pages/user/kyc/KycPage"));
const AccountsPage = lazy(() => import("../pages/user/accounts/AccountsPage"));
const AccountDetailPage = lazy(
  () => import("../pages/user/accounts/AccountDetailPage"),
);
const DepositPage = lazy(
  () => import("../pages/user/transactions/DepositPage"),
);
const WithdrawPage = lazy(
  () => import("../pages/user/transactions/WithdrawPage"),
);
const AccountApplicationPage = lazy(
  () => import("../pages/user/accounts/AccountApplicationPage"),
);
const StatementPage = lazy(
  () => import("../pages/user/transactions/StatementPage"),
);

const SettingsPage = lazy(() => import("../pages/user/settings/SettingsPage"));

//  Admin pages
const AdminDashboardPage = lazy(
  () => import("../pages/admin/dashboard/AdminDashboardPage"),
);
const AdminKycPage = lazy(() => import("../pages/admin/kyc/AdminKycPage"));
const AdminAccountsPage = lazy(
  () => import("../pages/admin/accounts/AdminAccountsPage"),
);

// Error pages
const NotFoundPage = lazy(() => import("../pages/errors/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/errors/UnauthorizedPage"));
const ServerErrorPage = lazy(() => import("../pages/errors/ServerErrorPage"));

const SuspenseWrap = ({ children }) => (
  <Suspense fallback={<Loader fullScreen />}>{children}</Suspense>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Zone 1: Public ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route
            path="/login"
            element={
              <SuspenseWrap>
                <LoginPage />
              </SuspenseWrap>
            }
          />
          <Route
            path="/register"
            element={
              <SuspenseWrap>
                <RegisterPage />
              </SuspenseWrap>
            }
          />
          <Route
            path="/admin/login"
            element={
              <SuspenseWrap>
                <AdminLoginPage />
              </SuspenseWrap>
            }
          />
        </Route>

        {/* ── Zone 2: User ── */}
        <Route element={<ProtectedRoute />}>
          <Route element={<UserLayout />}>
            <Route
              path="/user/dashboard"
              element={
                <SuspenseWrap>
                  <DashboardPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/profile"
              element={
                <SuspenseWrap>
                  <ProfilePage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/address"
              element={
                <SuspenseWrap>
                  <AddressPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/kyc"
              element={
                <SuspenseWrap>
                  <KycPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/accounts"
              element={
                <SuspenseWrap>
                  <AccountsPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/accounts/:id"
              element={
                <SuspenseWrap>
                  <AccountDetailPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/deposit"
              element={
                <SuspenseWrap>
                  <DepositPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/withdraw"
              element={
                <SuspenseWrap>
                  <WithdrawPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/accounts/apply"
              element={
                <SuspenseWrap>
                  <AccountApplicationPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/statement"
              element={
                <SuspenseWrap>
                  <StatementPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/user/settings"
              element={
                <SuspenseWrap>
                  <SettingsPage />
                </SuspenseWrap>
              }
            />
          </Route>
        </Route>

        {/* ── Zone 3: Admin  ── */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={
                <SuspenseWrap>
                  <AdminDashboardPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/admin/accounts"
              element={
                <SuspenseWrap>
                  <AdminAccountsPage />
                </SuspenseWrap>
              }
            />
            <Route
              path="/admin/kyc"
              element={
                <SuspenseWrap>
                  <AdminKycPage />
                </SuspenseWrap>
              }
            />
          </Route>
        </Route>

        {/* ── Error pages ── */}
        <Route
          path="/unauthorized"
          element={
            <SuspenseWrap>
              <UnauthorizedPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="/500"
          element={
            <SuspenseWrap>
              <ServerErrorPage />
            </SuspenseWrap>
          }
        />
        <Route
          path="*"
          element={
            <SuspenseWrap>
              <NotFoundPage />
            </SuspenseWrap>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
