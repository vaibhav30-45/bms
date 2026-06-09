import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CreditCard,
  User,
  Calendar,
  MapPin,
  ArrowRight,
  FileText,
} from "lucide-react";
import { kycInfoSchema } from "../../utils/validators";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

export default function KycInfoForm({
  onSubmit,
  loading,
  error,
  defaultValues,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(kycInfoSchema),
    defaultValues: defaultValues ?? {},
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-5"
    >
      <Alert type="error" message={error} show={!!error} className="mb-1" />

      {/* Aadhaar section */}
      <div
        className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20
                      border border-blue-100 dark:border-blue-800"
      >
        <p
          className="text-xs font-black text-blue-800 dark:text-blue-300
                      uppercase tracking-wide mb-3 flex items-center gap-1.5"
        >
          <CreditCard size={13} />
          Aadhaar Details
        </p>
        <div className="flex flex-col gap-4">
          <Input
            label="Aadhaar Number"
            name="aadharNumber"
            placeholder="234567891234"
            required
            prefix={<CreditCard size={15} />}
            error={errors.aadharNumber?.message}
            hint="12 digits, must start with 2–9"
            {...register("aadharNumber")}
          />
          <Input
            label="Name as on Aadhaar"
            name="aadharName"
            placeholder="Arjun Sharma"
            required
            prefix={<User size={15} />}
            error={errors.aadharName?.message}
            {...register("aadharName")}
          />
        </div>
      </div>

      {/* PAN section */}
      <div
        className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20
                      border border-amber-100 dark:border-amber-800"
      >
        <p
          className="text-xs font-black text-amber-800 dark:text-amber-300
                      uppercase tracking-wide mb-3 flex items-center gap-1.5"
        >
          <FileText size={13} />
          PAN Card Details
        </p>
        <div className="flex flex-col gap-4">
          <Input
            label="PAN Number"
            name="panNumber"
            placeholder="ABCDE1234F"
            required
            prefix={<FileText size={15} />}
            error={errors.panNumber?.message}
            hint="Format: ABCDE1234F (5 letters, 4 digits, 1 letter — uppercase)"
            {...register("panNumber")}
          />
          <Input
            label="Name as on PAN"
            name="panName"
            placeholder="Arjun Sharma"
            required
            prefix={<User size={15} />}
            error={errors.panName?.message}
            {...register("panName")}
          />
        </div>
      </div>

      {/* Common fields */}
      <div className="flex flex-col gap-4">
        <Input
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          required
          prefix={<Calendar size={15} />}
          error={errors.dateOfBirth?.message}
          {...register("dateOfBirth")}
        />
        <Input
          label="Address (as on Aadhaar)"
          name="address"
          placeholder="123 MG Road, Sector 5, Panipat, Haryana"
          required
          prefix={<MapPin size={15} />}
          error={errors.address?.message}
          hint="10–300 characters"
          {...register("address")}
        />
      </div>

      <Button type="submit" size="lg" fullWidth loading={loading}>
        Save & Continue
        <ArrowRight size={16} />
      </Button>
    </form>
  );
}
