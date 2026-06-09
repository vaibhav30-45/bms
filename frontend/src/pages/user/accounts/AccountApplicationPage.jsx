import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  FileText,
  User,
  MapPin,
  CreditCard,
  Building2,
  PiggyBank,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Clock,
  Info,
} from "lucide-react";
import {
  createSavingsAccount,
  createCurrentAccount,
} from "../../../api/accountApi";
import { getErrorMessage } from "../../../utils/helpers";
import { useAccounts } from "../../../hooks/useAccounts";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Alert from "../../../components/common/Alert";
import Card from "../../../components/common/Card";
import BranchDropdown from "../../../components/common/BranchDropdown";
import SlotPicker from "../../../components/common/SlotPicker";
import { BRANCHES } from "../../../utils/branchData";

// Generates a frontend-only slot
function generateFrontendSlot(branchId, accountType, branches) {
  const branch = branches.find((b) => b.id === Number(branchId));
  const now = new Date();

  // Find next available 15-min slot from 10:00 to 17:00
  const opening = new Date();
  opening.setHours(10, 0, 0, 0);
  const closing = new Date();
  closing.setHours(17, 0, 0, 0);

  // Start from current time rounded up to next 15-min block
  // or from opening if before opening
  let startBase = now > opening ? now : opening;
  const mins = startBase.getMinutes();
  const rounded = Math.ceil(mins / 15) * 15;
  startBase.setMinutes(rounded, 0, 0);

  // If rounded time is past closing, default to opening
  if (startBase >= closing) {
    startBase = new Date(opening);
  }

  const endTime = new Date(startBase);
  endTime.setMinutes(endTime.getMinutes() + 15);

  const pad = (n) => String(n).padStart(2, "0");

  return {
    tokenNumber: `ACC-${Date.now()}`,
    branchName: branch
      ? `${branch.name}, ${branch.city}`
      : `Branch #${branchId}`,
    slotDate: now.toISOString().split("T")[0],
    startTime: `${pad(startBase.getHours())}:${pad(startBase.getMinutes())}:00`,
    endTime: `${pad(endTime.getHours())}:${pad(endTime.getMinutes())}:00`,
    accountType,
    message: "Account application slot assigned successfully",
  };
}

//  Stepper config 
const STEPS = [
  { id: 1, label: "Personal Details", Icon: User },
  { id: 2, label: "Address", Icon: MapPin },
  { id: 3, label: "ID Details", Icon: CreditCard },
  { id: 4, label: "Account & Branch", Icon: Building2 },
];

const OCCUPATIONS = [
  "Salaried",
  "Business",
  "Self Employed",
  "Student",
  "Retired",
  "Homemaker",
  "Other",
];

//  Validation schemas per step 
const step1Schema = yup.object({
  firstName: yup
    .string()
    .min(2)
    .max(50)
    .matches(/^[a-zA-Z\s]+$/, "Letters only")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2)
    .max(50)
    .matches(/^[a-zA-Z\s]+$/, "Letters only")
    .required("Last name is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"])
    .required("Gender is required"),
  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Valid 10-digit number starting with 6–9")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const step2Schema = yup.object({
  streetAddress: yup.string().max(200).required("Street address is required"),
  city: yup.string().max(100).required("City is required"),
  state: yup.string().max(100).required("State is required"),
  pincode: yup
    .string()
    .matches(/^[1-9]\d{5}$/, "Valid 6-digit pincode")
    .required("Pincode is required"),
  country: yup.string().required("Country is required"),
});

const step3Schema = yup.object({
  panNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Format: ABCDE1234F")
    .required("PAN number is required"),
  panName: yup.string().required("Name on PAN is required"),
  aadharNumber: yup
    .string()
    .matches(/^[2-9]\d{11}$/, "12 digits, starts with 2–9")
    .required("Aadhaar number is required"),
  aadharName: yup.string().required("Name on Aadhaar is required"),
  occupation: yup.string().nullable(),
});

const step4Schema = yup.object({
  accountType: yup
    .string()
    .oneOf(["savings", "current"])
    .required("Select account type"),
  branchId: yup
    .number()
    .typeError("Select a branch")
    .positive("Select a branch")
    .required("Select a branch"),
});

const SCHEMAS = [step1Schema, step2Schema, step3Schema, step4Schema];

