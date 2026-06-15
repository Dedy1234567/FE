import { Link } from "react-router-dom";
import { Search, MapPin, Star, ArrowRight, ChevronDown } from "lucide-react";
import MainLayout from "../layouts/MainLayout";

const HERO_BG =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=85";

const FEATURED = [
  {
    id: 1,
    type: "Hotel",
    name: "The Shore Resort",
    location: "Bali, Indonesia",
    rating: 4.9,
    reviews: 312,
    price: "Rp 850.000",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
  },
  {
    id: 2,
    type: "Restaurant",
    name: "Sunset Grill",
    location: "Lombok, Indonesia",
    rating: 4.8,
    reviews: 218,
    price: "Rp 120.000",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  },
  {
    id: 3,
    type: "Hotel",
    name: "Coral Bay Inn",
    location: "Labuan Bajo, NTT",
    rating: 4.7,
    reviews: 175,
    price: "Rp 620.000",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
  },
];

function Home() {
  return (
    <MainLayout>
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlay gradient sunset */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-orange-950/30 to-slate-900/80" />

        <div className="relative z-10 px-6 max-w-3xl">
          <p className="text-orange-300/80 text-xs tracking-[0.25em] uppercase font-medium mb-4">
            Hotel &amp; Restaurant · BookEasy
          </p>
          <h1 className="text-white text-4xl sm:text-5xl font-bold leading-tight mb-5">
            Temukan Hotel &amp; Restoran<br />
            <span className="text-orange-300">Terbaik di Tepi Pantai</span>
          </h1>
          <p className="text-white/50 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Pesan kamar impian dan meja makan dengan pemandangan matahari tenggelam yang tak terlupakan.
          </p>

          {/* Search bar */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 flex-1 bg-white/10 rounded-xl px-4 py-2.5">
              <MapPin size={15} className="text-orange-300/70 shrink-0" />
              <input
                type="text"
                placeholder="Cari lokasi, hotel, atau restoran..."
                className="bg-transparent text-white placeholder-white/30 text-sm outline-none w-full"
              />
            </div>
            <Link
              to="/hotels"
              className="flex items-center justify-center gap-2 bg-orange-500/80 hover:bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200"
            >
              <Search size={14} />
              Cari Sekarang
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12">
            {[["500+", "Hotel & Resto"], ["50K+", "Tamu Puas"], ["4.9", "Rating"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-white text-xl font-bold">{num}</p>
                <p className="text-white/35 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-stone-50 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-orange-500/70 text-xs tracking-[0.2em] uppercase font-medium mb-2 text-center">Kategori</p>
          <h2 className="text-stone-800 text-2xl font-bold text-center mb-10">Apa yang Anda cari?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Hotel card */}
            <Link to="/hotels" className="group relative rounded-2xl overflow-hidden h-52 block">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
                alt="Hotel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white/60 text-xs mb-1">Mulai dari Rp 350.000/malam</p>
                <p className="text-white text-xl font-bold">Hotel &amp; Resort</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
                <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            {/* Resto card */}
            <Link to="/restaurants" className="group relative rounded-2xl overflow-hidden h-52 block">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                alt="Restaurant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white/60 text-xs mb-1">Reservasi meja tersedia</p>
                <p className="text-white text-xl font-bold">Restaurant &amp; Dining</p>
              </div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-2">
                <ArrowRight size={14} className="text-white group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-orange-500/70 text-xs tracking-[0.2em] uppercase font-medium mb-2">Pilihan Terbaik</p>
              <h2 className="text-stone-800 text-2xl font-bold">Rekomendasi Kami</h2>
            </div>
            <Link to="/hotels" className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {FEATURED.map((item) => (
              <div key={item.id} className="group rounded-2xl border border-stone-100 overflow-hidden hover:shadow-lg hover:shadow-stone-100 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {item.type}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-stone-800 font-semibold text-sm">{item.name}</h3>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <Star size={11} className="fill-orange-400 text-orange-400" />
                      <span className="text-stone-600 text-xs font-medium">{item.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    <MapPin size={11} className="text-stone-300" />
                    <p className="text-stone-400 text-xs">{item.location}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-orange-500 font-bold text-sm">{item.price}</span>
                      <span className="text-stone-400 text-xs"> / malam</span>
                    </div>
                    <Link
                      to={item.type === "Hotel" ? "/hotels" : "/restaurants"}
                      className="text-xs text-stone-500 hover:text-orange-500 font-medium flex items-center gap-0.5 transition-colors"
                    >
                      Pesan <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        className="relative py-20 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-900/70" />
        <div className="relative z-10 max-w-lg mx-auto">
          <p className="text-orange-300/80 text-xs tracking-[0.2em] uppercase font-medium mb-3">Mulai Sekarang</p>
          <h2 className="text-white text-3xl font-bold mb-4 leading-snug">
            Siap menikmati liburan<br />impian Anda?
          </h2>
          <p className="text-white/45 text-sm mb-8 leading-relaxed">
            Daftar gratis dan temukan ribuan pilihan hotel &amp; restoran di seluruh Indonesia.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="bg-orange-500/90 hover:bg-orange-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2"
            >
              Daftar Gratis <ArrowRight size={14} />
            </Link>
            <Link
              to="/hotels"
              className="bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
            >
              Lihat Hotel
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;