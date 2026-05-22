import { useSyncExternalStore, useEffect } from "react";
import { db } from "@/lib/db";

export function useDb() {
  const data = useSyncExternalStore(
    (callback) => db.subscribe(callback),
    () => db.getDataSync()
  );

  // Trigger a database reload from the server when mounting to ensure fresh data
  useEffect(() => {
    db.load();
  }, []);

  return data;
}
