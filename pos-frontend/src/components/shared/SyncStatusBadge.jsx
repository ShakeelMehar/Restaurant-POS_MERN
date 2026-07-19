import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FiWifiOff } from "react-icons/fi";
import { db } from "../../utils/db";

// Persistent "Pending Sync: N" indicator (docs/v3 06_Errors §2).
// Polls the local queue — cheap IndexedDB counts, no network.
const SyncStatusBadge = () => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["syncQueueCounts"],
    queryFn: async () => {
      const [pending, failed, oldestPending] = await Promise.all([
        db.ordersQueue.where("status").equals("pending").count(),
        db.ordersQueue.where("status").equals("failed").count(),
        db.ordersQueue.where("status").equals("pending").sortBy("createdAt")
          .then((rows) => rows[0]?.createdAt || null),
      ]);
      return { pending, failed, oldestPending };
    },
    refetchInterval: 10000,
  });

  const pending = data?.pending || 0;
  const failed = data?.failed || 0;
  const total = pending + failed;

  if (total === 0) return null;

  const hasFailed = failed > 0;
  // Industry practice (e.g. Square) caps offline sessions at ~24h — past that,
  // unsynced records are an operational risk worth escalating visually.
  const STALE_MS = 24 * 60 * 60 * 1000;
  const isStale =
    data?.oldestPending && Date.now() - new Date(data.oldestPending).getTime() > STALE_MS;
  const escalated = hasFailed || isStale;

  return (
    <button
      onClick={() => navigate("/orders")}
      title={
        hasFailed
          ? `${failed} order(s) failed to sync — action needed`
          : isStale
          ? `Oldest unsynced order is over 24h old — check connectivity`
          : `${pending} order(s) waiting to sync`
      }
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[12px] font-bold transition-colors ${
        escalated
          ? "bg-error/10 text-error hover:bg-error/20"
          : "bg-warning/10 text-warning hover:bg-warning/20"
      }`}
    >
      <FiWifiOff size={13} />
      <span className="hidden sm:inline">
        {hasFailed ? "Sync issues:" : isStale ? "Sync overdue:" : "Pending sync:"}
      </span>
      {total}
    </button>
  );
};

export default SyncStatusBadge;
