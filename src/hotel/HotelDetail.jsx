import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Star, BedDouble, Users, CheckCircle2, XCircle,
  ChevronLeft, Wifi, Coffee, Wind, ShowerHead, Phone,
  Clock, Shield, ArrowRight,
} from "lucide-react";
import { MdOutlinePool, MdOutlineSpa, MdOutlineLocalParking } from "react-icons/md";

import MainLayout from "../layouts/MainLayout";
import { getHotelById } from "../services/hotelService";
import { getRoomsByHotel } from "../services/roomService";

// ─── Amenities ────────────────────────────────────────────────────────────────
const AMENITIES = [
  { icon: Wifi,                   label: "Free WiFi",           bg: "bg-blue-50",   color: "text-blue-500"   },
  { icon: Coffee,                 label: "Sarapan Gratis",      bg: "bg-amber-50",  color: "text-amber-500"  },
  { icon: Wind,                   label: "AC",                  bg: "bg-cyan-50",   color: "text-cyan-500"   },
  { icon: ShowerHead,             label: "Kamar Mandi Pribadi", bg: "bg-teal-50",   color: "text-teal-500"   },
  { icon: MdOutlinePool,          label: "Kolam Renang",        bg: "bg-indigo-50", color: "text-indigo-500" },
  { icon: MdOutlineSpa,           label: "Spa & Wellness",      bg: "bg-rose-50",   color: "text-rose-500"   },
  { icon: MdOutlineLocalParking,  label: "Parkir Gratis",       bg: "bg-slate-50",  color: "text-slate-500"  },
  { icon: Shield,                 label: "Keamanan 24 Jam",     bg: "bg-emerald-50",color: "text-emerald-500"},
];

// ─── Lazy components ──────────────────────────────────────────────────────────
const HeroSection   = lazy(() => Promise.resolve({ default: _HeroSection   }));
const InfoSection   = lazy(() => Promise.resolve({ default: _InfoSection   }));
const RoomsSection  = lazy(() => Promise.resolve({ default: _RoomsSection  }));

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function PageSkeleton() {
  return (
    <MainLayout>
      <Sk className="w-full h-72 rounded-3xl mb-8" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 space-y-3">
          <Sk className="h-6 w-48" />
          <Sk className="h-4 w-full" />
          <Sk className="h-4 w-3/4" />
        </div>
        <Sk className="h-48" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => <Sk key={i} className="h-72" />)}
      </div>
    </MainLayout>
  );
}

