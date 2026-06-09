import { useState, useCallback } from "react";
import { getProfile } from "../api/profileApi";
import { getErrorMessage } from "../utils/helpers";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getProfile();
      setProfile(res.data?.data ?? res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, setProfile, loading, error, fetchProfile };
}
