import { useEffect, useState } from "react";

/**
 * Returns true once the component has mounted on the client.
 * Use to gate any UI that reads from a persisted zustand store
 * to avoid SSR hydration mismatches.
 */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}
