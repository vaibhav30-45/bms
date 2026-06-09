import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { ShieldCheck } from "lucide-react";
import {
  submitKycInfo,
  uploadKycDocument,
  uploadKycVideo,
  getKycStatus,
  cancelKyc,
} from "../../../api/kycApi";
import { KYC_STATUS, isKycVerified } from "../../../utils/constants";
import { getErrorMessage } from "../../../utils/helpers";
import KycStepper from "../../../components/kyc/KycStepper";
import KycInfoForm from "../../../components/kyc/KycInfoForm";
import KycDocumentUpload from "../../../components/kyc/KycDocumentUpload";
import KycVideoUpload from "../../../components/kyc/KycVideoUpload";
import KycStatusCard from "../../../components/kyc/KycStatusCard";
import Loader from "../../../components/common/Loader";
import Card from "../../../components/common/Card";

// Derive which step to show based on KYC data flags
function deriveStep(kycData) {
  if (!kycData) return 1;
  if (!kycData.infoSubmitted) return 1;
  if (!kycData.documentsSubmitted) return 2;
  if (!kycData.videoSubmitted) return 3;
  return null; // All done — show status
}

// Derive completed steps array
function deriveCompleted(kycData) {
  if (!kycData) return [];
  const done = [];
  if (kycData.infoSubmitted) done.push(1);
  if (kycData.documentsSubmitted) done.push(2);
  if (kycData.videoSubmitted) done.push(3);
  return done;
}

