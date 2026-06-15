import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Star, Search, UtensilsCrossed, ChevronDown,
  ArrowRight, SlidersHorizontal, Sparkles
} from "lucide-react";
import MainLayout from "../layouts/MainLayout";
import { getRestaurants } from "../services/restaurantService";

// ─── Lazy ─────────────────────────────────────────────────────────────────────
const RestaurantGrid = lazy(() => Promise.resolve({ default: _RestaurantGrid }));

// ─── Skeleton (Premium Shimmer Effect) ──────────────────────────────────
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
            <div className="h-6 w-16 rounded-lg bg-slate-200" />
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

// ─── Restaurant Card ──────────────────────────────────────────────────────────
function RestaurantCard({ restaurant }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_25px_-5px_rgba(15,23,42,0.03)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-500 flex flex-col h-full">
      
      {/* Image Area */}
      <div className="relative h-64 overflow-hidden bg-slate-900">
        <img
          src={restaurant.image_url || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80`}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80`;
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/10 to-transparent" />

        {/* Floating City Badge */}
        <div className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 bg-slate-900/60 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border border-white/10">
          <MapPin size={12} className="text-rose-400" />
          <span>{restaurant.city || "Indonesia"}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-1 text-rose-600 font-bold text-[11px] uppercase tracking-widest mb-2">
          <UtensilsCrossed size={12} />
          <span>Fine Dining</span>
        </div>

        <h3 className="text-slate-800 font-black text-lg tracking-tight leading-snug group-hover:text-rose-600 transition-colors mb-2 line-clamp-1">
          {restaurant.name}
        </h3>

        <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-2 mb-4">
          {restaurant.description || "Nikmati petualangan rasa eksklusif dengan hidangan autentik bercita rasa tinggi dan pelayanan impresif."}
        </p>

        <div className="mb-5">
          <StarDisplay rating={restaurant.rating} />
        </div>

        {/* Card Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Review</p>
            <div className="flex items-baseline gap-0.5 mt-0.5">
              <span className="text-lg font-black text-slate-900">{Number(restaurant.rating || 0).toFixed(1)}</span>
              <span className="text-[11px] text-slate-400 font-medium">/ 5.0</span>
            </div>
          </div>

          <Link
            to={`/restaurants/${restaurant.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-rose-600 shadow-md shadow-slate-900/10 hover:shadow-rose-600/20 transition-all duration-300 group/btn"
          >
            Lihat Detail
            <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── _RestaurantGrid ──────────────────────────────────────────────────────────
function _RestaurantGrid({ restaurants, search, cityFilter, sortBy }) {
  const filtered = restaurants
    .filter((r) => {
      const matchSearch =
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === "Semua" || r.city === cityFilter;
      return matchSearch && matchCity;
    })
    .sort((a, b) => {
      if (sortBy === "rating_desc") return Number(b.rating) - Number(a.rating);
      if (sortBy === "rating_asc")  return Number(a.rating) - Number(b.rating);
      if (sortBy === "name")        return a.name.localeCompare(b.name);
      return 0;
    });

  if (filtered.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
          <UtensilsCrossed size={26} className="text-rose-500" />
        </div>
        <h4 className="text-slate-800 font-black text-base tracking-tight">Restoran Tidak Ditemukan</h4>
        <p className="text-slate-400 text-xs font-medium max-w-xs mt-1">
          {search ? `Kami tidak dapat menemukan restoran kuliner dengan kata kunci "${search}"` : "Database destinasi kuliner masih kosong."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="col-span-full flex items-center justify-between border-b border-slate-100 pb-4 mb-2">
        <p className="text-slate-400 text-xs font-semibold">
          Menampilkan <span className="text-rose-600 font-extrabold">{filtered.length}</span> tempat kuliner terkurasi
        </p>
      </div>
      {filtered.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [cityFilter,  setCityFilter]  = useState("Semua");
  const [sortBy,      setSortBy]      = useState("default");

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getRestaurants();
        setRestaurants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const cities = ["Semua", ...new Set(restaurants.map((r) => r.city).filter(Boolean))];

  return (
    <MainLayout>
      <style>{`
        @keyframes skeleton-loading {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative bg-linear-to-b from-slate-50 via-white to-slate-50 border-b border-slate-100/60 overflow-hidden py-16 md:py-24">
        {/* Soft Background Blur Ornaments */}
        <div className="absolute right-0 top-0 w-125 h-100 bg-rose-200/20 rounded-full blur-[120px] pointer-events-none -translate-y-20 translate-x-20" />
        <div className="absolute left-0 bottom-0 w-75 h-75 bg-orange-200/15 rounded-full blur-[100px] pointer-events-none translate-y-20 -translate-x-10" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100 tracking-widest uppercase mb-4 shadow-sm">
            <Sparkles size={11} /> Culinary Excellence
          </span>
          
          <h1 className="text-slate-800 font-black text-3xl md:text-5xl tracking-tight leading-[1.15] max-w-2xl mb-4">
            Jelajahi Cita Rasa Kuliner Terbaik
          </h1>
          
          <p className="text-slate-400 text-xs md:text-sm font-medium max-w-lg leading-relaxed mb-10">
            Temukan tempat bersantap eksklusif, kafe estetik, dan fine dining legendaris dengan penawaran menu terbaik di kotamu.
          </p>

          {/* Floating Search Box */}
          <div className="w-full max-w-2xl bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_15px_50px_-15px_rgba(15,23,42,0.08)] flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-3 group focus-within:border-rose-400/50 transition-all">
              <Search size={18} className="text-rose-500 shrink-0" />
              <input
                type="text"
                placeholder="Cari nama restoran, menu hidangan, atau kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-xs font-semibold text-slate-700 placeholder-slate-400"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold text-xs tracking-wide shadow-lg shadow-slate-900/10 hover:bg-rose-600 active:scale-95 transition-all whitespace-nowrap">
              Cari Restoran
            </button>
          </div>

          {/* Data Statistics Dashboard Indicators */}
          {!loading && restaurants.length > 0 && (
            <div className="flex justify-center gap-12 mt-12 bg-white border border-slate-100 px-8 py-4 rounded-2xl shadow-sm">
              {[
                { label: "Restoran Terdaftar", value: restaurants.length },
                { label: "Kota Kuliner", value: [...new Set(restaurants.map((r) => r.city))].length },
                { label: "Standard Rating", value: `${Math.max(...restaurants.map((r) => Number(r.rating))).toFixed(1)} ★` },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── 2. RESTAURANT CATALOGUE SECTION ─── */}
      <section className="bg-slate-50/50 min-h-screen px-6 py-14">
        <div className="max-w-6xl mx-auto">

          {/* Header Rows with Custom Select Inputs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-slate-800 font-black text-xl lg:text-2xl tracking-tight">Destinasi Kuliner</h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">Pilihan tempat makan terbaik berdasarkan preferensi Anda</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* City Custom Dropdown Select */}
              <div className="relative inline-block">
                <MapPin size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none z-10" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-xs font-bold border border-slate-100 rounded-full bg-white text-slate-700 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all min-w-35"
                >
                  {cities.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Sorting Custom Dropdown Select */}
              <div className="relative inline-block">
                <SlidersHorizontal size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none z-10" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-9 pr-8 py-2.5 text-xs font-bold border border-slate-100 rounded-full bg-white text-slate-700 shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500/40 transition-all min-w-37.5"
                >
                  <option value="default">Urutan Standar</option>
                  <option value="rating_desc">Rating Tertinggi</option>
                  <option value="rating_asc">Rating Terendah</option>
                  <option value="name">Nama Resto (A–Z)</option>
                </select>
                <ChevronDown size={12} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Shimmer Loading State */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* Main Content Render with Suspense */}
          {!loading && (
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            }>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <RestaurantGrid
                  restaurants={restaurants}
                  search={search}
                  cityFilter={cityFilter}
                  sortBy={sortBy}
                />
              </div>
            </Suspense>
          )}

        </div>
      </section>
    </MainLayout>
  );
}

export default RestaurantList;