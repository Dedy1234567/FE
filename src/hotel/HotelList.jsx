import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Search, ArrowRight, BedDouble, SlidersHorizontal, Building2, ShieldCheck, Compass } from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getHotels } from "../services/hotelService";

// ─── Lazy sections ────────────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const HotelGrid = lazy(() => Promise.resolve({ default: _HotelGrid }));

// ─── Skeleton Card (Premium Shimmer Effect) ──────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.02)] flex flex-col">
      <div
        className="h-64 w-full relative overflow-hidden bg-slate-100"
        style={{
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "skeleton-loading 1.6s infinite ease-in-out",
        }}
      />
      <div className="p-6 flex flex-col flex-1 gap-3.5">
        <div className="h-4 w-1/4 rounded-md bg-slate-200/70" />
        <div className="h-6 w-5/6 rounded-lg bg-slate-200" />
        <div className="space-y-2 mt-1">
          <div className="h-3.5 w-full rounded-md bg-slate-100" />
          <div className="h-3.5 w-5/6 rounded-md bg-slate-100" />
        </div>
        <div className="h-4 w-1/3 rounded-md bg-slate-100 mt-2" />
        <div className="mt-auto pt-5 flex justify-between items-center border-t border-slate-50">
          <div className="space-y-1.5">
            <div className="h-3 w-12 rounded bg-slate-100" />
            <div className="h-6 w-24 rounded-lg bg-slate-200" />
          </div>
          <div className="h-10 w-32 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

// ─── Star Display ─────────────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  const r = Math.min(5, Math.max(0, Math.floor(Number(rating) || 0)));
  return (
    <div className="flex items-center gap-0.5 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 w-fit">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= r ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}
        />
      ))}
      <span className="text-[11px] font-bold text-amber-700 ml-1.5">{Number(rating || 0).toFixed(1)}</span>
    </div>
  );
}

// ─── Hotel Card (Premium Glassmorphism & Hover Effects) ───────────────────────
function HotelCard({ hotel }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden bg-slate-900">
        <img
          src={hotel.image_url || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80`}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80`;
          }}
        />
        
        {/* Soft elegant gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

        {/* Floating City Badge */}
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/10">
          <MapPin size={12} className="text-indigo-400" />
          <span>{hotel.city || "Indonesia"}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-indigo-600 font-bold text-[11px] uppercase tracking-widest mb-2">
          <Building2 size={12} />
          <span>Luxury Stay</span>
        </div>

        <h3 className="text-slate-800 font-black text-lg tracking-tight leading-snug group-hover:text-indigo-600 transition-colors mb-2 line-clamp-1">
          {hotel.name}
        </h3>

        <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2 mb-4">
          {hotel.description || "Nikmati staycation eksklusif dengan penawaran fasilitas terbaik, kamar luas, serta pemandangan menakjubkan."}
        </p>

        <div className="mb-5">
          <StarDisplay rating={hotel.rating} />
        </div>

        {/* Card Footer Price & Action */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Harga Kamar</p>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-lg font-black text-slate-900">
                {hotel.min_price ? `Rp ${Number(hotel.min_price).toLocaleString("id-ID")}` : "—"}
              </span>
              {hotel.min_price && <span className="text-[11px] text-slate-400 font-medium">/malam</span>}
            </div>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-600 shadow-md shadow-slate-900/10 hover:shadow-indigo-600/20 transition-all duration-300 group/btn"
          >
            Pesan Kamar
            <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── _HotelGrid ───────────────────────────────────────────────────────────────
function _HotelGrid({ hotels, search }) {
  const filtered = hotels.filter(
    (h) =>
      h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.city?.toLowerCase().includes(search.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <BedDouble size={26} className="text-indigo-500" />
        </div>
        <h4 className="text-slate-800 font-black text-base tracking-tight">Destinasi Tidak Ditemukan</h4>
        <p className="text-slate-400 text-xs font-medium max-w-xs mt-1">
          {search ? `Kami tidak dapat menemukan hotel atau kota dengan kata kunci "${search}"` : "Database hotel masih kosong."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
        <p className="text-slate-400 text-xs font-semibold">
          Ditemukan <span className="text-indigo-600 font-extrabold">{filtered.length}</span> properti eksklusif
        </p>
      </div>
      {filtered.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadHotels() {
      try {
        const res = await getHotels();
        setHotels(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadHotels();
  }, []);

  return (
    <MainLayout>
      {/* Embedded Dynamic Keyframe Animation */}
      <style>{`
        @keyframes skeleton-loading {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ─── 1. HERO SECTION (Premium Soft Contrast Background) ─── */}
      <section className="relative bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100/60 overflow-hidden py-16 md:py-24">
        {/* Subtle Luxury Ornaments */}
        <div className="absolute right-0 top-0 w-125 h-100 bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none -translate-y-20 translate-x-20" />
        <div className="absolute left-0 bottom-0 w-75 h-75 bg-amber-200/20 rounded-full blur-[100px] pointer-events-none translate-y-20 -translate-x-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 tracking-widest uppercase mb-4 shadow-sm">
            <Compass size={11} className="animate-spin-slow" /> Discover Luxury Travel
          </span>
          
          <h1 className="text-slate-800 font-black text-3xl md:text-5xl tracking-tight leading-[1.15] max-w-2xl mb-4">
            Temukan Kenyamanan Menginap Berkelas
          </h1>
          
          <p className="text-slate-400 text-xs md:text-sm font-medium max-w-lg leading-relaxed mb-10">
            Pesan hotel, resort, dan villa premium dengan jaminan harga terbaik serta standardisasi pelayanan internasional.
          </p>

          {/* Floating Search Hub Card */}
          <div className="w-full max-w-2xl bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_15px_50px_-15px_rgba(15,23,42,0.08)] flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-3 group focus-within:border-indigo-400/50 transition-all">
              <MapPin size={18} className="text-indigo-500 shrink-0 group-focus-within:scale-110 transition-transform" />
              <input
                type="text"
                placeholder="Mau menginap di mana? (Cari hotel atau nama kota...)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs font-semibold text-slate-700 placeholder-slate-400"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-slate-900/10 hover:bg-indigo-600 active:scale-95 transition-all whitespace-nowrap">
              <Search size={14} />
              Cari Akomodasi
            </button>
          </div>

          {/* Quick trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-indigo-500" /> Best Price Guarantee</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-indigo-500" /> 100% Verified Reviews</span>
          </div>
        </div>
      </section>

      {/* ─── 2. HOTEL CATALOGUE SECTION ─── */}
      <section className="bg-slate-50/50 min-h-screen px-6 py-14">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Dynamic Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-slate-800 font-black text-xl lg:text-2xl tracking-tight">Rekomendasi Properti</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Penawaran terbaik dengan rating tertinggi minggu ini</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-full shadow-sm text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors w-fit">
              <SlidersHorizontal size={13} className="text-indigo-500" />
              Filter &amp; Urutkan
            </button>
          </div>

          {/* Shimmer loading handler */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Main Display Grid with Suspense */}
          {!loading && (
            <Suspense
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <_HotelGrid hotels={hotels} search={search} />
              </div>
            </Suspense>
          )}

        </div>
      </section>
    </MainLayout>
  );
}

export default HotelList;