export default function KycPage() {
  const [kycData, setKycData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [stepError, setStepError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompleted] = useState([]);
  const [showForm, setShowForm] = useState(true);

  const fetchKycStatus = useCallback(async () => {
    try {
      const res = await getKycStatus();
      const data = res.data?.data ?? res.data ?? null;
      setKycData(data);

      if (data) {
        const step = deriveStep(data);
        const done = deriveCompleted(data);
        setCompleted(done);

        // Show form only if incomplete and not yet pending/approved/rejected
        if (
          step !== null &&
          data.kycStatus !== KYC_STATUS.PENDING &&
          data.kycStatus !== KYC_STATUS.SUBMITTED &&
          !isKycVerified(data.kycStatus) &&
          data.kycStatus !== KYC_STATUS.REJECTED
        ) {
          setCurrentStep(step);
          setShowForm(true);
        } else {
          setShowForm(false);
        }
      } else {
        // No KYC started yet
        setCurrentStep(1);
        setCompleted([]);
        setShowForm(true);
      }
    } catch {
      // No KYC record — fresh start
      setKycData(null);
      setCurrentStep(1);
      setCompleted([]);
      setShowForm(true);
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycStatus();
  }, [fetchKycStatus]);

  // ── Step 1: Submit KYC info ──
  const handleInfoSubmit = async (data) => {
    try {
      setStepLoading(true);
      setStepError("");
      const res = await submitKycInfo(data);
      const updated = res.data?.data ?? res.data;
      setKycData(updated);
      setCompleted([1]);
      setCurrentStep(2);
      toast.success("Identity information saved!");
    } catch (err) {
      setStepError(getErrorMessage(err));
    } finally {
      setStepLoading(false);
    }
  };

  // ── Step 2: Upload document ──
  const handleDocumentSubmit = async (file) => {
    try {
      setStepLoading(true);
      setStepError("");
      const res = await uploadKycDocument(file);
      const updated = res.data?.data ?? res.data;
      setKycData(updated);
      setCompleted([1, 2]);
      setCurrentStep(3);
      toast.success("Document uploaded successfully!");
    } catch (err) {
      setStepError(getErrorMessage(err));
    } finally {
      setStepLoading(false);
    }
  };

  // ── Step 3: Upload video ──
  const handleVideoSubmit = async (file) => {
    try {
      setStepLoading(true);
      setStepError("");
      const res = await uploadKycVideo(file);
      const updated = res.data?.data ?? res.data;
      setKycData(updated);
      setCompleted([1, 2, 3]);
      setShowForm(false);
      toast.success("KYC submitted successfully! Awaiting admin review.");
      // Refresh to get latest status
      setTimeout(fetchKycStatus, 1000);
    } catch (err) {
      setStepError(getErrorMessage(err));
    } finally {
      setStepLoading(false);
    }
  };

  // ── Cancel / Reset KYC ──
  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset your KYC? " +
          "All submitted information will be deleted.",
      )
    )
      return;

    try {
      setCancelLoading(true);
      await cancelKyc();
      setKycData(null);
      setCurrentStep(1);
      setCompleted([]);
      setShowForm(true);
      setStepError("");
      toast.success("KYC reset successfully. You can start fresh.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setCancelLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader size="lg" text="Loading KYC status..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>KYC Verification — NexaBank</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6 max-w-2xl">
        {/* Page header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck
              size={22}
              className="text-[#1a3c5e] dark:text-blue-400"
            />
            <h1
              className="text-xl sm:text-2xl font-black text-gray-900
                           dark:text-white"
            >
              KYC Verification
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete your Know Your Customer (KYC) process to unlock all banking
            features.
          </p>
        </div>

        {/* What is KYC — info box */}
        <div
          className="p-4 rounded-2xl bg-[#1a3c5e]/5 dark:bg-blue-400/5
                        border border-[#1a3c5e]/10 dark:border-blue-400/10"
        >
          <p
            className="text-xs font-bold text-[#1a3c5e] dark:text-blue-400
                        uppercase tracking-wide mb-1.5"
          >
            Why KYC?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            As per RBI guidelines, all banking customers must complete KYC
            verification. This process verifies your identity using your Aadhaar
            and PAN card details.
          </p>
        </div>

        {/* Current status card — shown when KYC submitted/approved/rejected */}
        {kycData && !showForm && (
          <KycStatusCard
            kycData={kycData}
            onCancel={handleCancel}
            cancelLoading={cancelLoading}
          />
        )}

        {/* KYC form steps */}
        {showForm && (
          <Card padding="md">
            {/* Stepper */}
            <div className="mb-6 sm:mb-8">
              <KycStepper
                currentStep={currentStep}
                completedSteps={completedSteps}
              />
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {currentStep === 1 && (
                  <KycInfoForm
                    onSubmit={handleInfoSubmit}
                    loading={stepLoading}
                    error={stepError}
                    defaultValues={
                      kycData?.infoSubmitted
                        ? {
                            aadharNumber: kycData.aadharNumber,
                            aadharName: kycData.aadharName,
                            dateOfBirth: kycData.dateOfBirth,
                            address: kycData.address,
                            panNumber: kycData.panNumber,
                            panName: kycData.panName,
                          }
                        : undefined
                    }
                  />
                )}

                {currentStep === 2 && (
                  <KycDocumentUpload
                    onSubmit={handleDocumentSubmit}
                    loading={stepLoading}
                    error={stepError}
                    alreadyUploaded={kycData?.documentsSubmitted}
                  />
                )}

                {currentStep === 3 && (
                  <KycVideoUpload
                    onSubmit={handleVideoSubmit}
                    loading={stepLoading}
                    error={stepError}
                    alreadyUploaded={kycData?.videoSubmitted}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </Card>
        )}

        {/* Reset option when in form mode */}
        {showForm && kycData && (
          <div className="text-center">
            <button
              onClick={handleCancel}
              disabled={cancelLoading}
              className="text-sm text-red-400 hover:text-red-600
                         dark:hover:text-red-300 transition-colors
                         disabled:opacity-50"
            >
              Reset KYC and start over
            </button>
          </div>
        )}

        {/* Helptext at bottom */}
        <div className="text-center pb-2">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            Having trouble? Your data is encrypted and secure.
            <br />
            Contact support at support@nexabank.in
          </p>
        </div>
      </div>
    </>
  );
}
