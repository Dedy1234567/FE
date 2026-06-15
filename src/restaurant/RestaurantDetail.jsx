import { useEffect, useState, Suspense, lazy } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft, MapPin, Star, Users, CheckCircle2,
  XCircle, Clock, Phone, Wifi, Shield, UtensilsCrossed,
  CalendarCheck, ArrowRight,
} from "lucide-react";
import { MdOutlineTableRestaurant, MdOutlineRestaurantMenu } from "react-icons/md";
import { RiLeafLine } from "react-icons/ri";
import { TbAirConditioning } from "react-icons/tb";

import MainLayout from "../layouts/MainLayout";
import { getRestaurantById } from "../services/restaurantService";
import { getTablesByRestaurant } from "../services/restaurantTableService";

// ─── Lazy sections ────────────────────────────────────────────────────────────
const HeroSection   = lazy(() => Promise.resolve({ default: _HeroSection   }));
const InfoSection   = lazy(() => Promise.resolve({ default: _InfoSection   }));
const TablesSection = lazy(() => Promise.resolve({ default: _TablesSection }));

// ─── Amenities ────────────────────────────────────────────────────────────────
const AMENITIES = [
  { icon: Wifi,                    label: "Free WiFi",        bg: "bg-blue-50",    color: "text-blue-500"    },
  { icon: TbAirConditioning,       label: "AC",               bg: "bg-cyan-50",    color: "text-cyan-500"    },
  { icon: MdOutlineRestaurantMenu, label: "Menu Lengkap",     bg: "bg-amber-50",   color: "text-amber-500"   },
  { icon: RiLeafLine,              label: "Menu Vegetarian",  bg: "bg-emerald-50", color: "text-emerald-500" },
  { icon: Shield,                  label: "Kebersihan Terjaga",bg:"bg-teal-50",    color: "text-teal-500"    },
  { icon: Phone,                   label: "Reservasi Mudah",  bg: "bg-violet-50",  color: "text-violet-500"  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ className }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />;
}

function PageSkeleton() {
  return (
    <MainLayout>
      <Sk className="w-full h-80 rounded-3xl mb-8" />
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Sk className="md:col-span-2 h-44" />
        <Sk className="h-44" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => <Sk key={i} className="h-52" />)}
      </div>
    </MainLayout>
  );
}

// ─── StarDisplay ──────────────────────────────────────────────────────────────
function StarDisplay({ rating }) {
  const r = Number(rating) || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={12}
          className={s <= r ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
      ))}
    </div>
  );
}