// ─── Star Rating display ──────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13}
          className={s <= r ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

// ─── Room Card ────────────────────────────────────────────────────────────────
function RoomCard({ room }) {
  const available = room.available_rooms > 0;
  const availPct  = room.total_rooms > 0
    ? Math.round((room.available_rooms / room.total_rooms) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-250">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={room.image_url || `https://picsum.photos/seed/room${room.id}/600/300`}
          alt={room.room_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/room${room.id}/600/300`; }}
        />
        {/* badge */}
        <div className="absolute top-3 right-3">
          {available ? (
            <span className="inline-flex items-center gap-1 bg-emerald-500/90 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <CheckCircle2 size={10} /> Tersedia
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-slate-700/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <XCircle size={10} /> Penuh
            </span>
          )}
        </div>
        {/* price overlay */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-linear-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className="text-white text-xs opacity-80">Mulai dari</p>
          <p className="text-white font-bold text-base leading-none">
            Rp {Number(room.price).toLocaleString("id-ID")}
            <span className="text-xs font-normal opacity-70"> /malam</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-base mb-3 leading-tight">{room.room_name}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Users size={12} className="text-indigo-400" />
              {room.capacity} tamu
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble size={12} className="text-indigo-400" />
              {room.available_rooms}/{room.total_rooms} kamar
            </span>
          </div>

          {/* availability bar */}
          <div className="space-y-1">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  availPct > 50 ? "bg-emerald-400"
                  : availPct > 20 ? "bg-amber-400"
                  : "bg-rose-400"
                }`}
                style={{ width: `${availPct}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 text-right">{availPct}% tersedia</p>
          </div>
        </div>

        {available ? (
          <Link to={`/book-room/${room.id}`}
            className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-200 transition-all"
          >
            Pesan Sekarang <ArrowRight size={14} />
          </Link>
        ) : (
          <button disabled
            className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl cursor-not-allowed"
          >
            Tidak Tersedia
          </button>
        )}
      </div>
    </div>
  );
}

// ─── _HeroSection ─────────────────────────────────────────────────────────────
function _HeroSection({ hotel, totalAvail, onBack }) {
  return (
    <div className="relative w-full h-85 rounded-3xl overflow-hidden mb-8 shadow-xl">
      <img
        src={hotel.image_url || "https://picsum.photos/seed/hotel-hero/1400/600"}
        alt={hotel.name}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = "https://picsum.photos/seed/hotel-hero/1400/600"; }}
      />
      {/* gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/85 via-slate-900/30 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/30 to-transparent" />

      {/* back button */}
      <button onClick={onBack}
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white text-sm font-medium px-3.5 py-2 rounded-xl border border-white/20 transition-all"
      >
        <ChevronLeft size={15} /> Kembali
      </button>

      {/* Hotel info */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {/* rating badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                <Star size={11} fill="white" /> {hotel.rating}
              </span>
              <StarDisplay rating={hotel.rating} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={13} className="text-indigo-300" /> {hotel.city}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Clock size={13} className="text-indigo-300" /> Check-in 14:00
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Phone size={13} className="text-indigo-300" /> 24/7 Support
              </span>
            </div>
          </div>
          {/* availability pill */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center min-w-27.5">
            <p className="text-white/70 text-xs mb-0.5">Kamar tersedia</p>
            <p className="text-white text-3xl font-bold tabular-nums">{totalAvail}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── _InfoSection ─────────────────────────────────────────────────────────────
function _InfoSection({ hotel }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      {/* Description */}
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Tentang Hotel</p>
        <p className="text-slate-600 text-sm leading-relaxed">
          {hotel.description || "Nikmati pengalaman menginap terbaik bersama kami. Hotel kami menawarkan kenyamanan, ketenangan, dan layanan premium yang akan membuat perjalanan Anda tak terlupakan."}
        </p>
        {/* stats row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
          {[
            { label: "Rating",      value: `${hotel.rating}/5`,  color: "text-amber-500"  },
            { label: "Kota",        value: hotel.city,           color: "text-indigo-500" },
            { label: "Tipe Kamar",  value: "Tersedia",           color: "text-emerald-500"},
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
              <p className={`text-sm font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-linear-to-br from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Fasilitas</p>
        <div className="grid grid-cols-2 gap-2.5">
          {AMENITIES.map(({ icon: Icon, label, bg, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-slate-100">
              <div className={`w-6 h-6 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={13} className={color} />
              </div>
              <span className="text-xs text-slate-600 font-medium leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── _RoomsSection ────────────────────────────────────────────────────────────
function _RoomsSection({ rooms }) {
  const availableCount = rooms.filter(r => r.available_rooms > 0).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Pilih Kamar</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {rooms.length} tipe kamar ·{" "}
            <span className="text-emerald-600 font-medium">{availableCount} tersedia</span>
          </p>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <BedDouble size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium">Belum ada kamar tersedia</p>
          <p className="text-slate-400 text-sm mt-1">Hotel ini belum memiliki kamar yang terdaftar</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
        </div>
      )}
    </div>
  );
}

// ─── Loader fallback ──────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function SectionLoader() {
  return (
    <div className="animate-pulse space-y-3">
      <Sk className="h-6 w-40" />
      <Sk className="h-4 w-full" />
      <Sk className="h-4 w-2/3" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function HotelDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [hotel,   setHotel]   = useState(null);
  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [hotelRes, roomRes] = await Promise.all([
          getHotelById(id),
          getRoomsByHotel(id),
        ]);
        setHotel(hotelRes.data);
        setRooms(roomRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Kembali ke HotelList
  const handleBack = () => navigate("/hotels");

  if (loading) return <PageSkeleton />;

  if (!hotel) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
            <BedDouble size={36} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Hotel tidak ditemukan</h2>
          <p className="text-slate-400 text-sm mt-1 mb-5">Data hotel tidak tersedia atau telah dihapus</p>
          <button onClick={handleBack}
            className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <ChevronLeft size={15} /> Kembali ke Daftar Hotel
          </button>
        </div>
      </MainLayout>
    );
  }

  const totalAvail = rooms.reduce((s, r) => s + (Number(r.available_rooms) || 0), 0);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-12">

        {/* Hero */}
        <Suspense fallback={<Sk className="w-full h-85 rounded-3xl mb-8" />}>
          <HeroSection hotel={hotel} totalAvail={totalAvail} onBack={handleBack} />
        </Suspense>

        {/* Info */}
        <Suspense fallback={
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Sk className="md:col-span-2 h-48" />
            <Sk className="h-48" />
          </div>
        }>
          <InfoSection hotel={hotel} />
        </Suspense>

        {/* Rooms */}
        <Suspense fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <Sk key={i} className="h-72" />)}
          </div>
        }>
          <RoomsSection rooms={rooms} />
        </Suspense>

      </div>
    </MainLayout>
  );
}

export default HotelDetail;