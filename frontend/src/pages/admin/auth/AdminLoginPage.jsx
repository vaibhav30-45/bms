import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertTriangle,
  Eye,
  Building2,
} from "lucide-react";
import { loginSchema } from "../../../utils/validators";
import { loginUser } from "../../../api/authApi";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";

export default function AdminLoginPage() {
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

      // FIX HERE
      if (res.data.data.role !== ROLES.ADMIN) {
        setApiError("Access denied. This portal is for administrators only.");
        return;
      }

      // FIX HERE ALSO
      login(res.data.data);

      toast.success(`Welcome, Admin ${res.data.data.firstName}!`);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login — NexaBank</title>
        <meta
          name="description"
          content="Secure admin portal for NexaBank administrators."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div
        className="min-h-screen bg-[#0a1929] flex items-center
                      justify-center p-3 sm:p-4 py-8 sm:py-12 relative overflow-hidden"
      >
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full
                          bg-blue-600/5 blur-3xl"
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full
                          bg-amber-500/5 blur-3xl"
          />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-3"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px,
                                transparent 1px),
                                linear-gradient(90deg,
                                rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div
                className="w-10 h-10 rounded-xl bg-[#1a3c5e] flex items-center
                              justify-center shadow-lg shadow-blue-900/50"
              >
                <Building2 size={22} className="text-white" />
              </div>
              <span className="text-white font-black text-xl tracking-tight">
                NexaBank
              </span>
            </div>

            {/* Admin badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-amber-400/10 border border-amber-400/20 mb-4"
            >
              <ShieldCheck size={15} className="text-amber-400" />
              <span
                className="text-amber-400 text-xs font-bold uppercase
                               tracking-widest"
              >
                Admin Portal
              </span>
            </div>

            <h1 className="text-2xl font-black text-white mb-2">
              Administrator Sign In
            </h1>
            <p className="text-gray-400 text-sm">
              Restricted access — authorized personnel only
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10
                       rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl"
          >
            {/* Warning notice */}
            <div
              className="flex items-start gap-3 p-3.5 rounded-xl
                            bg-amber-400/10 border border-amber-400/20 mb-6"
            >
              <AlertTriangle
                size={16}
                className="text-amber-400 flex-shrink-0 mt-0.5"
              />
              <p className="text-amber-200/80 text-xs leading-relaxed">
                This portal is exclusively for NexaBank administrators. All
                login attempts are monitored and logged.
              </p>
            </div>

            {/* Error */}
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
              <div>
                <label
                  className="block text-sm font-semibold
                                  text-gray-300 mb-1.5"
                >
                  Admin Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   text-gray-500 pointer-events-none"
                  />
                  <input
                    type="email"
                    placeholder="admin@nexabank.in"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium
                      bg-white/8 border text-white placeholder:text-gray-600
                      focus:outline-none focus:ring-2
                      transition-all duration-200
                      ${
                        errors.email
                          ? "border-red-500/50 focus:ring-red-500/20"
                          : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
                      }
                    `}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1.5 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className="block text-sm font-semibold
                                  text-gray-300 mb-1.5"
                >
                  Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   text-gray-500 pointer-events-none"
                  />
                  <input
                    type="password"
                    placeholder="Enter admin password"
                    className={`
                      w-full pl-10 pr-4 py-3 rounded-xl text-sm font-medium
                      bg-white/8 border text-white placeholder:text-gray-600
                      focus:outline-none focus:ring-2
                      transition-all duration-200
                      ${
                        errors.password
                          ? "border-red-500/50 focus:ring-red-500/20"
                          : "border-white/10 focus:ring-blue-500/30 focus:border-blue-500/50"
                      }
                    `}
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1.5 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={loading}
                className="!bg-[#1a3c5e] hover:!bg-[#15304d] mt-1
                           shadow-lg shadow-blue-900/40"
              >
                <ShieldCheck size={16} />
                Sign In as Admin
                <ArrowRight size={16} />
              </Button>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-6"
          >
            <Link
              to="/login"
              className="text-sm text-gray-500 hover:text-gray-300
                             transition-colors"
            >
              ← Back to User Login
            </Link>
          </motion.div>

          {/* Security notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-2 mt-4"
          >
            <ShieldCheck size={12} className="text-gray-600" />
            <span className="text-xs text-gray-600">
              Secured with 256-bit SSL encryption
            </span>
          </motion.div>
        </div>
      </div>
    </>
  );
}
