export const PAYMENT_MODES = ["CASH"];

export const WITHDRAW_MODES = ["CASH"];

export const TRANSFER_MODES = ["NEFT", "IMPS", "UPI", "RTGS", "CASH"];

export const TRANSACTION_TYPES = ["DEPOSIT", "WITHDRAWAL", "TRANSFER"];

export const MIN_CASH_TRANSACTION_AMOUNT = 100;

export const TRANSACTION_STATUS = {
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  PENDING: "PENDING",
};

export const KYC_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",

  // Backend statuses
  VERIFIED: "VERIFIED",
  SUBMITTED: "SUBMITTED",

  REJECTED: "REJECTED",
  NOT_SUBMITTED: "NOT_SUBMITTED",
};

// VERIFIED should behave same as APPROVED
export const isKycVerified = (status) =>
  status === KYC_STATUS.APPROVED || status === KYC_STATUS.VERIFIED;

// Normalize backend status → frontend UI status
export const normalizeKycStatus = (status) => {
  if (!status) return KYC_STATUS.NOT_SUBMITTED;

  // Approved states
  if (status === KYC_STATUS.APPROVED || status === KYC_STATUS.VERIFIED) {
    return KYC_STATUS.APPROVED;
  }

  // Pending states
  if (status === KYC_STATUS.PENDING || status === KYC_STATUS.SUBMITTED) {
    return KYC_STATUS.PENDING;
  }

  return status;
};

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  PENDING: "PENDING",
  SUSPENDED: "SUSPENDED",
};

export const ROLES = {
  USER: "ROLE_USER",
  ADMIN: "ROLE_ADMIN",
};

export const ACCOUNT_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  FROZEN: "FROZEN",
  CLOSED: "CLOSED",
};

export const SLOT_STATUS = {
  ASSIGNED: "ASSIGNED",
  COMPLETED: "COMPLETED",
  MISSED: "MISSED",
};
