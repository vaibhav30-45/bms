import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  User,
  CreditCard,
  FileText,
  Video,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getPendingKyc, approveKyc, rejectKyc } from "../../../api/kycApi";
import { getErrorMessage } from "../../../utils/helpers";
import { formatDateTime } from "../../../utils/formatDate";
import { KYC_STATUS } from "../../../utils/constants";
import Card from "../../../components/common/Card";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import Alert from "../../../components/common/Alert";
import Modal from "../../../components/common/Modal";


// Reject modal with reason input
function RejectModal({ isOpen, onClose, onConfirm, loading, kycId }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Please provide a rejection reason.");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters.");
      return;
    }
    onConfirm(kycId, reason.trim());
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject KYC Application"
      size="md"
      footer={
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="danger"
            size="md"
            loading={loading}
            onClick={handleConfirm}
            className="sm:flex-1"
          >
            <XCircle size={15} />
            Confirm Rejection
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleClose}
            className="sm:flex-1"
          >
            Cancel
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Warning */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-xl
                        bg-red-50 dark:bg-red-900/20
                        border border-red-200 dark:border-red-800"
        >
          <AlertTriangle
            size={16}
            className="text-red-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-sm text-red-700 dark:text-red-400">
            This action will reject KYC #{kycId}. The user will be notified and
            can resubmit their application. This cannot be undone.
          </p>
        </div>

        {/* Reason input */}
        <div className="flex flex-col gap-1.5">
          <label
            className="text-sm font-semibold text-gray-700
                             dark:text-gray-300"
          >
            Rejection Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            rows={4}
            placeholder="e.g. Document image is blurry and unreadable. Please resubmit with a clear scan of your Aadhaar card."
            className={`
              w-full px-4 py-3 rounded-xl border text-sm font-medium
              bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
              placeholder:text-gray-400 resize-none
              focus:outline-none focus:ring-3 transition-all
              ${
                error
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-gray-200 dark:border-gray-700 focus:ring-red-500/20 focus:border-red-400"
              }
            `}
          />
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          <p className="text-xs text-gray-400">
            {reason.length}/500 characters · Minimum 10 characters
          </p>
        </div>
      </div>
    </Modal>
  );
}


