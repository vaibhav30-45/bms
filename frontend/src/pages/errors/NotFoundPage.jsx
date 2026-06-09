import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Building2, Search, MapPin } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../utils/constants";

export default function NotFoundPage() {
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
        <title>Page Not Found — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950
                      flex items-center justify-center p-4"
      >
        <div className="max-w-lg w-full text-center">
          {/* Animated number */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
            className="mb-8"
          >
            {/* 404 graphic */}
            <div
              className="relative inline-flex items-center
                            justify-center mb-6"
            >
              <div
                className="w-36 h-36 sm:w-44 sm:h-44 rounded-full
                              bg-gradient-to-br from-[#1a3c5e]/10
                              to-[#1a3c5e]/5 dark:from-blue-400/10
                              dark:to-blue-400/5 flex items-center
                              justify-center"
              >
                <span
                  className="text-6xl sm:text-7xl font-black
                                 text-[#1a3c5e] dark:text-blue-400
                                 tracking-tighter"
                >
                  404
                </span>
              </div>
            </div>
          </motion.div>

          {/* Text */}
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

            <h1
              className="text-2xl sm:text-3xl font-black
                           text-gray-900 dark:text-white mb-3"
            >
              Page not found
            </h1>
            <p
              className="text-gray-500 dark:text-gray-400 mb-8
                          max-w-sm mx-auto leading-relaxed"
            >
              The page you're looking for doesn't exist or has been moved. Let's
              get you back to safety.
            </p>

            {/* Actions */}
            <div
              className="flex flex-col sm:flex-row items-center
                            justify-center gap-3"
            >
              <Button size="lg" onClick={handleHome}>
                <Home size={17} />
                Go to Dashboard
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft size={17} />
                Go Back
              </Button>
            </div>

            {/* Quick links */}
            <div
              className="mt-8 pt-6 border-t border-gray-200
                            dark:border-gray-800"
            >
              <p
                className="text-xs text-gray-400 mb-3 uppercase
                            tracking-wide font-semibold"
              >
                Quick links
              </p>
              <div
                className="flex flex-wrap items-center justify-center
                              gap-3"
              >
                {[
                  { label: "Home", path: "/" },
                  { label: "About", path: "/about" },
                  { label: "Services", path: "/services" },
                  { label: "Login", path: "/login" },
                ].map(({ label, path }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className="text-sm text-[#1a3c5e] dark:text-blue-400
                               hover:underline font-semibold"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
