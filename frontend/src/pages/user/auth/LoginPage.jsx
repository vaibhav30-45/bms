import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  Building2,
  Mail,
  Lock,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { loginSchema } from "../../../utils/validators";
import { loginUser } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });


  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");

      const res = await loginUser(data);

      // IMPORTANT FIX
      const authData = res.data?.data ?? res.data;

      login(authData);

      toast.success(`Welcome back, ${authData.firstName}!`);

      if (authData.role === ROLES.ADMIN) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/user/dashboard", { replace: true });
      }
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign In — NexaBank</title>
        <meta
          name="description"
          content="Sign in to your NexaBank account securely."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950
                      flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12"
      >
        <div
          className="w-full max-w-5xl grid lg:grid-cols-2 gap-0
                        bg-white dark:bg-gray-900 rounded-3xl sm:rounded-3xl shadow-2xl
                        overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          {/* ── Left panel (decorative) ── */}
          <div
            className="hidden lg:flex flex-col justify-between
                          bg-gradient-to-br from-[#0f2033] via-[#1a3c5e]
                          to-[#0f2033] p-10 relative overflow-hidden"
          >
            {/* Background blobs */}
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full
                            bg-blue-500/10 blur-3xl pointer-events-none"
            />
            <div
              className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full
                            bg-amber-500/10 blur-3xl pointer-events-none"
            />

            {/* Logo */}
            <div className="relative flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl bg-white/15 flex items-center
                              justify-center backdrop-blur-sm"
              >
                <Building2 size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg tracking-tight">
                  NexaBank
                </p>
                <p className="text-white/40 text-xs tracking-widest uppercase">
                  Management System
                </p>
              </div>
            </div>

            {/* Center content */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                  Your finances,
                  <span
                    className="block text-transparent bg-clip-text
                                   bg-gradient-to-r from-amber-400 to-amber-200"
                  >
                    under control.
                  </span>
                </h2>
                <p className="text-blue-200/60 text-sm leading-relaxed">
                  Sign in to manage your accounts, transfer funds and track
                  every transaction — securely.
                </p>
              </motion.div>

              {/* Mini stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: "Active Users", value: "1M+" },
                  { label: "Daily Txns", value: "50K+" },
                  { label: "Uptime", value: "99.9%" },
                  { label: "Cities", value: "50+" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-white/8 backdrop-blur-sm rounded-2xl p-4
                                  border border-white/10"
                  >
                    <p className="text-white font-black text-xl">{value}</p>
                    <p className="text-white/50 text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right panel (form) ── */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div
                className="w-8 h-8 rounded-lg bg-[#1a3c5e] flex items-center
                              justify-center"
              >
                <Building2 size={16} className="text-white" />
              </div>
              <span className="font-black text-[#1a3c5e] dark:text-white">
                NexaBank
              </span>
            </div>

            <div className="mb-8">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                Welcome back
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Error alert */}
            <Alert
              type="error"
              message={apiError}
              show={!!apiError}
              onClose={() => setApiError("")}
              className="mb-5"
            />

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
              noValidate
            >
              <Input
                label="Email address"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                prefix={<Mail size={15} />}
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                prefix={<Lock size={15} />}
                error={errors.password?.message}
                {...register("password")}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                className="mt-1"
              >
                Sign In
                <ArrowRight size={16} />
              </Button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#1a3c5e] dark:text-blue-400 font-bold
                                 hover:underline"
                >
                  Open Account
                </Link>
              </p>
            </div>

            {/* <div
              className="mt-4 pt-4 border-t border-gray-100
                            dark:border-gray-800 text-center"
            >
              <Link
                to="/admin/login"
                className="text-xs text-gray-400 hover:text-gray-600
                               dark:hover:text-gray-300 transition-colors"
              >
                Admin Portal →
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
