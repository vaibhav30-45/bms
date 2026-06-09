import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { registerSchema } from "../../../utils/validators";
import { registerUser } from "../../../api/authApi";
import { getErrorMessage } from "../../../utils/helpers";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Contact Info" },
  { id: 3, label: "Security" },
];

const PERKS = [
  "Zero account opening fee",
  "KYC verified in 24 hours",
  "Instant fund transfers",
  "Bank-grade security",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onTouched",
  });

  // Validate current step fields before proceeding
  const STEP_FIELDS = {
    1: ["firstName", "lastName"],
    2: ["email", "phoneNumber", "dateOfBirth"],
    3: ["password"],
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setApiError("");
      await registerUser(data);
      setSuccess(true);
      toast.success("Account created successfully! Please sign in.");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setApiError(getErrorMessage(err));
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center
                      justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div
            className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30
                          flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
            Account Created!
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Redirecting you to sign in...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Open Account — NexaBank</title>
        <meta
          name="description"
          content="Open a free NexaBank account in minutes. No fees, instant setup."
        />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div
        className="min-h-screen bg-gray-50 dark:bg-gray-950
                      flex items-center justify-center p-3 sm:p-4 py-8 sm:py-12"
      >
        <div
          className="w-full max-w-5xl grid lg:grid-cols-2 gap-0
                        bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-2xl
                        overflow-hidden border border-gray-100
                        dark:border-gray-800"
        >
          {/* ── Left panel ── */}
          <div
            className="hidden lg:flex flex-col justify-between
                          bg-gradient-to-br from-[#0f2033] via-[#1a3c5e]
                          to-[#0f2033] p-10 relative overflow-hidden"
          >
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
                              justify-center"
              >
                <Building2 size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-lg">NexaBank</p>
                <p className="text-white/40 text-xs tracking-widest uppercase">
                  Management System
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                  Join 1 million+
                  <span
                    className="block text-transparent bg-clip-text
                                   bg-gradient-to-r from-amber-400 to-amber-200"
                  >
                    happy customers.
                  </span>
                </h2>
                <p className="text-blue-200/60 text-sm leading-relaxed mb-8">
                  Open your account in under 3 minutes. No paperwork, no branch
                  visits, completely online.
                </p>
              </motion.div>

              {/* Perks */}
              <div className="flex flex-col gap-3">
                {PERKS.map((p) => (
                  <div key={p} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full bg-amber-400/20 flex
                                    items-center justify-center flex-shrink-0"
                    >
                      <CheckCircle2 size={12} className="text-amber-400" />
                    </div>
                    <span className="text-white/70 text-sm">{p}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>

          {/* ── Right panel (form) ── */}
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-6 lg:hidden">
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

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                Create your account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {step} of {STEPS.length} — {STEPS[step - 1].label}
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center gap-2 mb-7">
              {STEPS.map(({ id }) => (
                <div key={id} className="flex items-center gap-2">
                  <div
                    className={`
                    w-7 h-7 rounded-full flex items-center justify-center
                    text-xs font-black transition-all duration-300
                    ${
                      id < step
                        ? "bg-emerald-500 text-white"
                        : id === step
                          ? "bg-[#1a3c5e] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }
                  `}
                  >
                    {id < step ? <CheckCircle2 size={14} /> : id}
                  </div>
                  {id < STEPS.length && (
                    <div
                      className={`
                      h-0.5 w-8 rounded-full transition-all duration-300
                      ${
                        id < step
                          ? "bg-emerald-500"
                          : "bg-gray-100 dark:bg-gray-800"
                      }
                    `}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* API Error */}
            <Alert
              type="error"
              message={apiError}
              show={!!apiError}
              onClose={() => setApiError("")}
              className="mb-5"
            />

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Step 1 — Personal Info */}
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        name="firstName"
                        placeholder="Arjun"
                        required
                        prefix={<User size={15} />}
                        error={errors.firstName?.message}
                        {...register("firstName")}
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        placeholder="Sharma"
                        required
                        prefix={<User size={15} />}
                        error={errors.lastName?.message}
                        {...register("lastName")}
                      />
                    </div>
                    <Button
                      type="button"
                      fullWidth
                      size="lg"
                      onClick={nextStep}
                    >
                      Continue
                      <ArrowRight size={16} />
                    </Button>
                  </>
                )}

                {/* Step 2 — Contact Info */}
                {step === 2 && (
                  <>
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="arjun@example.com"
                      required
                      prefix={<Mail size={15} />}
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <Input
                      label="Phone Number"
                      name="phoneNumber"
                      placeholder="+91XXXXXXXXXX"
                      required
                      prefix={<Phone size={15} />}
                      error={errors.phoneNumber?.message}
                      hint="Format: +91 followed by 10 digits"
                      {...register("phoneNumber")}
                    />
                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      required
                      prefix={<Calendar size={15} />}
                      error={errors.dateOfBirth?.message}
                      {...register("dateOfBirth")}
                    />
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        size="lg"
                        className="flex-1"
                        onClick={nextStep}
                      >
                        Continue
                        <ArrowRight size={16} />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3 — Security */}
                {step === 3 && (
                  <>
                    <Input
                      label="Create Password"
                      name="password"
                      type="password"
                      placeholder="Min 8 chars"
                      required
                      prefix={<Lock size={15} />}
                      error={errors.password?.message}
                      hint="Must contain uppercase, lowercase, digit and special character"
                      {...register("password")}
                    />

                    {/* Password strength hints */}
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      {[
                        {
                          label: "8+ characters",
                          check: (v) => v?.length >= 8,
                        },
                        {
                          label: "Uppercase letter",
                          check: (v) => /[A-Z]/.test(v ?? ""),
                        },
                        {
                          label: "Lowercase letter",
                          check: (v) => /[a-z]/.test(v ?? ""),
                        },
                        {
                          label: "Number",
                          check: (v) => /[0-9]/.test(v ?? ""),
                        },
                        {
                          label: "Special character",
                          check: (v) => /[!@#$%^&*]/.test(v ?? ""),
                        },
                      ].map(({ label, check }) => {
                        const pass = check(getValues("password"));
                        return (
                          <div
                            key={label}
                            className="flex items-center gap-1.5"
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center
                                            justify-center flex-shrink-0
                                            ${pass ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`}
                            >
                              {pass && (
                                <CheckCircle2
                                  size={10}
                                  className="text-white"
                                />
                              )}
                            </div>
                            <span
                              className={`text-xs font-medium
                              ${pass ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}
                            >
                              {label}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex gap-3 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="flex-1"
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="flex-1"
                        loading={loading}
                      >
                        Create Account
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            </form>

            {/* Sign in link */}
            <p
              className="mt-6 text-center text-sm text-gray-500
                          dark:text-gray-400"
            >
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#1a3c5e] dark:text-blue-400 font-bold
                               hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