// ─── _HeroSection ─────────────────────────────────────────────────────────────
function _HeroSection({ restaurant, totalAvailable, onBack }) {
  return (
    <div className="relative w-full h-80 rounded-3xl overflow-hidden mb-8 shadow-xl">
      <img
        src={restaurant.image_url || `https://picsum.photos/seed/resto${restaurant.id}/1400/600`}
        alt={restaurant.name}
        className="w-full h-full object-cover"
        onError={(e) => { e.target.src = `https://picsum.photos/seed/resto${restaurant.id}/1400/600`; }}
      />
      {/* gradients */}
      <div className="absolute inset-0 bg-linear-to-t from-slate-900/85 via-slate-900/25 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-slate-900/30 to-transparent" />

      {/* Back button */}
      <button onClick={onBack}
        className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md hover:bg-white/25 text-white text-sm font-medium px-3.5 py-2 rounded-xl border border-white/20 transition-all"
      >
        <ChevronLeft size={15} /> Kembali
      </button>

      {/* Bottom info */}
      <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                <Star size={11} fill="white" /> {restaurant.rating}
              </span>
              <StarDisplay rating={restaurant.rating} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-sm">
              {restaurant.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={13} className="text-orange-300" /> {restaurant.city}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Clock size={13} className="text-orange-300" /> Buka 10:00 – 22:00
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span className="flex items-center gap-1.5 text-white/80 text-sm">
                <Phone size={13} className="text-orange-300" /> Reservasi tersedia
              </span>
            </div>
          </div>

          {/* Meja available pill */}
          <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl px-5 py-3 text-center min-w-27.5">
            <p className="text-white/70 text-xs mb-0.5">Meja tersedia</p>
            <p className="text-white text-3xl font-bold tabular-nums">{totalAvailable}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── _InfoSection ─────────────────────────────────────────────────────────────
function _InfoSection({ restaurant }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-10">
      {/* Description */}
      <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
          Tentang Restoran
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          {restaurant.description ||
            "Nikmati pengalaman kuliner terbaik bersama kami. Kami menyajikan cita rasa autentik dengan bahan-bahan segar pilihan dan suasana yang nyaman untuk setiap momen spesial Anda."}
        </p>
        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
          {[
            { label: "Rating",   value: `${restaurant.rating}/5`, color: "text-amber-500"   },
            { label: "Kota",     value: restaurant.city,          color: "text-orange-500"  },
            { label: "Reservasi",value: "Tersedia",               color: "text-emerald-500" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
              <p className={`text-sm font-bold ${color} truncate`}>{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-linear-to-br from-orange-50/60 to-amber-50/60 rounded-2xl border border-orange-100/60 shadow-sm p-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Fasilitas</p>
        <div className="grid grid-cols-2 gap-2">
          {AMENITIES.map(({ icon: Icon, label, bg, color }) => (
            <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-2.5 py-2 shadow-sm border border-slate-100">
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

// ─── _TablesSection ───────────────────────────────────────────────────────────
function _TablesSection({ tables }) {
  const availCount = tables.filter((t) => t.status === "available").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MdOutlineTableRestaurant size={22} className="text-orange-400" />
            Pilih Meja
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {tables.length} meja ·{" "}
            <span className="text-emerald-600 font-medium">{availCount} tersedia</span>
          </p>
        </div>
      </div>

      {tables.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center bg-white rounded-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <MdOutlineTableRestaurant size={28} className="text-slate-300" />
          </div>
          <p className="text-slate-600 font-medium">Belum ada meja tersedia</p>
          <p className="text-slate-400 text-sm mt-1">Restoran ini belum memiliki meja yang terdaftar</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tables.map((table) => {
            const available = table.status === "available";
            return (
              <div key={table.id}
                className={`group bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200
                  ${available
                    ? "border-slate-100 hover:shadow-lg hover:-translate-y-1"
                    : "border-slate-100 opacity-75"}`}
              >
                {/* Top color bar */}
                <div className={`h-1.5 w-full ${available ? "bg-linear-to-r from-emerald-400 to-teal-400" : "bg-slate-200"}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                        ${available ? "bg-orange-50" : "bg-slate-100"}`}>
                        <MdOutlineTableRestaurant size={20}
                          className={available ? "text-orange-400" : "text-slate-300"} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          Meja {table.table_number}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">ID #{table.id}</p>
                      </div>
                    </div>

                    {available ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                        <CheckCircle2 size={10} /> Tersedia
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <XCircle size={10} /> Penuh
                      </span>
                    )}
                  </div>

                  {/* Capacity */}
                  <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 mb-4">
                    <Users size={14} className="text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600">
                      Kapasitas{" "}
                      <span className="font-semibold text-slate-800">{table.capacity}</span>{" "}
                      orang
                    </span>
                  </div>

                  {/* CTA */}
                  {available ? (
                    <Link to={`/book-table/${table.id}`}
                      className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-orange-200 transition-all"
                    >
                      <CalendarCheck size={15} />
                      Reservasi Meja
                      <ArrowRight size={13} />
                    </Link>
                  ) : (
                    <button disabled
                      className="w-full inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-400 text-sm font-medium px-4 py-2.5 rounded-xl cursor-not-allowed"
                    >
                      <XCircle size={14} />
                      Tidak Tersedia
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function RestaurantDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [tables,     setTables]     = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [restoRes, tableRes] = await Promise.all([
          getRestaurantById(id),
          getTablesByRestaurant(id),
        ]);
        setRestaurant(restoRes.data);
        setTables(tableRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  const handleBack = () => navigate("/restaurants");

  if (loading) return <PageSkeleton />;

  if (!restaurant) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
            <UtensilsCrossed size={36} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-700">Restoran tidak ditemukan</h2>
          <p className="text-slate-400 text-sm mt-1 mb-5">Data tidak tersedia atau telah dihapus</p>
          <button onClick={handleBack}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
            <ChevronLeft size={15} /> Kembali ke Restoran
          </button>
        </div>
      </MainLayout>
    );
  }

  const totalAvailable = tables.filter((t) => t.status === "available").length;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto pb-12">

        <Suspense fallback={<Sk className="w-full h-80 rounded-3xl mb-8" />}>
          <HeroSection restaurant={restaurant} totalAvailable={totalAvailable} onBack={handleBack} />
        </Suspense>

        <Suspense fallback={
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <Sk className="md:col-span-2 h-44" />
            <Sk className="h-44" />
          </div>
        }>
          <InfoSection restaurant={restaurant} />
        </Suspense>

        <Suspense fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <Sk key={i} className="h-52" />)}
          </div>
        }>
          <TablesSection tables={tables} />
        </Suspense>

      </div>
    </MainLayout>
  );
}

export default RestaurantDetail;