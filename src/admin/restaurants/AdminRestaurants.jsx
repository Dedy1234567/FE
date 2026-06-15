import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronUp,
  ChevronDown,
  Star,
  MapPin,
  X,
  LayoutDashboard,
  AlertTriangle,
  UtensilsCrossed,
} from "lucide-react";
import { FaUtensils, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { MdRestaurantMenu, MdLocationCity } from "react-icons/md";

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
            boxShadow: "0 2px 16px 0 rgba(20,50,30,0.07)",
          }}
        >
          <div
            className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: gradient }}
          >
            <Icon size={22} color="#fff" />
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
            style={{ border: "1px solid rgba(20,80,40,0.08)" }}
          >
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-rose-50">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Restoran?</h3>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">
              Data restoran akan dihapus secara permanen dan tidak dapat dipulihkan.
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
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
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
          active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
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

// ── Star Rating display ──────────────────────────────────────────────────────

function StarRating({ value }) {
  const num = parseFloat(value) || 0;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={11}
            className={s <= Math.round(num) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-600">{num.toFixed(1)}</span>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [deleteId, setDeleteId] = useState(null);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const { getRestaurants } = await import("../../services/restaurantService");
      const response = await getRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRestaurants();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = restaurants
    .filter(
      (r) =>
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase())
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
      const { deleteRestaurant } = await import("../../services/restaurantService");
      await deleteRestaurant(deleteId);
      setDeleteId(null);
      loadRestaurants();
    } catch (error) {
      console.error(error);
    }
  };

  // Stats
  const totalCities = [...new Set(restaurants.map((r) => r.city))].length;
  const avgRating =
    restaurants.length > 0
      ? (restaurants.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / restaurants.length).toFixed(1)
      : "0.0";
  const topRated = restaurants.filter((r) => parseFloat(r.rating) >= 4.5).length;

  const cols = [
    { label: "ID", field: "id" },
    { label: "Nama Restoran", field: "name" },
    { label: "Kota", field: "city" },
    { label: "Rating", field: "rating" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #f0fdf4 0%, #f8fafb 55%, #ecfdf5 100%)",
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
                background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
                boxShadow: "0 6px 20px 0 rgba(5,150,105,0.32)",
              }}
            >
              <FaUtensils size={20} color="#fff" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
                Restaurant Management
              </span>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight tracking-tight">
                Manajemen Restoran
              </h1>
            </div>
          </div>

          <Link
            to="/admin/restaurants/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
              boxShadow: "0 4px 16px 0 rgba(5,150,105,0.35)",
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Tambah Restoran
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
              icon={MdRestaurantMenu}
              label="Total Restoran"
              value={restaurants.length}
              gradient="linear-gradient(135deg, #064e3b 0%, #059669 100%)"
            />
            <StatCard
              icon={MdLocationCity}
              label="Total Kota"
              value={`${totalCities} kota`}
              gradient="linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)"
            />
            <StatCard
              icon={FaStar}
              label="Rata-rata Rating"
              value={`★ ${avgRating}`}
              gradient="linear-gradient(135deg, #92400e 0%, #d97706 100%)"
            />
            <StatCard
              icon={FaMapMarkerAlt}
              label="Rating ≥ 4.5"
              value={`${topRated} restoran`}
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
            boxShadow: "0 4px 32px 0 rgba(6,78,59,0.08)",
          }}
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-700 text-sm">Daftar Restoran</h2>
              {!loading && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {filtered.length} dari {restaurants.length} restoran ditampilkan
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama restoran atau kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                }}
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
                <tr style={{ background: "linear-gradient(90deg, #f0fdf4 0%, #f1f5f9 100%)" }}>
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
                      {[...Array(5)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div
                            className="h-4 rounded-lg bg-slate-100 animate-pulse"
                            style={{ width: `${55 + Math.random() * 35}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: "#f0fdf4" }}
                        >
                          <UtensilsCrossed size={28} className="text-emerald-200" />
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium text-sm">
                            Tidak ada restoran ditemukan
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            Coba ubah kata kunci pencarian Anda
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((restaurant, idx) => (
                    <tr
                      key={restaurant.id}
                      className="border-t border-slate-50 transition-colors duration-150 hover:bg-emerald-50/30"
                      style={{
                        background:
                          idx % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(240,253,244,0.5)",
                      }}
                    >
                      {/* ID */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-emerald-700"
                          style={{ background: "#d1fae5" }}
                        >
                          {restaurant.id}
                        </span>
                      </td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
                          >
                            <FaUtensils size={11} className="text-emerald-700" />
                          </div>
                          <span className="text-slate-800 font-semibold truncate max-w-45">
                            {restaurant.name}
                          </span>
                        </div>
                      </td>

                      {/* City */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span className="text-slate-600 text-sm">{restaurant.city}</span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-5 py-4">
                        <StarRating value={restaurant.rating} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/restaurants/edit/${restaurant.id}`}
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
                            onClick={() => setDeleteId(restaurant.id)}
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
              style={{ background: "rgba(240,253,244,0.5)" }}
            >
              <span className="text-xs text-slate-400">
                Menampilkan{" "}
                <span className="font-semibold text-slate-600">{filtered.length}</span> dari{" "}
                <span className="font-semibold text-slate-600">{restaurants.length}</span> restoran
              </span>
              <div className="flex items-center gap-1.5">
                <LayoutDashboard size={12} className="text-slate-300" />
                <span className="text-xs text-slate-300">Restaurant Management System</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRestaurants;