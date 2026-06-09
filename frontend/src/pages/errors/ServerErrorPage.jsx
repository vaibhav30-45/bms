import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ServerCrash,
  Home,
  RefreshCw,
  Building2,
  AlertTriangle,
} from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleHome = () => {
    if (!auth) {
      navigate("/");
    } else if (auth.role === ROLES.ADMIN) {
      navigate("/admin/dashboard");
    } else {
      navigate("/user/dashboard");
    }
  };

  return (
    <>
      <Helmet>
        <title>Server Error — NexaBank</title>
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
                              bg-orange-50 dark:bg-orange-900/20
                              flex items-center justify-center"
              >
                <ServerCrash
                  size={64}
                  className="text-orange-400 dark:text-orange-500"
                />
              </div>

              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 w-10 h-10
                           rounded-2xl bg-orange-100 dark:bg-orange-900/40
                           flex items-center justify-center shadow-md"
              >
                <AlertTriangle size={18} className="text-orange-500" />
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
                            rounded-full bg-orange-100 dark:bg-orange-900/30
                            text-orange-600 dark:text-orange-400 text-xs
                            font-bold uppercase tracking-widest mb-4"
            >
              <AlertTriangle size={12} />
              Error 500 — Server Error
            </div>

            <h1
              className="text-2xl sm:text-3xl font-black
                           text-gray-900 dark:text-white mb-3"
            >
              Something went wrong
            </h1>
            <p
              className="text-gray-500 dark:text-gray-400 mb-4
                          max-w-sm mx-auto leading-relaxed"
            >
              Our servers encountered an unexpected error. Our team has been
              notified and is working to fix it.
            </p>

            {/* Status info */}
            <div
              className="mb-6 p-4 rounded-xl bg-gray-100
                            dark:bg-gray-800 max-w-sm mx-auto text-left"
            >
              <p
                className="text-xs font-bold text-gray-500
                            dark:text-gray-400 uppercase tracking-wide mb-2"
              >
                What you can try
              </p>
              <ul className="space-y-1.5">
                {[
                  "Refresh the page",
                  "Clear browser cache",
                  "Wait a few minutes and retry",
                  "Contact support if issue persists",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-center gap-2 text-sm
                                 text-gray-600 dark:text-gray-400"
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full
                                    bg-gray-400 flex-shrink-0"
                    />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="flex flex-col sm:flex-row items-center
                            justify-center gap-3"
            >
              <Button size="lg" onClick={() => window.location.reload()}>
                <RefreshCw size={17} />
                Refresh Page
              </Button>
              <Button size="lg" variant="outline" onClick={handleHome}>
                <Home size={17} />
                Go Home
              </Button>
            </div>

            {/* Support link */}
            <p className="mt-8 text-xs text-gray-400">
              Need help? Contact{" "}
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
