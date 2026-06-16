import { useEffect, useState, Suspense, lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft, BedDouble, Users, CalendarDays,
  Moon, CreditCard, CheckCircle2, AlertCircle,
  Clock, Shield, Tag,
} from "lucide-react";
import { MdOutlineHotel, MdOutlineBedroomParent } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import { getRoomById } from "../services/roomService";
import { createHotelBooking } from "../services/bookingService";
import { useAuth } from "../context/AuthContext";

// ─── Lazy sections ────────────────────────────────────────────────────────────
const RoomCard    = lazy(() => Promise.resolve({ default: _RoomCard    }));
const BookingForm = lazy(() => Promise.resolve({ default: _BookingForm }));
const SummaryCard = lazy(() => Promise.resolve({ default: _SummaryCard }));

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function PageSkeleton() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Sk className="h-8 w-48" />
        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Sk className="h-52 rounded-2xl" />
            <Sk className="h-64 rounded-2xl" />
          </div>
          <div className="lg:col-span-2">
            <Sk className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// ─── _RoomCard ────────────────────────────────────────────────────────────────
function _RoomCard({ room }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={room.image_url || `https://picsum.photos/seed/room${room.id}/800/400`}
          alt={room.room_name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/room${room.id}/800/400`; }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
          <div>
            <p className="text-white/70 text-xs mb-0.5">Tipe Kamar</p>
            <h2 className="text-white font-bold text-xl leading-tight">{room.room_name}</h2>
          </div>
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl px-3 py-1.5 text-right">
            <p className="text-white/70 text-xs">Per malam</p>
            <p className="text-white font-bold text-base">
              Rp {Number(room.price).toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Users,                  label: "Kapasitas",    value: `${room.capacity} tamu`,          color: "text-indigo-500", bg: "bg-indigo-50"  },
            { icon: MdOutlineBedroomParent,  label: "Unit Tersedia",value: `${room.available_rooms} kamar`,   color: "text-teal-500",   bg: "bg-teal-50"    },
            { icon: MdOutlineHotel,          label: "Hotel",        value: room.hotel_name || "—",           color: "text-violet-500", bg: "bg-violet-50"  },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
              <div className="flex justify-center mb-1.5">
                <Icon size={16} className={color} />
              </div>
              <p className="text-xs font-semibold text-slate-700 leading-tight">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── _BookingForm ─────────────────────────────────────────────────────────────
function _BookingForm({ checkIn, setCheckIn, checkOut, setCheckOut, onSubmit, loading, error, success }) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h3 className="font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <CalendarDays size={18} className="text-indigo-500" />
        Pilih Tanggal
      </h3>

      <div className="space-y-4">
        {/* Check-in */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Check-in
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
            />
          </div>
        </div>

        {/* Check-out */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
            Check-out
          </label>
          <div className="relative">
            <CalendarDays size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
            />
          </div>
        </div>

        {/* Policies */}
        <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
          {[
            { icon: Clock,   text: "Check-in: 14:00 | Check-out: 12:00" },
            { icon: Shield,  text: "Pembatalan gratis sebelum 24 jam"    },
            { icon: Tag,     text: "Harga sudah termasuk pajak"          },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-xs text-slate-500">
              <Icon size={13} className="text-slate-400 shrink-0" />
              {text}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-600">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-600">
            <CheckCircle2 size={15} className="shrink-0" />
            Booking berhasil! Mengalihkan...
          </div>
        )}

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={loading || !checkIn || !checkOut || success}
          className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold py-3 rounded-xl shadow-sm shadow-indigo-200 transition-all text-sm disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <CreditCard size={16} />
              Booking Sekarang
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── _SummaryCard ─────────────────────────────────────────────────────────────
function _SummaryCard({ room, checkIn, checkOut }) {
  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = nights * Number(room.price);

  const fmt = (d) => d
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(d))
    : "—";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-6">
      {/* header */}
      <div className="bg-linear-to-r from-indigo-500 to-violet-500 px-5 py-4">
        <p className="text-white/80 text-xs font-medium uppercase tracking-wide">Ringkasan Pemesanan</p>
        <p className="text-white font-bold text-lg mt-0.5">{room.room_name}</p>
      </div>

      <div className="p-5 space-y-4">
        {/* Dates */}
        <div className="space-y-2.5">
          {[
            { label: "Check-in",  value: fmt(checkIn),  icon: CalendarDays },
            { label: "Check-out", value: fmt(checkOut), icon: CalendarDays },
            { label: "Durasi",    value: nights > 0 ? `${nights} malam` : "—", icon: Moon },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs text-slate-500">
                <Icon size={13} className="text-slate-400" /> {label}
              </span>
              <span className="text-xs font-semibold text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Harga per malam</span>
            <span className="font-medium text-slate-700">
              Rp {Number(room.price).toLocaleString("id-ID")}
            </span>
          </div>
          {nights > 0 && (
            <div className="flex justify-between text-xs text-slate-500">
              <span>× {nights} malam</span>
              <span className="font-medium text-slate-700">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>

        {/* Total */}
        <div className="bg-linear-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">Total Pembayaran</span>
            <span className="text-lg font-bold text-indigo-600">
              {nights > 0 ? `Rp ${total.toLocaleString("id-ID")}` : "—"}
            </span>
          </div>
          {nights > 0 && (
            <p className="text-xs text-slate-400 mt-1">Sudah termasuk pajak & layanan</p>
          )}
        </div>

        {/* Guarantee */}
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <Shield size={13} className="text-emerald-500 shrink-0" />
          Pembayaran aman & terenkripsi
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function HotelBooking() {
  const { roomId }  = useParams();
  const navigate    = useNavigate();
  const { user }    = useAuth();

  const [room,      setRoom]     = useState(null);
  const [checkIn,  setCheckIn]  = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [pageLoad, setPageLoad] = useState(true);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false); // State baru untuk pop-up login

  useEffect(() => {
    async function loadRoom() {
      try {
        const res = await getRoomById(roomId);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoad(false);
      }
    }
    loadRoom();
  }, [roomId]);

  const handleBack = () => {
    if (room?.hotel_id) navigate(`/hotels/${room.hotel_id}`);
    else navigate(-1);
  };

  const handleBooking = async () => {
    setError(null);

    // 1. Cek dari sisi front-end terlebih dahulu apakah user ada di AuthContext
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Pilih tanggal check-in dan check-out terlebih dahulu.");
      return;
    }
    const start  = new Date(checkIn);
    const end    = new Date(checkOut);
    if (end <= start) {
      setError("Tanggal check-out harus setelah check-in.");
      return;
    }
    const totalNights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice  = totalNights * Number(room.price);

    setLoading(true);
    try {
      await createHotelBooking({
        user_id:      user.id,
        room_id:      room.id,
        check_in:     checkIn,
        check_out:     checkOut,
        total_nights: totalNights,
        total_price:  totalPrice,
      });
      setSuccess(true);
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      console.error(err);
      // 2. Jika lolos dari front-end tapi backend merespon 401 Unauthorized
      if (err.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        setError(err.response?.data?.message || "Booking gagal. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoad) return <PageSkeleton />;

  if (!room) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
            <BedDouble size={36} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Kamar tidak ditemukan</h2>
          <p className="text-slate-400 text-sm mt-1 mb-5">Data kamar tidak tersedia</p>
          <button onClick={() => navigate("/hotels")}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            <ChevronLeft size={15} /> Kembali ke Hotel
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* ── Page header ── */}
        <div className="flex items-center gap-4 mb-7">
          <button onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={18} />
            Kembali
          </button>
          <div className="w-px h-5 bg-slate-200" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Booking Kamar</h1>
            <p className="text-slate-400 text-xs mt-0.5">Lengkapi detail pemesanan Anda</p>
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left — room info + form */}
          <div className="lg:col-span-3 space-y-5">
            <Suspense fallback={<Sk className="h-52 rounded-2xl" />}>
              <RoomCard room={room} />
            </Suspense>

            <Suspense fallback={<Sk className="h-64 rounded-2xl" />}>
              <BookingForm
                checkIn={checkIn}    setCheckIn={setCheckIn}
                checkOut={checkOut}  setCheckOut={setCheckOut}
                onSubmit={handleBooking}
                loading={loading}
                error={error}
                success={success}
              />
            </Suspense>
          </div>

          {/* Right — summary */}
          <div className="lg:col-span-2">
            <Suspense fallback={<Sk className="h-72 rounded-2xl" />}>
              <SummaryCard room={room} checkIn={checkIn} checkOut={checkOut} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* ── POP-UP / MODAL BELUM LOGIN ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center border border-slate-100">
            {/* Warning Icon Ringkas */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 mb-4">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            
            <h3 className="text-lg font-bold text-slate-800 mb-2">Anda Belum Login</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Silakan login terlebih dahulu menggunakan akun Anda untuk melanjutkan proses booking kamar ini.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm shadow-indigo-100 transition-colors"
              >
                Login Sekarang
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-sm py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default HotelBooking;