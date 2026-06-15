import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  X,
  LayoutDashboard,
  AlertTriangle,
  Users,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { FaChair } from "react-icons/fa";
import { MdTableRestaurant, MdRestaurant } from "react-icons/md";

// ── Lazy sub-components ──────────────────────────────────────────────────────

const StatCard = lazy(() =>
  Promise.resolve({
    default: function StatCard({ icon: Icon, label, value, gradient }) {
      return (
        <div
          className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.65)",
            boxShadow: "0 2px 16px 0 rgba(30,40,80,0.07)",
          }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: gradient }}
          >
            <Icon size={21} color="#fff" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 truncate">
              {label}
            </p>
            <p className="text-xl font-bold text-slate-800 truncate">{value}</p>
          </div>
          <div
            className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-10"
            style={{ background: gradient }}
          />
        </div>
      );
    },
  })
);

const DeleteModal = lazy(() =>
  Promise.resolve({
    default: function DeleteModal({ onCancel, onConfirm }) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center"
            style={{ border: "1px solid rgba(30,40,80,0.08)" }}
          >
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-rose-50">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Meja?</h3>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">
              Data meja akan dihapus secara permanen dan tidak dapat dipulihkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                style={{
                  background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)",
                  boxShadow: "0 4px 14px 0 rgba(244,63,94,0.35)",
                }}
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      );
    },
  })
);

// ── Sort header ──────────────────────────────────────────────────────────────

function SortTh({ label, field, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th
      className="px-5 py-3.5 text-left cursor-pointer select-none group"
      onClick={() => onSort(field)}
    >
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
          active ? "text-orange-500" : "text-slate-400 group-hover:text-slate-600"
        }`}
      >
        {label}
        {active ? (
          sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ChevronDown size={12} className="opacity-30" />
        )}
      </span>
    </th>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  if (s === "available" || s === "tersedia") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-emerald-700" style={{ background: "#d1fae5" }}>
        <CheckCircle2 size={11} strokeWidth={2.5} />
        Tersedia
      </span>
    );
  }
  if (s === "occupied" || s === "terisi") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-rose-600" style={{ background: "#fff1f2" }}>
        <XCircle size={11} strokeWidth={2.5} />
        Terisi
      </span>
    );
  }
  if (s === "reserved" || s === "reserved") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-amber-700" style={{ background: "#fef3c7" }}>
        <Clock size={11} strokeWidth={2.5} />
        Reserved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-slate-600" style={{ background: "#f1f5f9" }}>
      {status}
    </span>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

function AdminRestaurantTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [deleteId, setDeleteId] = useState(null);

  const loadTables = async () => {
    try {
      setLoading(true);
      const { getRestaurantTables } = await import("../../services/restaurantTableService");
      const response = await getRestaurantTables();
      setTables(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTables();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = tables
    .filter(
      (t) =>
        t.restaurant_name?.toLowerCase().includes(search.toLowerCase()) ||
        String(t.table_number)?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const val = (v) =>
        typeof v[sortField] === "string"
          ? v[sortField].toLowerCase()
          : Number(v[sortField]);
      return sortDir === "asc"
        ? val(a) > val(b) ? 1 : -1
        : val(a) < val(b) ? 1 : -1;
    });

  const confirmDelete = async () => {
    try {
      const { deleteRestaurantTable } = await import("../../services/restaurantTableService");
      await deleteRestaurantTable(deleteId);
      setDeleteId(null);
      loadTables();
    } catch (error) {
      console.error(error);
    }
  };

  // Stats
  const totalCapacity = tables.reduce((s, t) => s + (Number(t.capacity) || 0), 0);
  const available = tables.filter((t) => ["available", "tersedia"].includes((t.status || "").toLowerCase())).length;
  // eslint-disable-next-line no-unused-vars
  const occupied = tables.filter((t) => ["occupied", "terisi"].includes((t.status || "").toLowerCase())).length;
  const restaurants = [...new Set(tables.map((t) => t.restaurant_name))].length;

  const cols = [
    { label: "ID", field: "id" },
    { label: "Restoran", field: "restaurant_name" },
    { label: "No. Meja", field: "table_number" },
    { label: "Kapasitas", field: "capacity" },
    { label: "Status", field: "status" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #fff7ed 0%, #f8fafb 55%, #fef3e2 100%)",
      }}
    >
      {/* Delete Modal */}
      <Suspense fallback={null}>
        {deleteId && (
          <DeleteModal onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
        )}
      </Suspense>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Page Header ── */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
                boxShadow: "0 6px 20px 0 rgba(245,158,11,0.32)",
              }}
            >
              <MdTableRestaurant size={23} color="#fff" />
            </div>
            <div>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest">
                Restaurant Management
              </span>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight tracking-tight">
                Manajemen Meja
              </h1>
            </div>
          </div>

          <Link
            to="/admin/restaurant-tables/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
              boxShadow: "0 4px 16px 0 rgba(245,158,11,0.35)",
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Tambah Meja
          </Link>
        </div>

        {/* ── Stat Cards ── */}
        <Suspense
          fallback={
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-white/60 animate-pulse" />
              ))}
            </div>
          }
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={MdTableRestaurant}
              label="Total Meja"
              value={tables.length}
              gradient="linear-gradient(135deg, #92400e 0%, #f59e0b 100%)"
            />
            <StatCard
              icon={MdRestaurant}
              label="Total Restoran"
              value={`${restaurants} resto`}
              gradient="linear-gradient(135deg, #064e3b 0%, #059669 100%)"
            />
            <StatCard
              icon={FaChair}
              label="Meja Tersedia"
              value={`${available} meja`}
              gradient="linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)"
            />
            <StatCard
              icon={Users}
              label="Total Kapasitas"
              value={`${totalCapacity} kursi`}
              gradient="linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
            />
          </div>
        </Suspense>

        {/* ── Table Card ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.7)",
            boxShadow: "0 4px 32px 0 rgba(92,40,14,0.08)",
          }}
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-700 text-sm">Daftar Meja Restoran</h2>
              {!loading && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {filtered.length} dari {tables.length} meja ditampilkan
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari restoran atau nomor meja..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                style={{ background: "#f1f5f9", border: "1px solid #e2e8f0" }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #fffbeb 0%, #f1f5f9 100%)" }}>
                  {cols.map(({ label, field }) => (
                    <SortTh
                      key={field}
                      label={label}
                      field={field}
                      sortField={sortField}
                      sortDir={sortDir}
                      onSort={handleSort}
                    />
                  ))}
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      {[...Array(6)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div
                            className="h-4 rounded-lg bg-slate-100 animate-pulse"
                            style={{ width: `${50 + Math.random() * 40}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: "#fff7ed" }}
                        >
                          <MdTableRestaurant size={30} className="text-amber-200" />
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium text-sm">Tidak ada meja ditemukan</p>
                          <p className="text-slate-400 text-xs mt-1">Coba ubah kata kunci pencarian Anda</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((table, idx) => (
                    <tr
                      key={table.id}
                      className="border-t border-slate-50 transition-colors duration-150 hover:bg-amber-50/30"
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(255,251,235,0.5)",
                      }}
                    >
                      {/* ID */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-amber-800"
                          style={{ background: "#fef3c7" }}
                        >
                          {table.id}
                        </span>
                      </td>

                      {/* Restaurant */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
                          >
                            <MdRestaurant size={13} className="text-emerald-700" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm truncate max-w-40">
                            {table.restaurant_name}
                          </span>
                        </div>
                      </td>

                      {/* Table Number */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <Hash size={12} className="text-slate-400" />
                          <span className="text-slate-800 font-bold text-sm">{table.table_number}</span>
                        </div>
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                          <Users size={13} className="text-slate-400" />
                          <span className="font-medium">{table.capacity} kursi</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={table.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/restaurant-tables/edit/${table.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{
                              background: "#fef9c3",
                              color: "#92400e",
                              border: "1px solid #fde68a",
                            }}
                          >
                            <Pencil size={11} strokeWidth={2.5} />
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(table.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                            style={{
                              background: "#fff1f2",
                              color: "#be123c",
                              border: "1px solid #fecdd3",
                            }}
                          >
                            <Trash2 size={11} strokeWidth={2.5} />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-6 py-3 border-t border-slate-100"
              style={{ background: "rgba(255,251,235,0.5)" }}
            >
              <span className="text-xs text-slate-400">
                Menampilkan{" "}
                <span className="font-semibold text-slate-600">{filtered.length}</span> dari{" "}
                <span className="font-semibold text-slate-600">{tables.length}</span> meja
              </span>
              <div className="flex items-center gap-1.5">
                <LayoutDashboard size={12} className="text-slate-300" />
                <span className="text-xs text-slate-300">Table Management System</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurantTables;