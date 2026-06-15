/**
 * src/components/NotifyDropdown.jsx
 *
 * Cara pakai di Navbar.jsx — tambahkan di sebelah Bell button:
 *
 *   import NotifyDropdown from "./NotifyDropdown";
 *   ...
 *   {user && <NotifyDropdown />}
 */

import { useState, useEffect, useRef } from "react";
import {
  Bell, Hotel, UtensilsCrossed, CheckCircle2,
  XCircle, Clock, X, RefreshCw,
} from "lucide-react";
import { getNotifications } from "../services/notificationService";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  pending:   { label: "Menunggu",    icon: Clock,         color: "text-amber-500",   bg: "bg-amber-50",   dot: "bg-amber-400"   },
  confirmed: { label: "Dikonfirmasi",icon: CheckCircle2,  color: "text-emerald-500", bg: "bg-emerald-50", dot: "bg-emerald-400" },
  completed: { label: "Selesai",     icon: CheckCircle2,  color: "text-violet-500",  bg: "bg-violet-50",  dot: "bg-violet-400"  },
  cancelled: { label: "Dibatalkan",  icon: XCircle,       color: "text-rose-500",    bg: "bg-rose-50",    dot: "bg-rose-400"    },
  checked_in:{ label: "Checked In",  icon: CheckCircle2,  color: "text-blue-500",    bg: "bg-blue-50",    dot: "bg-blue-400"    },
};

const fmtDate = (d) => d
  ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
  : "";

const fmtRelative = (d) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return "Baru saja";
  if (mins < 60)  return `${mins} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
};

function NotifyItem({ item }) {
  const s   = STATUS[item.status] || STATUS.pending;
  const Icon = item.type === "hotel" ? Hotel : UtensilsCrossed;
  // eslint-disable-next-line no-unused-vars
  const StatusIcon = s.icon;

  return (
    <div className="flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">
      {/* Type icon */}
      <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center shrink-0 mt-0.5`}>
        <Icon size={16} className={s.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
            {item.title}
          </p>
          <span className="text-xs text-slate-400 shrink-0 mt-0.5">
            {fmtRelative(item.updated_at)}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{item.subtitle}</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          <span className={`text-xs font-medium ${s.color}`}>{s.label}</span>
          {item.date && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{fmtDate(item.date)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function NotifyDropdown() {
  const [open,    setOpen]    = useState(false);
  const [notifs,  setNotifs]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [read,    setRead]    = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen((v) => {
      if (!v) {
        fetchNotifs();
        setRead(true);
      }
      return !v;
    });
  };

  // unread = notifikasi yang belum pernah dibuka (sebelum click pertama)
  // eslint-disable-next-line no-unused-vars
  const unreadCount = !read ? notifs.length : 0;
  // badge: hitung dari status aktif (cancelled/completed) saat pertama load
  const badgeCount = notifs.filter((n) =>
    n.status === "cancelled" || n.status === "completed"
  ).length;

  return (
    <div className="relative" ref={ref}>
      {/* ── Bell button ── */}
      <button
        onClick={handleOpen}
        className={`relative w-9 h-9 flex items-center justify-center rounded-xl border transition-all
          ${open
            ? "bg-white/15 border-orange-400/30"
            : "bg-white/5 hover:bg-white/10 border-white/8"
          } text-white/50 hover:text-white`}
      >
        <Bell size={15} />
        {/* Badge merah */}
        {!read && badgeCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm">
            {badgeCount > 9 ? "9+" : badgeCount}
          </span>
        )}
        {!read && badgeCount === 0 && (
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden z-50"
          style={{ animation: "notify-drop 0.18s ease-out" }}
        >
          <style>{`
            @keyframes notify-drop {
              from { opacity: 0; transform: translateY(-8px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0)   scale(1);     }
            }
          `}</style>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">Notifikasi</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {notifs.length} aktivitas booking
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={fetchNotifs}
                disabled={loading}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-95 overflow-y-auto divide-y divide-slate-50">
            {loading ? (
              // skeleton
              <div className="p-4 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 w-3/4 bg-slate-200 rounded" />
                      <div className="h-3 w-1/2 bg-slate-100 rounded" />
                      <div className="h-3 w-1/3 bg-slate-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifs.length === 0 ? (
              // empty state
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                  <Bell size={22} className="text-slate-300" />
                </div>
                <p className="text-slate-600 font-semibold text-sm">Belum ada notifikasi</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  Notifikasi booking hotel & restoran Anda akan muncul di sini
                </p>
              </div>
            ) : (
              notifs.map((item) => (
                <NotifyItem key={`${item.type}-${item.id}`} item={item} />
              ))
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total {notifs.length} aktivitas</span>
                <div className="flex items-center gap-3">
                  {Object.entries({
                    confirmed: "text-emerald-500",
                    pending:   "text-amber-500",
                    cancelled: "text-rose-500",
                    completed: "text-violet-500",
                  }).map(([status, color]) => {
                    const count = notifs.filter((n) => n.status === status).length;
                    return count > 0 ? (
                      <span key={status} className={`font-medium ${color}`}>
                        {count} {STATUS[status]?.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotifyDropdown;