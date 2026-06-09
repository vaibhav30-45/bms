import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldOff, Home, ArrowLeft, Building2, Lock } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleHome = () => {
    if (!auth) {
      navigate("/login");
    } else if (auth.role === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>Unauthorized Access — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950
                      flex items-center justify-center p-4"
      >
        <div className="max-w-lg w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            <div
              className="relative inline-flex items-center
                            justify-center"
            >
              <div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full
                              bg-red-50 dark:bg-red-900/20 flex items-center
                              justify-center"
              >
                <ShieldOff
                  size={64}
                  className="text-red-400 dark:text-red-500"
                />
              </div>

              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                className="absolute -top-2 -right-2 w-10 h-10
                           rounded-2xl bg-red-100 dark:bg-red-900/40
                           flex items-center justify-center shadow-md"
              >
                <Lock size={18} className="text-red-500" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className="w-8 h-8 rounded-xl bg-[#1a3c5e]
                              flex items-center justify-center"
              >
                <Building2 size={16} className="text-white" />
              </div>
              <span className="font-black text-[#1a3c5e] dark:text-white">
                NexaBank
              </span>
            </div>

            {/* Error code */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2
                            rounded-full bg-red-100 dark:bg-red-900/30
                            text-red-600 dark:text-red-400 text-xs
                            font-bold uppercase tracking-widest mb-4"
            >
              <Lock size={12} />
              Error 403 — Forbidden
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black
                           text-gray-900 dark:text-white mb-3"
            >
              Access Denied
            </h1>
            <p
              className="text-gray-500 dark:text-gray-400 mb-4
                          max-w-sm mx-auto leading-relaxed"
            >
              You don't have permission to access this page. This area is
              restricted to authorized users only.
            </p>

            {/* Role specific message */}
            {auth && (
              <div
                className="mb-6 p-3 rounded-xl bg-amber-50
                              dark:bg-amber-900/20 border border-amber-200
                              dark:border-amber-800 max-w-sm mx-auto"
              >
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You are signed in as <strong>{auth.firstName}</strong> with
                  role <strong>{auth.role}</strong>. This page requires
                  different permissions.
                </p>
              </div>
            )}

            <div
              className="flex flex-col sm:flex-row items-center
                            justify-center gap-3"
            >
              <Button size="lg" onClick={handleHome}>
                <Home size={17} />
                {auth ? "Go to Dashboard" : "Go to Login"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={17} />
                Go Back
              </Button>
            </div>

            {/* Contact note */}
            <p className="mt-8 text-xs text-gray-400">
              If you believe this is a mistake, contact{" "}
              <a
                href="mailto:support@nexabank.in"
                className="text-[#1a3c5e] dark:text-blue-400
                            hover:underline font-semibold"
              >
                support@nexabank.in
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
