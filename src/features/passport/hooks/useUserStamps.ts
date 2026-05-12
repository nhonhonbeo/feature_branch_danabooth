import { useMemo } from "react";
import { usePassportStore } from "@/features/passport/store";
import { MOCK_STAMPS } from "../lib/mock-stamps";

/**
 * Feature flag to enable/disable mock stamps for activated accounts.
 * Set to false when ready to use real backend data exclusively.
 */
const USE_MOCK_STAMPS = true;

/**
 * A hook that returns the user's stamps.
 * If USE_MOCK_STAMPS is true and the user's passport is activated,
 * it mixes mock stamps with the real ones to demonstrate the "checked-in" UI.
 */
export function useUserStamps() {
  const passport = usePassportStore((s) => s.passport);
  const realStamps = usePassportStore((s) => s.stamps);

  return useMemo(() => {
    // If not using mocks or passport isn't activated, return actual stamps
    if (!USE_MOCK_STAMPS || !passport?.isActivated) {
      return realStamps;
    }

    // Merge real stamps with mock stamps (real stamps take precedence)
    const combined = [...realStamps];
    
    for (const mockStamp of MOCK_STAMPS) {
      const alreadyCollected = combined.some(
        (s) => s.locationId === mockStamp.locationId
      );
      
      if (!alreadyCollected) {
        combined.push(mockStamp);
      }
    }

    // Sort by collectedAt ascending
    return combined.sort(
      (a, b) => new Date(a.collectedAt).getTime() - new Date(b.collectedAt).getTime()
    );
  }, [passport?.isActivated, realStamps]);
}