// KYC detail expanded view
function KycDetail({ kyc }) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
                      gap-4"
      >
        {/* Personal info */}
        <div className="space-y-3">
          <p
            className="text-xs font-black text-gray-500 dark:text-gray-400
                        uppercase tracking-wide"
          >
            Identity Info
          </p>
          {[
            { label: "Full Name", value: kyc.userName },
            { label: "Aadhaar (Masked)", value: kyc.aadharNumber },
            { label: "Aadhaar Name", value: kyc.aadharName },
            { label: "PAN (Masked)", value: kyc.panNumber },
            { label: "PAN Name", value: kyc.panName },
            { label: "Date of Birth", value: kyc.dateOfBirth },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                className="text-[10px] font-bold text-gray-400
                            uppercase tracking-wide"
              >
                {label}
              </p>
              <p
                className="text-sm font-semibold text-gray-900
                            dark:text-white font-mono break-all"
              >
                {value ?? "—"}
              </p>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="space-y-3">
          <p
            className="text-xs font-black text-gray-500 dark:text-gray-400
                        uppercase tracking-wide"
          >
            Address & Documents
          </p>
          <div>
            <p
              className="text-[10px] font-bold text-gray-400
                          uppercase tracking-wide"
            >
              Address
            </p>
            <p
              className="text-sm font-semibold text-gray-900
                          dark:text-white break-words leading-snug"
            >
              {kyc.address ?? "—"}
            </p>
          </div>
          <div>
            <p
              className="text-[10px] font-bold text-gray-400
                          uppercase tracking-wide mb-2"
            >
              Document Status
            </p>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Info", done: kyc.infoSubmitted, Icon: CreditCard },
                {
                  label: "Document",
                  done: kyc.documentsSubmitted,
                  Icon: FileText,
                },
                { label: "Video", done: kyc.videoSubmitted, Icon: Video },
              ].map(({ label, done, Icon }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-3 py-2
                                 rounded-xl text-xs font-bold
                                 ${
                                   done
                                     ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                     : "bg-gray-50 dark:bg-gray-800 text-gray-400"
                                 }`}
                >
                  <Icon size={13} />
                  {label}
                  {done ? (
                    <CheckCircle2
                      size={12}
                      className="ml-auto text-emerald-500"
                    />
                  ) : (
                    <XCircle size={12} className="ml-auto text-gray-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document paths */}
        <div className="space-y-3">
          <p
            className="text-xs font-black text-gray-500 dark:text-gray-400
                        uppercase tracking-wide"
          >
            Submitted Files
          </p>
          <div>
            <p
              className="text-[10px] font-bold text-gray-400
                          uppercase tracking-wide mb-1.5"
            >
              PDF Document
            </p>
            {kyc.documentPath ? (
              <div
                className="flex items-center gap-2 p-3 rounded-xl
                              bg-blue-50 dark:bg-blue-900/20
                              border border-blue-100 dark:border-blue-800"
              >
                <FileText size={15} className="text-blue-500 flex-shrink-0" />
                <p
                  className="text-xs text-blue-700 dark:text-blue-400
                              break-all font-mono"
                >
                  {kyc.documentPath}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Not submitted</p>
            )}
          </div>
          <div>
            <p
              className="text-[10px] font-bold text-gray-400
                          uppercase tracking-wide mb-1.5"
            >
              Video
            </p>
            {kyc.videoPath ? (
              <div
                className="flex items-center gap-2 p-3 rounded-xl
                              bg-purple-50 dark:bg-purple-900/20
                              border border-purple-100 dark:border-purple-800"
              >
                <Video size={15} className="text-purple-500 flex-shrink-0" />
                <p
                  className="text-xs text-purple-700 dark:text-purple-400
                              break-all font-mono"
                >
                  {kyc.videoPath}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Not submitted</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// KYC request card
function KycCard({ kyc, onApprove, onReject, approving, rejecting }) {
  const [expanded, setExpanded] = useState(false);

  const allStepsDone =
    kyc.infoSubmitted && kyc.documentsSubmitted && kyc.videoSubmitted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border
                 border-gray-100 dark:border-gray-800 overflow-hidden"
    >
      {/* Card header */}
      <div className="p-5">
        <div
          className="flex flex-col sm:flex-row sm:items-start
                        justify-between gap-4"
        >
          {/* User info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-11 h-11 rounded-2xl bg-[#1a3c5e]
                            flex items-center justify-center flex-shrink-0"
            >
              <span className="text-white font-black text-lg">
                {kyc.userName?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3
                  className="text-base font-black text-gray-900
                               dark:text-white"
                >
                  {kyc.userName ?? "Unknown User"}
                </h3>
                <Badge variant="PENDING" size="sm" dot />
              </div>
              <p className="text-xs text-gray-400 mb-2">
                KYC ID: #{kyc.kycId} · User ID: #{kyc.userId}
              </p>

              {/* Step indicators */}
              <div className="flex items-center gap-2">
                {[
                  { label: "Info", done: kyc.infoSubmitted },
                  { label: "Doc", done: kyc.documentsSubmitted },
                  { label: "Video", done: kyc.videoSubmitted },
                ].map(({ label, done }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-1 px-2 py-1
                                   rounded-lg text-[10px] font-bold
                                   ${
                                     done
                                       ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                                       : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                                   }`}
                  >
                    {done ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="success"
              onClick={() => onApprove(kyc.kycId)}
              loading={approving}
              disabled={rejecting || !allStepsDone}
              className="!bg-emerald-600 hover:!bg-emerald-700"
            >
              <CheckCircle2 size={14} />
              Approve
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => onReject(kyc.kycId)}
              loading={rejecting}
              disabled={approving}
            >
              <XCircle size={14} />
              Reject
            </Button>
          </div>
        </div>

        {/* Incomplete warning */}
        {!allStepsDone && (
          <div
            className="mt-3 flex items-center gap-2 p-2.5 rounded-xl
                          bg-amber-50 dark:bg-amber-900/20
                          border border-amber-200 dark:border-amber-800"
          >
            <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Not all steps completed. Approve is disabled until all documents
              are submitted.
            </p>
          </div>
        )}

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="flex items-center gap-1.5 mt-4 text-xs
                     font-semibold text-gray-400 dark:text-gray-500
                     hover:text-gray-600 dark:hover:text-gray-300
                     transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? "Hide details" : "View details"}
        </button>
      </div>

      {/* Expandable detail */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5">
              <KycDetail kyc={kyc} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Main Admin KYC Page
// ─────────────────────────────────────────────
export default function AdminKycPage() {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectModal, setRejectModal] = useState({ open: false, kycId: null });
  const [actionLoading, setActionLoading] = useState({});

  const fetchKycList = useCallback(async () => {
    try {
      setError("");
      const res = await getPendingKyc();
      const list = res.data?.data ?? res.data ?? [];
      setKycList(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKycList();
  }, [fetchKycList]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchKycList();
    setRefreshing(false);
    toast.success("KYC list refreshed!");
  };

  // ── Approve ──
  const handleApprove = async (kycId) => {
    if (
      !window.confirm(
        `Approve KYC #${kycId}? This will grant full banking access to the user.`,
      )
    )
      return;

    try {
      setActionLoading((prev) => ({ ...prev, [`approve_${kycId}`]: true }));
      await approveKyc(kycId);
      toast.success(`KYC #${kycId} approved successfully!`);
      setKycList((prev) => prev.filter((k) => k.kycId !== kycId));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, [`approve_${kycId}`]: false }));
    }
  };

  // ── Open reject modal ──
  const handleOpenReject = (kycId) => {
    setRejectModal({ open: true, kycId });
  };

  // ── Confirm reject ──
  const handleConfirmReject = async (kycId, reason) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`reject_${kycId}`]: true }));
      await rejectKyc(kycId);
      toast.success(`KYC #${kycId} rejected.`);
      setKycList((prev) => prev.filter((k) => k.kycId !== kycId));
      setRejectModal({ open: false, kycId: null });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading((prev) => ({ ...prev, [`reject_${kycId}`]: false }));
    }
  };

  // Filter by search
  const filtered = kycList.filter((k) => {
    const term = searchTerm.toLowerCase();
    return (
      k.userName?.toLowerCase().includes(term) ||
      String(k.kycId).includes(term) ||
      String(k.userId).includes(term)
    );
  });

  return (
    <>
      <Helmet>
        <title>KYC Requests — NexaBank Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-center
                        justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl bg-amber-500
                            flex items-center justify-center shadow-md"
            >
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1
                className="text-xl sm:text-2xl font-black text-gray-900
                             dark:text-white"
              >
                KYC Requests
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {kycList.length} pending request
                {kycList.length !== 1 ? "s" : ""} to review
              </p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       transition-colors disabled:opacity-50 self-start"
            aria-label="Refresh"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Admin notice */}
        <div
          className="flex items-start gap-3 p-4 rounded-2xl
                        bg-amber-50 dark:bg-amber-900/20
                        border border-amber-200 dark:border-amber-800"
        >
          <AlertTriangle
            size={16}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <div>
            <p
              className="text-sm font-bold text-amber-800
                          dark:text-amber-300 mb-1"
            >
              Review Guidelines
            </p>
            <ul className="space-y-1">
              {[
                "Verify that Aadhaar and PAN details match the uploaded documents",
                "Check that the video clearly shows the user holding their ID",
                "Approve is disabled if not all 3 steps are submitted",
                "Rejection requires a clear reason for the user to correct",
              ].map((g) => (
                <li
                  key={g}
                  className="text-xs text-amber-700 dark:text-amber-400
                               flex items-start gap-1.5"
                >
                  <span className="flex-shrink-0 mt-0.5">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Error */}
        <Alert
          type="error"
          title="Error loading KYC requests"
          message={error}
          show={!!error}
          onClose={() => setError("")}
        />

        {/* Search */}
        {kycList.length > 0 && (
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2
                               text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search by name, KYC ID or User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border
                         border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-900 text-sm
                         text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-3
                         focus:ring-amber-500/20 focus:border-amber-500
                         transition-all"
            />
          </div>
        )}

        {/* KYC list */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" text="Loading KYC requests..." />
          </div>
        ) : kycList.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={CheckCircle2}
              title="All clear!"
              description="No pending KYC requests at this time. Check back later."
            />
          </Card>
        ) : filtered.length === 0 ? (
          <Card padding="lg">
            <EmptyState
              icon={Search}
              title="No results found"
              description={`No KYC requests match "${searchTerm}".`}
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Result count */}
            {searchTerm && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filtered.length} of {kycList.length} requests
              </p>
            )}

            {filtered.map((kyc) => (
              <KycCard
                key={kyc.kycId}
                kyc={kyc}
                onApprove={handleApprove}
                onReject={handleOpenReject}
                approving={!!actionLoading[`approve_${kyc.kycId}`]}
                rejecting={!!actionLoading[`reject_${kyc.kycId}`]}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reject modal */}
      <RejectModal
        isOpen={rejectModal.open}
        onClose={() => setRejectModal({ open: false, kycId: null })}
        onConfirm={handleConfirmReject}
        loading={!!actionLoading[`reject_${rejectModal.kycId}`]}
        kycId={rejectModal.kycId}
      />
    </>
  );
}
