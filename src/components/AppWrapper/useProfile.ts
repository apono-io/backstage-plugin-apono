import { identityApiRef, ProfileInfo, useApi } from "@backstage/core-plugin-api";
import { useState, useCallback, useEffect } from "react";

export const useProfile = () => {
  const identityApi = useApi(identityApiRef);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profile, setProfile] = useState<ProfileInfo | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await identityApi.getProfileInfo();
      setProfile(res);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [identityApi]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refresh: fetchProfile,
  };
};

