import { useState, useCallback } from "react";
import { getMyAccounts } from "../api/accountApi";
import { useAccounts as useAccountContext } from "../context/AccountContext";
import { getErrorMessage } from "../utils/helpers";

export function useAccounts() {
  const { accounts, setAccounts, selectedAccount, setSelectedAccount } =
    useAccountContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyAccounts();
      const list = res.data?.data ?? res.data ?? [];
      setAccounts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [setAccounts]);

  return {
    accounts,
    selectedAccount,
    setSelectedAccount,
    loading,
    error,
    fetchAccounts,
  };
}