// Stepper indicator 
function StepperBar({ currentStep, completedSteps }) {
  return (
    <>
      {/* Desktop */}
      <div
        className="hidden sm:flex items-center justify-between
                      relative mb-8"
      >
        <div
          className="absolute top-5 left-0 right-0 h-0.5
                        bg-gray-100 dark:bg-gray-800 z-0"
        >
          <div
            className="h-full bg-[#1a3c5e] transition-all duration-500"
            style={{
              width: `${(completedSteps.length / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>
        {STEPS.map(({ id, label, Icon }) => {
          const isDone = completedSteps.includes(id);
          const isCurrent = currentStep === id;
          return (
            <div
              key={id}
              className="flex flex-col items-center gap-2 z-10 flex-1"
            >
              <div
                className={`
                w-10 h-10 rounded-full border-2 flex items-center
                justify-center transition-all duration-300
                ${
                  isDone
                    ? "bg-[#1a3c5e] border-[#1a3c5e]"
                    : isCurrent
                      ? "bg-white dark:bg-gray-900 border-[#1a3c5e]"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                }
              `}
              >
                {isDone ? (
                  <CheckCircle2 size={18} className="text-white" />
                ) : (
                  <Icon
                    size={16}
                    className={
                      isCurrent
                        ? "text-[#1a3c5e] dark:text-blue-400"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                )}
              </div>
              <p
                className={`text-xs font-bold text-center
                ${
                  isCurrent
                    ? "text-[#1a3c5e] dark:text-blue-400"
                    : isDone
                      ? "text-gray-700 dark:text-gray-300"
                      : "text-gray-400"
                }`}
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div
        className="sm:hidden flex items-center gap-3 p-3
                      rounded-2xl bg-gray-50 dark:bg-gray-800/50 mb-6"
      >
        <div className="flex gap-1.5">
          {STEPS.map(({ id }) => {
            const isDone = completedSteps.includes(id);
            const isCurrent = currentStep === id;
            return (
              <div
                key={id}
                className={`
                w-7 h-7 rounded-full flex items-center
                justify-center text-xs font-black transition-all
                ${
                  isDone
                    ? "bg-[#1a3c5e] text-white"
                    : isCurrent
                      ? "bg-white dark:bg-gray-900 border-2 border-[#1a3c5e] text-[#1a3c5e] dark:text-blue-400"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                }
              `}
              >
                {isDone ? <CheckCircle2 size={13} /> : id}
              </div>
            );
          })}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            Step {currentStep}: {STEPS[currentStep - 1]?.label}
          </p>
          <p className="text-xs text-gray-400">
            {completedSteps.length} of {STEPS.length} completed
          </p>
        </div>
      </div>
    </>
  );
}

//  Step 1: Personal Details 
function Step1({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your personal information as per your government ID.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          name="firstName"
          placeholder="Sumith"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Yadav"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>
      <Input
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        required
        error={errors.dateOfBirth?.message}
        {...register("dateOfBirth")}
      />
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-gray-700
                           dark:text-gray-300"
        >
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          {...register("gender")}
          className={`w-full px-4 py-3 rounded-xl border text-sm
                      font-medium bg-white dark:bg-gray-900
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-3
                      transition-all duration-200
                      ${
                        errors.gender
                          ? "border-red-500 focus:ring-red-500/20"
                          : "border-gray-200 dark:border-gray-700 focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]"
                      }`}
        >
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && (
          <p className="text-xs text-red-500 font-medium">
            {errors.gender.message}
          </p>
        )}
      </div>
      <Input
        label="Phone Number"
        name="phoneNumber"
        placeholder="8777453678"
        required
        hint="10-digit number starting with 6–9"
        error={errors.phoneNumber?.message}
        {...register("phoneNumber")}
      />
      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="sumith@gmail.com"
        required
        error={errors.email?.message}
        {...register("email")}
      />
    </div>
  );
}

//  Step 2: Address 
function Step2({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter your current residential address.
      </p>
      <Input
        label="Street Address"
        name="streetAddress"
        placeholder="123, Miyapur, Hyd"
        required
        error={errors.streetAddress?.message}
        {...register("streetAddress")}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          placeholder="Hyderabad"
          required
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="State"
          name="state"
          placeholder="Telangana"
          required
          error={errors.state?.message}
          {...register("state")}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Pincode"
          name="pincode"
          placeholder="500050"
          required
          error={errors.pincode?.message}
          {...register("pincode")}
        />
        <Input
          label="Country"
          name="country"
          placeholder="India"
          required
          error={errors.country?.message}
          {...register("country")}
        />
      </div>
    </div>
  );
}

//  Step 3: ID Details 
function Step3({ register, errors }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Enter your PAN and Aadhaar details exactly as on your ID cards.
      </p>
      <Input
        label="PAN Number"
        name="panNumber"
        placeholder="ABCDE1234F"
        required
        hint="Format: 5 letters, 4 digits, 1 letter (uppercase)"
        error={errors.panNumber?.message}
        {...register("panNumber")}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          register("panNumber").onChange(e);
        }}
      />
      <Input
        label="Name on PAN Card"
        name="panName"
        placeholder="Sumith Yadav"
        required
        error={errors.panName?.message}
        {...register("panName")}
      />
      <Input
        label="Aadhaar Number"
        name="aadharNumber"
        placeholder="256473685975"
        required
        hint="12 digits, starts with 2–9"
        error={errors.aadharNumber?.message}
        {...register("aadharNumber")}
      />
      <Input
        label="Name on Aadhaar Card"
        name="aadharName"
        placeholder="Sumith Yadav"
        required
        error={errors.aadharName?.message}
        {...register("aadharName")}
      />
      <div className="flex flex-col gap-1.5">
        <label
          className="text-sm font-semibold text-gray-700
                           dark:text-gray-300"
        >
          Occupation
        </label>
        <select
          {...register("occupation")}
          className="w-full px-4 py-3 rounded-xl border text-sm
                     font-medium bg-white dark:bg-gray-900
                     text-gray-900 dark:text-gray-100
                     border-gray-200 dark:border-gray-700
                     focus:outline-none focus:ring-3
                     focus:ring-[#1a3c5e]/20 focus:border-[#1a3c5e]
                     transition-all duration-200"
        >
          <option value="">Select occupation (optional)</option>
          {OCCUPATIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

//  Step 4: Account & Branch + Summary
function Step4({ register, errors, watch, allData }) {
  const selectedType     = watch("accountType");
  const selectedBranchId = watch("branchId");
  const selectedBranch   = BRANCHES.find(
    (b) => b.id === Number(selectedBranchId)
  );

  const maskedAadhaar = allData.aadharNumber
    ? `XXXX XXXX ${allData.aadharNumber.slice(-4)}`
    : "—";

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Choose your account type and preferred branch.
      </p>

      {/* Account type cards */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-gray-700
                           dark:text-gray-300">
          Account Type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {[
            {
              value: "savings", Icon: PiggyBank,
              title: "Savings Account",
              desc:  "Earn interest on deposits. Best for personal savings.",
              iconBg: "bg-blue-100 dark:bg-blue-900/40",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              value: "current", Icon: Building2,
              title: "Current Account",
              desc:  "No transaction limits. Ideal for business use.",
              iconBg: "bg-amber-100 dark:bg-amber-900/40",
              iconColor: "text-amber-600 dark:text-amber-400",
            },
          ].map(({ value, Icon, title, desc, iconBg, iconColor }) => {
            const isSelected = selectedType === value;
            return (
              <label key={value}
                     className={`
                       flex items-center gap-3 p-4 rounded-2xl
                       border-2 cursor-pointer transition-all
                       ${isSelected
                         ? "border-[#1a3c5e] bg-[#1a3c5e]/5 dark:border-blue-400 dark:bg-blue-400/10"
                         : "border-gray-100 dark:border-gray-800 hover:border-gray-300"
                       }
                     `}>
                <input type="radio" value={value}
                       {...register("accountType")}
                       className="sr-only" />
                <div className={`w-10 h-10 rounded-xl flex items-center
                                 justify-center flex-shrink-0 ${iconBg}`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black text-gray-900
                                dark:text-white">{title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {desc}
                  </p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2
                                 flex items-center justify-center
                                 flex-shrink-0 transition-all
                                 ${isSelected
                                   ? "border-[#1a3c5e] dark:border-blue-400"
                                   : "border-gray-300 dark:border-gray-600"
                                 }`}>
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full
                                    bg-[#1a3c5e] dark:bg-blue-400" />
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {errors.accountType && (
          <p className="text-xs text-red-500 font-medium">
            {errors.accountType.message}
          </p>
        )}
      </div>

      {/* Branch dropdown */}
      <BranchDropdown
        label="Select Branch"
        name="branchId"
        required
        error={errors.branchId?.message}
        {...register("branchId")}
      />

      {/* Application summary */}
      <div className="rounded-2xl border border-gray-100
                      dark:border-gray-800 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50
                        border-b border-gray-100 dark:border-gray-800">
          <p className="text-xs font-black text-gray-600
                        dark:text-gray-400 uppercase tracking-wide">
            Application Summary
          </p>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {[
            { label: "Name",
              value: `${allData.firstName ?? ""} ${allData.lastName ?? ""}`.trim() || "—" },
            { label: "Email",        value: allData.email       || "—" },
            { label: "Phone",        value: allData.phoneNumber || "—" },
            { label: "Address",
              value: [allData.streetAddress, allData.city,
                      allData.state, allData.pincode]
                       .filter(Boolean).join(", ") || "—" },
            { label: "PAN",          value: allData.panNumber   || "—" },
            { label: "Aadhaar",      value: maskedAadhaar               },
            { label: "Account Type",
              value: selectedType === "savings"
                ? "Savings Account"
                : selectedType === "current"
                ? "Current Account" : "—" },
            { label: "Branch",
              value: selectedBranch
                ? `${selectedBranch.name}, ${selectedBranch.city}`
                : "—" },
          ].map(({ label, value }) => (
            <div key={label}
                 className="flex items-start justify-between
                            px-4 py-3 gap-3">
              <span className="text-xs text-gray-500
                               dark:text-gray-400 flex-shrink-0">
                {label}
              </span>
              <span className="text-xs font-bold text-gray-900
                               dark:text-white text-right
                               break-words max-w-[60%]">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Add this AccountSlotToken component (before the main export) ──
function AccountSlotToken({ slot, applicationData }) {
  const formatTime = (time) => {
    if (!time) return "—";
    const [h, m] = time.toString().split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center gap-6"
    >
      {/* Success icon */}
      <div
        className="w-20 h-20 rounded-full bg-emerald-100
                      dark:bg-emerald-900/30 flex items-center
                      justify-center"
      >
        <CheckCircle2 size={40} className="text-emerald-500" />
      </div>

      <div>
        <h2
          className="text-xl font-black text-gray-900
                       dark:text-white mb-1"
        >
          Application Submitted!
        </h2>
        <p
          className="text-sm text-gray-500 dark:text-gray-400
                      max-w-xs mx-auto"
        >
          Visit the branch at your assigned time for KYC verification to
          complete your account opening.
        </p>
      </div>

      {/* Token card */}
      <div className="w-full max-w-sm">
        {/* Token header */}
        <div
          className="bg-[#1a3c5e] rounded-t-2xl p-5 text-center
                        relative overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-gradient-to-tr
                          from-white/5 to-transparent
                          pointer-events-none"
          />
          <p
            className="text-white/60 text-xs font-semibold
                        uppercase tracking-widest mb-1"
          >
            Account Application Token
          </p>
          <p
            className="text-white text-3xl sm:text-4xl font-black
                        tracking-widest font-mono"
          >
            {slot.tokenNumber}
          </p>
          <div
            className="mt-2 inline-flex items-center gap-1.5
                          px-3 py-1 rounded-full bg-white/10"
          >
            <span className="text-white/70 text-xs font-semibold">
              {slot.accountType === "savings"
                ? "Savings Account"
                : "Current Account"}
            </span>
          </div>
        </div>

        {/* Details */}
        <div
          className="bg-white dark:bg-gray-900 rounded-b-2xl
                        border border-t-0 border-gray-100
                        dark:border-gray-800 overflow-hidden"
        >
          {/* Branch + Date */}
          <div
            className="grid grid-cols-2 divide-x divide-gray-100
                          dark:divide-gray-800 border-b
                          border-gray-100 dark:border-gray-800"
          >
            <div className="p-4 text-center">
              <div
                className="flex items-center justify-center
                              gap-1.5 mb-1"
              >
                <Building2
                  size={13}
                  className="text-[#1a3c5e] dark:text-blue-400"
                />
                <p
                  className="text-[10px] font-bold text-gray-400
                              uppercase tracking-wide"
                >
                  Branch
                </p>
              </div>
              <p
                className="text-sm font-black text-gray-900
                            dark:text-white leading-snug"
              >
                {slot.branchName}
              </p>
            </div>
            <div className="p-4 text-center">
              <div
                className="flex items-center justify-center
                              gap-1.5 mb-1"
              >
                <Calendar
                  size={13}
                  className="text-[#1a3c5e] dark:text-blue-400"
                />
                <p
                  className="text-[10px] font-bold text-gray-400
                              uppercase tracking-wide"
                >
                  Date
                </p>
              </div>
              <p
                className="text-sm font-black text-gray-900
                            dark:text-white leading-snug"
              >
                {formatDate(slot.slotDate)}
              </p>
            </div>
          </div>

          {/* Time slot */}
          <div
            className="p-4 border-b border-gray-100
                          dark:border-gray-800"
          >
            <div
              className="flex items-center justify-center
                            gap-2 mb-2"
            >
              <Clock size={15} className="text-amber-500 flex-shrink-0" />
              <p
                className="text-xs font-bold text-gray-500
                            dark:text-gray-400 uppercase
                            tracking-wide"
              >
                KYC Verification Slot
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div
                className="px-4 py-2 rounded-xl bg-[#1a3c5e]/8
                              dark:bg-blue-400/10"
              >
                <p
                  className="text-base font-black text-[#1a3c5e]
                              dark:text-blue-400"
                >
                  {formatTime(slot.startTime)}
                </p>
              </div>
              <span className="text-gray-400 font-black text-lg">→</span>
              <div
                className="px-4 py-2 rounded-xl bg-[#1a3c5e]/8
                              dark:bg-blue-400/10"
              >
                <p
                  className="text-base font-black text-[#1a3c5e]
                              dark:text-blue-400"
                >
                  {formatTime(slot.endTime)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              15-minute slot · Please arrive 5 minutes early
            </p>
          </div>

          {/* Applicant summary */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <p
              className="text-[10px] font-black text-gray-400
                          uppercase tracking-wide mb-2"
            >
              Applicant
            </p>
            <p
              className="text-sm font-bold text-gray-900
                          dark:text-white"
            >
              {applicationData.firstName} {applicationData.lastName}
            </p>
            <p className="text-xs text-gray-500">{applicationData.email}</p>
          </div>
        </div>

        {/* Dashed cut */}
        <div className="flex items-center gap-2 my-1 px-2">
          <div
            className="flex-1 border-t-2 border-dashed
                          border-gray-200 dark:border-gray-700"
          />
          <div
            className="w-2 h-2 rounded-full bg-gray-200
                          dark:bg-gray-700"
          />
          <div
            className="flex-1 border-t-2 border-dashed
                          border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* What to bring */}
        <div
          className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl
                        border border-amber-200 dark:border-amber-800
                        p-4"
        >
          <p
            className="text-xs font-black text-amber-800
                        dark:text-amber-300 uppercase tracking-wide
                        mb-2 flex items-center gap-1.5"
          >
            <Info size={12} />
            What to Bring
          </p>
          <ul className="space-y-1.5">
            {[
              "Original Aadhaar card",
              "Original PAN card",
              "This application token",
              "Passport size photograph",
              "Initial deposit amount (if applicable)",
              "Arrive before your slot time",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-xs
                             text-amber-700 dark:text-amber-400"
              >
                <span className="flex-shrink-0 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          size="md"
          onClick={() => navigate("/user/accounts")}
          className="flex-1"
        >
          Go to My Accounts
        </Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => window.print()}
          className="flex-1 no-print"
        >
          Print Token
        </Button>
      </div>
    </motion.div>
  );
}

export default function AccountApplicationPage() {
  const navigate = useNavigate();
  const { fetchAccounts } = useAccounts();
  const [currentStep, setStep] = useState(1);
  const [completed, setComp] = useState([]);
  const [allData, setAllData] = useState({});
  const [submitting, setSub] = useState(false);
  const [apiError, setErr] = useState("");
  const [slotResult, setSlot] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SCHEMAS[currentStep - 1]),
    mode: "onTouched",
  });

  const STEP_FIELDS = {
    1: [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "email",
    ],
    2: ["streetAddress", "city", "state", "pincode", "country"],
    3: ["panNumber", "panName", "aadharNumber", "aadharName"],
    4: ["accountType", "branchId"],
  };

  const handleNext = async () => {
    const valid = await trigger(STEP_FIELDS[currentStep]);
    if (!valid) return;
    const stepData = {};
    STEP_FIELDS[currentStep].forEach((f) => {
      stepData[f] = watch(f);
    });
    if (currentStep === 3) stepData.occupation = watch("occupation");
    setAllData((prev) => ({ ...prev, ...stepData }));
    setComp((prev) => [...new Set([...prev, currentStep])]);
    setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => s - 1);

  // ── UPDATED: no API call, generate frontend slot ──
  const handleSubmitApp = async () => {
    const valid = await trigger(STEP_FIELDS[4]);
    if (!valid) return;

    const finalData = {
      ...allData,
      accountType: watch("accountType"),
      branchId: Number(watch("branchId")),
    };

    try {
      setSub(true);
      setErr("");

      // Simulate a brief loading delay for UX
      await new Promise((r) => setTimeout(r, 800));

      // Generate frontend-only slot
      const slot = generateFrontendSlot(
        finalData.branchId,
        finalData.accountType,
        BRANCHES,
      );

      setComp([1, 2, 3, 4]);
      setSlot({ ...slot, accountType: finalData.accountType });
      toast.success("Application submitted! Your branch slot is ready.");
    } catch (err) {
      setErr("Something went wrong. Please try again.");
    } finally {
      setSub(false);
    }
  };

  // ── Show slot token after submission ──
  if (slotResult) {
    return (
      <>
        <Helmet>
          <title>Account Application — NexaBank</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div
          className="max-w-2xl mx-auto flex flex-col
                        gap-5 sm:gap-6"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-[#1a3c5e]
                            flex items-center justify-center
                            shadow-md"
            >
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black
                             text-gray-900 dark:text-white"
              >
                Account Application
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your application has been submitted successfully.
              </p>
            </div>
          </div>
          <Card padding="md">
            <AccountSlotToken slot={slotResult} applicationData={allData} />
          </Card>
        </div>
      </>
    );
  }
  return (
    <>
      <Helmet>
        <title>Account Application — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="max-w-2xl mx-auto flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl bg-[#1a3c5e]
                          flex items-center justify-center shadow-md"
          >
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-black text-gray-900
                           dark:text-white"
            >
              Account Application
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Fill in your details to apply for a new bank account.
            </p>
          </div>
        </div>

        <Card padding="md">
          {/* Stepper */}
          <StepperBar currentStep={currentStep} completedSteps={completed} />

          {/* API Error */}
          <Alert
            type="error"
            message={apiError}
            show={!!apiError}
            onClose={() => setErr("")}
            className="mb-5"
          />

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              {currentStep === 1 && (
                <Step1 register={register} errors={errors} />
              )}
              {currentStep === 2 && (
                <Step2 register={register} errors={errors} />
              )}
              {currentStep === 3 && (
                <Step3 register={register} errors={errors} />
              )}
              {currentStep === 4 && (
                <Step4
                  register={register}
                  errors={errors}
                  watch={watch}
                  allData={allData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div
            className="flex items-center justify-between mt-6 pt-5
                          border-t border-gray-100 dark:border-gray-800"
          >
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={
                currentStep === 1
                  ? () => navigate("/user/accounts")
                  : handleBack
              }
            >
              <ArrowLeft size={15} />
              {currentStep === 1 ? "Cancel" : "Back"}
            </Button>

            {currentStep < 4 ? (
              <Button type="button" size="md" onClick={handleNext}>
                Continue
                <ArrowRight size={15} />
              </Button>
            ) : (
              <Button
                type="button"
                size="md"
                loading={submitting}
                onClick={handleSubmitApp}
              >
                <ShieldCheck size={15} />
                Submit Application
              </Button>
            )}
          </div>
        </Card>

        {/* Security note */}
        <p className="text-center text-xs text-gray-400">
          Your data is encrypted and secure. Contact support@nexabank.in for
          help.
        </p>
      </div>
    </>
  );
}
