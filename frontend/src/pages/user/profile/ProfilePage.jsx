import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit3,
  Save,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useProfile } from "../../../hooks/useProfile";
import { updateProfile } from "../../../api/profileApi";
import { getErrorMessage } from "../../../utils/helpers";
import { formatDate } from "../../../utils/formatDate";
import {
  KYC_STATUS,
  isKycVerified,
  normalizeKycStatus,
} from "../../../utils/constants";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import Button from "../../../components/common/Button";
import Badge from "../../../components/common/Badge";
import Alert from "../../../components/common/Alert";
import Loader from "../../../components/common/Loader";

const updateSchema = yup.object({
  firstName: yup.string().min(2).max(50).required("First name is required"),
  lastName: yup.string().min(2).max(50).required("Last name is required"),
  phoneNumber: yup
    .string()
    .matches(/^[6-9]\d{9}$/, "Valid 10-digit Indian number starting with 6–9")
    .nullable()
    .transform((v) => (v === "" ? null : v)),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().max(100).nullable(),
  pincode: yup
    .string()
    .matches(/^[1-9]\d{5}$/, "6 digits, cannot start with 0")
    .nullable()
    .transform((v) => (v === "" ? null : v)),
});

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div
      className="flex items-start gap-3 py-3 border-b
                    border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800
                      flex items-center justify-center flex-shrink-0 mt-0.5"
      >
        <Icon size={15} className="text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold text-gray-400 dark:text-gray-500
                      uppercase tracking-wide mb-0.5"
        >
          {label}
        </p>
        {badge ? (
          <Badge variant={value} dot size="md" />
        ) : (
          <p
            className="text-sm font-semibold text-gray-900 dark:text-white
                        break-words"
          >
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

function KycStatusCard({ kycStatus, onNavigate }) {
  const isApproved = isKycVerified(kycStatus);
  const isPending =
    kycStatus === KYC_STATUS.PENDING || kycStatus === KYC_STATUS.SUBMITTED;
  const isRejected = kycStatus === KYC_STATUS.REJECTED;

  const bgColor = isApproved
    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
    : isPending
      ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
      : isRejected
        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
        : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";

  const Icon = isApproved ? CheckCircle2 : AlertCircle;
  const iconColor = isApproved
    ? "text-emerald-500"
    : isPending
      ? "text-blue-500"
      : isRejected
        ? "text-red-500"
        : "text-amber-500";
  const titleColor = isApproved
    ? "text-emerald-800 dark:text-emerald-300"
    : isPending
      ? "text-blue-800 dark:text-blue-300"
      : isRejected
        ? "text-red-800 dark:text-red-300"
        : "text-amber-800 dark:text-amber-300";
  const descColor = isApproved
    ? "text-emerald-700 dark:text-emerald-400"
    : isPending
      ? "text-blue-700 dark:text-blue-400"
      : isRejected
        ? "text-red-700 dark:text-red-400"
        : "text-amber-700 dark:text-amber-400";

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center
                     justify-between gap-3 p-4 rounded-2xl border ${bgColor}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={`flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div>
          <p className={`text-sm font-bold ${titleColor}`}>
            KYC Status: {kycStatus ?? "Incomplete"}
          </p>
          <p className={`text-xs mt-0.5 ${descColor}`}>
            {isApproved
              ? "Your identity has been verified successfully."
              : isPending
                ? "Your documents are under review. Usually takes 24 hours."
                : isRejected
                  ? "Your KYC was rejected. Please resubmit with correct documents."
                  : "Complete KYC to unlock all banking features."}
          </p>
        </div>
      </div>
      {!isApproved && !isPending && (
        <Button
          size="sm"
          variant={isRejected ? "danger" : "secondary"}
          onClick={onNavigate}
          className="flex-shrink-0 self-start sm:self-auto"
        >
          <ShieldCheck size={13} />
          {isRejected ? "Resubmit KYC" : "Complete KYC"}
        </Button>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, setProfile, loading, fetchProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({ resolver: yupResolver(updateSchema) });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        pincode: profile.pincode ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);
      setApiError("");
      const res = await updateProfile(data);
      const updated = res.data?.data ?? res.data;
      setProfile(updated);
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setApiError("");
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
        city: profile.city ?? "",
        state: profile.state ?? "",
        pincode: profile.pincode ?? "",
      });
    }
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profile — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6 max-w-4xl">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div>
            <h1
              className="text-xl sm:text-2xl font-black text-gray-900
                           dark:text-white"
            >
              My Profile
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Manage your personal information
            </p>
          </div>
          {!editing && (
            <Button
              size="md"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              <Edit3 size={15} />
              Edit Profile
            </Button>
          )}
        </div>

        {/* KYC banner */}
        {profile && (
          <KycStatusCard
            kycStatus={profile.kycStatus}
            onNavigate={() => navigate("/user/kyc")}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Left — avatar + read-only */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Card padding="md">
              <div className="flex flex-col items-center text-center">
                <div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br
                                from-[#1a3c5e] to-[#0f2033] flex items-center
                                justify-center shadow-xl mb-4"
                >
                  <span className="text-white text-3xl font-black">
                    {profile?.firstName?.charAt(0) ?? "U"}
                  </span>
                </div>
                <h2
                  className="text-lg font-black text-gray-900
                               dark:text-white"
                >
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p
                  className="text-sm text-gray-500 dark:text-gray-400
                              mt-0.5 break-all"
                >
                  {profile?.email}
                </p>
                <div className="mt-3">
                  <Badge
                    variant={profile?.kycStatus ?? "INCOMPLETE"}
                    dot
                    size="md"
                  />
                </div>
              </div>
            </Card>

            <Card padding="md">
              <h3
                className="text-xs font-black text-gray-900 dark:text-white
                             mb-3 uppercase tracking-wide"
              >
                Account Info
              </h3>
              <InfoRow
                icon={Mail}
                label="Email (read-only)"
                value={profile?.email}
              />
              {profile?.dateOfBirth && (
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={formatDate(profile.dateOfBirth)}
                />
              )}
              <InfoRow
                icon={ShieldCheck}
                label="KYC Status"
                value={profile?.kycStatus ?? "INCOMPLETE"}
                badge
              />
            </Card>
          </div>

          {/* Right — form or view */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <div className="flex items-center justify-between mb-5">
                <h3
                  className="text-xs font-black text-gray-900
                               dark:text-white uppercase tracking-wide"
                >
                  {editing ? "Edit Information" : "Personal Information"}
                </h3>
                {editing && (
                  <button
                    onClick={handleCancel}
                    className="p-1.5 rounded-lg text-gray-400
                                     hover:bg-gray-100 dark:hover:bg-gray-800
                                     transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <Alert
                type="error"
                message={apiError}
                show={!!apiError}
                onClose={() => setApiError("")}
                className="mb-5"
              />

              {editing ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <Input
                    label="Phone Number"
                    name="phoneNumber"
                    placeholder="9876543210"
                    prefix={<Phone size={15} />}
                    error={errors.phoneNumber?.message}
                    hint="10-digit Indian number starting with 6–9"
                    {...register("phoneNumber")}
                  />
                  <Input
                    label="Address"
                    name="address"
                    placeholder="123 MG Road, Sector 5"
                    {...register("address")}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      name="city"
                      placeholder="Mumbai"
                      {...register("city")}
                    />
                    <Input
                      label="State"
                      name="state"
                      placeholder="Maharashtra"
                      error={errors.state?.message}
                      {...register("state")}
                    />
                    <Input
                      label="Pincode"
                      name="pincode"
                      placeholder="400001"
                      error={errors.pincode?.message}
                      {...register("pincode")}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      type="submit"
                      size="md"
                      loading={saving}
                      disabled={!isDirty}
                      className="sm:flex-1"
                    >
                      <Save size={15} />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      size="md"
                      variant="outline"
                      onClick={handleCancel}
                      className="sm:flex-1"
                    >
                      <X size={15} />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    <InfoRow
                      icon={User}
                      label="First Name"
                      value={profile?.firstName}
                    />
                    <InfoRow
                      icon={User}
                      label="Last Name"
                      value={profile?.lastName}
                    />
                  </div>
                  <InfoRow
                    icon={Phone}
                    label="Phone Number"
                    value={profile?.phoneNumber}
                  />
                  <InfoRow
                    icon={User}
                    label="Address"
                    value={profile?.address}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
                    <InfoRow icon={User} label="City" value={profile?.city} />
                    <InfoRow icon={User} label="State" value={profile?.state} />
                    <InfoRow
                      icon={User}
                      label="Pincode"
                      value={profile?.pincode}
                    />
                  </div>
                  <div
                    className="mt-4 pt-4 border-t border-gray-50
                                  dark:border-gray-800"
                  >
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Mail size={12} />
                      Email address cannot be changed for security reasons.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
