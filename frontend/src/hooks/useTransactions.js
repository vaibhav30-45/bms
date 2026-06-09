import { useState, useCallback } from "react";
import {
  assignDepositSlot,
  assignWithdrawSlot,
  transfer,
  verifyAccount,
  getStatement,
} from "../api/transactionApi";
import { getErrorMessage } from "../utils/helpers";

export function useTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Deposit Slot (replaces direct deposit) ──
  const handleAssignDepositSlot = useCallback(async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await assignDepositSlot(data);
      return { success: true, data: res.data?.data ?? res.data };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAssignWithdrawSlot = useCallback(async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await assignWithdrawSlot(data);
      return { success: true, data: res.data?.data ?? res.data };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTransfer = useCallback(async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await transfer(data);
      return { success: true, data: res.data?.data ?? res.data };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerifyAccount = useCallback(async (accountNumber) => {
    try {
      setLoading(true);
      setError("");
      const res = await verifyAccount(accountNumber);
      return { success: true, data: res.data?.data ?? res.data };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleGetStatement = useCallback(async (data) => {
    try {
      setLoading(true);
      setError("");
      const res = await getStatement(data);
      return { success: true, data: res.data?.data ?? res.data };
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    setError,
    handleAssignDepositSlot,
    handleAssignWithdrawSlot,
    handleTransfer,
    handleVerifyAccount,
    handleGetStatement,
  };
}
