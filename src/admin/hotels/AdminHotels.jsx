import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  Plus, Pencil, Trash2, Hotel, MapPin,
  Star, Building2, Search, ChevronUp, ChevronDown, RefreshCw,
} from "lucide-react";
import { getHotels, deleteHotel } from "../../services/hotelService";

// ─── Lazy sub-components ──────────────────────────────────────────────────────
const StatCards   = lazy(() => Promise.resolve({ default: _StatCards   }));
const HotelTable  = lazy(() => Promise.resolve({ default: _HotelTable  }));
const DeleteModal = lazy(() => Promise.resolve({ default: _DeleteModal }));

// ─── Skeletons ────────────────────────────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-2 flex-1">
        <div className="h-3 w-20 bg-slate-200 rounded" />
        <div className="h-6 w-12 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50">
          <div className="w-7 h-7 rounded-lg bg-slate-200 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-6 w-20 bg-slate-200 rounded-lg" />
          <div className="flex gap-2">
            <div className="h-7 w-14 bg-slate-200 rounded-lg" />
            <div className="h-7 w-14 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12}
          className={s <= r ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
      <span className="ml-1.5 text-xs font-medium text-slate-500">{r}.0</span>
    </div>
  );
}

// ─── _StatCards ───────────────────────────────────────────────────────────────
function _StatCards({ hotels, filtered }) {
  const cities = [...new Set(hotels.map((h) => h.city))].length;
  const avgRating = hotels.length > 0
    ? (hotels.reduce((s, h) => s + Number(h.rating || 0), 0) / hotels.length).toFixed(1)
    : "0.0";

  const cards = [
    { icon: Hotel,     label: "Total Hotel",     value: hotels.length,   color: "bg-teal-500"   },
    { icon: MapPin,    label: "Kota",             value: cities,          color: "bg-violet-500" },
    { icon: Star,      label: "Rating Rata-rata", value: avgRating,       color: "bg-amber-500"  },
    { icon: Building2, label: "Hasil Filter",     value: filtered.length, color: "bg-slate-500"  },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
          <div className={`p-3 rounded-xl ${color} shrink-0`}>
            <Icon size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide leading-none mb-1">{label}</p>
            <p className="text-2xl font-bold text-slate-800 tabular-nums leading-none">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SortIcon ─────────────────────────────────────────────────────────────────
function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return <ChevronDown size={13} className="inline ml-1 text-slate-300" />;
  return sortDir === "asc"
    ? <ChevronUp   size={13} className="inline ml-1 text-teal-500" />
    : <ChevronDown size={13} className="inline ml-1 text-teal-500" />;
}

// ─── _HotelTable ─────────────────────────────────────────────────────────────
function _HotelTable({ filtered, hotels, loading, search, setSearch, sortField, sortDir, handleSort, setDeleteId }) {
  const cols = [
    { label: "ID",     field: "id"     },
    { label: "Nama",   field: "name"   },
    { label: "Kota",   field: "city"   },
    { label: "Rating", field: "rating" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="font-semibold text-slate-700 text-sm">Daftar Hotel</h2>
          {!loading && (
            <p className="text-xs text-slate-400 mt-0.5">{filtered.length} dari {hotels.length} hotel</p>
          )}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari hotel atau kota..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              {cols.map(({ label, field }) => (
                <th key={field}
                  className="px-5 py-3 text-left cursor-pointer hover:text-teal-600 transition-colors select-none whitespace-nowrap"
                  onClick={() => handleSort(field)}
                >
                  {label}
                  <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
                </th>
              ))}
              <th className="px-5 py-3 text-left text-xs uppercase tracking-wide text-slate-500">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-0"><TableSkeleton /></td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20">
                  <Hotel size={40} className="mx-auto text-slate-200 mb-3" />
                  <p className="text-slate-500 font-medium text-sm">Tidak ada hotel ditemukan</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada data hotel"}
                  </p>
                </td>
              </tr>
            ) : (
              filtered.map((hotel, idx) => (
                <tr key={hotel.id}
                  className={`hover:bg-teal-50/40 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}
                >
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">
                      {hotel.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                        <Hotel size={14} className="text-teal-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm leading-none">{hotel.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{hotel.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-violet-400 shrink-0" />
                      <span className="text-slate-600 text-sm">{hotel.city}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <StarRating rating={hotel.rating} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/hotels/edit/${hotel.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium text-xs transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </Link>
                      <button
                        onClick={() => setDeleteId(hotel.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-100 font-medium text-xs transition-colors"
                      >
                        <Trash2 size={12} /> Hapus
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
        <div className="px-6 py-3 border-t border-slate-100 text-xs text-slate-400">
          Menampilkan {filtered.length} dari {hotels.length} hotel
        </div>
      )}
    </div>
  );
}

// ─── _DeleteModal ─────────────────────────────────────────────────────────────
function _DeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
        style={{ animation: "modal-in 0.18s ease-out" }}>
        <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-rose-50">
          <Trash2 size={26} className="text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Hotel?</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Tindakan ini tidak dapat dibatalkan. Data hotel beserta semua kamarnya akan dihapus secara permanen.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors text-sm">
            Batal
          </button>
          <button onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500 text-white font-medium hover:bg-rose-600 transition-colors text-sm">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── AdminHotels (Main) ───────────────────────────────────────────────────────
function AdminHotels() {
  const [hotels,    setHotels]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir,   setSortDir]   = useState("desc");
  const [deleteId,  setDeleteId]  = useState(null);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const res = await getHotels();
      setHotels(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadHotels(); }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = hotels
    .filter((h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.city?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const v = (x) => typeof x[sortField] === "string" ? x[sortField].toLowerCase() : Number(x[sortField]);
      return sortDir === "asc" ? (v(a) > v(b) ? 1 : -1) : (v(a) < v(b) ? 1 : -1);
    });

  const confirmDelete = async () => {
    try {
      await deleteHotel(deleteId);
      setDeleteId(null);
      loadHotels();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  // Tidak pakai AdminLayout / MainLayout — layout sudah disediakan
  // oleh AdminDashboard.jsx (Sidebar + Header + <Outlet />).
  // Halaman ini adalah konten <Outlet /> langsung.
  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>

      {/* Delete Modal */}
      {deleteId && (
        <Suspense fallback={null}>
          <DeleteModal onConfirm={confirmDelete} onCancel={() => setDeleteId(null)} />
        </Suspense>
      )}

      <div className="p-6 space-y-6">
        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-800">Kelola Hotel</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manajemen seluruh data properti hotel</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadHotels}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <Link
              to="/admin/hotels/create-hotel"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm shadow-teal-200 transition-all text-sm"
            >
              <Plus size={17} />
              Tambah Hotel
            </Link>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <Suspense fallback={
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
          </div>
        }>
          <StatCards hotels={hotels} filtered={filtered} />
        </Suspense>

        {/* ── Table ── */}
        <Suspense fallback={
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <div className="h-4 w-32 bg-slate-200 animate-pulse rounded" />
            </div>
            <TableSkeleton />
          </div>
        }>
          <HotelTable
            filtered={filtered}
            hotels={hotels}
            loading={loading}
            search={search}
            setSearch={setSearch}
            sortField={sortField}
            sortDir={sortDir}
            handleSort={handleSort}
            setDeleteId={setDeleteId}
          />
        </Suspense>
      </div>
    </>
  );
}

export default AdminHotels;