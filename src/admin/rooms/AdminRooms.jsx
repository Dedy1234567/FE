import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  BedDouble,
  Hotel,
  Users,
  Search,
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  AlertTriangle,
  X,
} from "lucide-react";
import { FaHotel } from "react-icons/fa";
import { MdBedroomParent, MdAttachMoney } from "react-icons/md";

// Lazy-loaded sub-components
const StatCard = lazy(() =>
  Promise.resolve({
    default: function StatCard({ icon: Icon, label, value, gradient, textColor }) {
      return (
        <div
          className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.6)",
            boxShadow: "0 2px 16px 0 rgba(30,58,95,0.07)",
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
            <p className={`text-xl font-bold truncate ${textColor}`}>{value}</p>
          </div>
          {/* subtle decorative circle */}
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
            style={{ border: "1px solid rgba(30,58,95,0.08)" }}
          >
            <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-2xl bg-rose-50">
              <AlertTriangle size={28} className="text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hapus Kamar?</h3>
            <p className="text-sm text-slate-500 mb-7 leading-relaxed">
              Data kamar akan dihapus secara permanen dan tidak dapat dipulihkan.
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
                className="flex-1 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
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

// Sortable column header
function SortTh({ label, field, sortField, sortDir, onSort }) {
  const active = sortField === field;
  return (
    <th
      className="px-5 py-3.5 text-left cursor-pointer select-none group"
      onClick={() => onSort(field)}
    >
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
          active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
        }`}
      >
        {label}
        {active ? (
          sortDir === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : (
          <ChevronDown size={12} className="opacity-30" />
        )}
      </span>
    </th>
  );
}

function AdminRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [deleteId, setDeleteId] = useState(null);

  // Dynamic imports for services
  const loadRooms = async () => {
    try {
      setLoading(true);
      const { getRooms } = await import("../../services/roomService");
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRooms();
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = rooms
    .filter(
      (r) =>
        r.room_name?.toLowerCase().includes(search.toLowerCase()) ||
        r.hotel_name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const val = (v) =>
        typeof v[sortField] === "string"
          ? v[sortField].toLowerCase()
          : Number(v[sortField]);
      return sortDir === "asc"
        ? val(a) > val(b)
          ? 1
          : -1
        : val(a) < val(b)
        ? 1
        : -1;
    });

  const confirmDelete = async () => {
    try {
      const { deleteRoom } = await import("../../services/roomService");
      await deleteRoom(deleteId);
      setDeleteId(null);
      loadRooms();
    } catch (error) {
      console.error(error);
    }
  };

  const totalRooms = rooms.reduce((s, r) => s + (Number(r.total_rooms) || 0), 0);
  const avgPrice =
    rooms.length > 0
      ? Math.round(rooms.reduce((s, r) => s + Number(r.price), 0) / rooms.length)
      : 0;
  const hotelCount = [...new Set(rooms.map((r) => r.hotel_name))].length;

  const cols = [
    { label: "ID", field: "id" },
    { label: "Hotel", field: "hotel_name" },
    { label: "Nama Kamar", field: "room_name" },
    { label: "Harga / Malam", field: "price" },
    { label: "Kapasitas", field: "capacity" },
    { label: "Total Unit", field: "total_rooms" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(160deg, #f0f4ff 0%, #f8f9fb 60%, #eef2f7 100%)",
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
            {/* Brand mark */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
                boxShadow: "0 6px 20px 0 rgba(37,99,235,0.3)",
              }}
            >
              <FaHotel size={22} color="#fff" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-blue-500 uppercase tracking-widest">
                  Hotel Management
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 leading-tight tracking-tight">
                Manajemen Kamar
              </h1>
            </div>
          </div>

          <Link
            to="/admin/rooms/create-room"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
              boxShadow: "0 4px 16px 0 rgba(37,99,235,0.35)",
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Tambah Kamar
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
              icon={MdBedroomParent}
              label="Tipe Kamar"
              value={rooms.length}
              gradient="linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)"
              textColor="text-slate-800"
            />
            <StatCard
              icon={FaHotel}
              label="Total Hotel"
              value={hotelCount}
              gradient="linear-gradient(135deg, #5b21b6 0%, #7c3aed 100%)"
              textColor="text-slate-800"
            />
            <StatCard
              icon={Users}
              label="Total Unit"
              value={`${totalRooms} unit`}
              gradient="linear-gradient(135deg, #065f46 0%, #059669 100%)"
              textColor="text-slate-800"
            />
            <StatCard
              icon={MdAttachMoney}
              label="Rata-rata Harga"
              value={`Rp ${avgPrice.toLocaleString("id-ID")}`}
              gradient="linear-gradient(135deg, #92400e 0%, #d97706 100%)"
              textColor="text-slate-800"
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
            boxShadow: "0 4px 32px 0 rgba(30,58,95,0.08)",
          }}
        >
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-700 text-sm">Daftar Kamar</h2>
              {!loading && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {filtered.length} dari {rooms.length} kamar ditampilkan
                </p>
              )}
            </div>
            <div className="relative w-full sm:w-72">
              <Search
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Cari nama kamar atau hotel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-sm rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
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
                <tr style={{ background: "linear-gradient(90deg, #f8faff 0%, #f1f5f9 100%)" }}>
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
                  // Skeleton rows
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-slate-50">
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-5 py-4">
                          <div
                            className="h-4 rounded-lg bg-slate-100 animate-pulse"
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center"
                          style={{ background: "#f1f5f9" }}
                        >
                          <BedDouble size={30} className="text-slate-300" />
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium text-sm">
                            Tidak ada kamar ditemukan
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            Coba ubah kata kunci pencarian Anda
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((room, idx) => (
                    <tr
                      key={room.id}
                      className="border-t border-slate-50 transition-colors duration-150 hover:bg-blue-50/30"
                      style={{
                        background:
                          idx % 2 === 0 ? "rgba(255,255,255,1)" : "rgba(248,250,255,0.7)",
                      }}
                    >
                      {/* ID */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-blue-600"
                          style={{ background: "#eff6ff" }}
                        >
                          {room.id}
                        </span>
                      </td>

                      {/* Hotel */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}
                          >
                            <Hotel size={13} className="text-violet-600" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm truncate max-w-35">
                            {room.hotel_name}
                          </span>
                        </div>
                      </td>

                      {/* Room Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: "linear-gradient(135deg, #dbeafe, #bfdbfe)" }}
                          >
                            <BedDouble size={13} className="text-blue-600" />
                          </div>
                          <span className="text-slate-800 font-semibold text-sm">
                            {room.room_name}
                          </span>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg text-emerald-700"
                          style={{ background: "#d1fae5" }}
                        >
                          Rp {Number(room.price).toLocaleString("id-ID")}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                          <Users size={13} className="text-slate-400" />
                          <span className="font-medium">{room.capacity} tamu</span>
                        </div>
                      </td>

                      {/* Total Rooms */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-block text-xs font-semibold px-2.5 py-1.5 rounded-lg text-amber-700"
                          style={{ background: "#fef3c7" }}
                        >
                          {room.total_rooms} unit
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/rooms/edit/${room.id}`}
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
                            onClick={() => setDeleteId(room.id)}
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

          {/* Table Footer */}
          {!loading && filtered.length > 0 && (
            <div
              className="flex items-center justify-between px-6 py-3 border-t border-slate-100"
              style={{ background: "rgba(248,250,255,0.6)" }}
            >
              <span className="text-xs text-slate-400">
                Menampilkan{" "}
                <span className="font-semibold text-slate-600">{filtered.length}</span> dari{" "}
                <span className="font-semibold text-slate-600">{rooms.length}</span> kamar
              </span>
              <div className="flex items-center gap-1.5">
                <LayoutDashboard size={12} className="text-slate-300" />
                <span className="text-xs text-slate-300">Hotel Room System</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminRooms;