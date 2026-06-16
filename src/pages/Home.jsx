import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Star, 
  ArrowRight, 
  ChevronDown, 
  Building, 
  Utensils, 
  ShieldCheck, 
  Award, 
  Percent, 
  Compass 
} from "lucide-react";
import { FaCompass, FaRegHeart } from "react-icons/fa";
import MainLayout from "../layouts/MainLayout";

const HERO_BG = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=85";

const FEATURED = [
  {
    id: 1,
    type: "Hotel",
    name: "The Shore Luxury Resort",
    location: "Nusa Dua, Bali",
    rating: 4.9,
    reviews: 312,
    price: "Rp 850.000",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    badge: "Terlaris"
  },
  {
    id: 2,
    type: "Restaurant",
    name: "Sunset Grill & Lounge",
    location: "Senggigi, Lombok",
    rating: 4.8,
    reviews: 218,
    price: "Rp 120.000",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
    badge: "Pemandangan Terbaik"
  },
  {
    id: 3,
    type: "Hotel",
    name: "Coral Bay Private Inn",
    location: "Labuan Bajo, NTT",
    rating: 4.7,
    reviews: 175,
    price: "Rp 620.000",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    badge: "Nilai Terbaik"
  },
  {
    id: 4,
    type: "Hotel",
    name: "Mandapa Royal Mansion",
    location: "Ubud, Gianyar",
    rating: 5.0,
    reviews: 94,
    price: "Rp 2.450.000",
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80",
    badge: "Mewah"
  },
  {
    id: 5,
    type: "Hotel",
    name: "The Amarta Beachfront Villa",
    location: "Anyer, Banten",
    rating: 4.6,
    reviews: 420,
    price: "Rp 1.150.000",
    img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    badge: "Promo Spesial"
  },
  {
    id: 6,
    type: "Hotel",
    name: "Pacific Horizon Hotel",
    location: "Pantai Indah Kapuk, Jakarta",
    rating: 4.7,
    reviews: 510,
    price: "Rp 980.000",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    badge: "Akses Mudah"
  },
];

function Home() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredItems = activeTab === "all" 
    ? FEATURED 
    : FEATURED.filter(item => item.type.toLowerCase() === activeTab);

  return (
    <MainLayout>
      {/* ── HERO SECTION ── */}
      <section
        className="relative min-h-[90vh] flex flex-col items-center justify-center text-center overflow-hidden px-4"
        style={{
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      >
        {/* Overlay gradient sunset mewah */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-950/60 via-slate-900/40 to-slate-50" />

        <div className="relative z-10 px-4 max-w-4xl mt-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Compass size={14} className="text-orange-400 animate-spin-slow" />
            <span className="text-white text-xs tracking-wider uppercase font-semibold">
              Eksplorasi Tanpa Batas Bersama BookEasy
            </span>
          </div>
          
          <h1 className="text-white text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Temukan Hotel &amp; Restoran<br />
            <span className="bg-linear-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              Terbaik di Tepi Pantai
            </span>
          </h1>
          
          <p className="text-gray-200 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Pesan kamar penginapan premium dan meja makan eksklusif dengan suguhan pemandangan cakrawala laut yang menakjubkan.
          </p>


          {/* Real-time Counter Stats */}
          <div className="flex items-center justify-center gap-12 mt-12 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl py-4 px-6 max-w-xl mx-auto">
            {[["600+", "Akomodasi"], ["75K+", "Review Jujur"], ["4.9", "Rating Kepuasan"]].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-white text-xl sm:text-2xl font-black tracking-tight">{num}</p>
                <p className="text-gray-300 text-xs mt-0.5 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-gray-400">
          <span className="text-[10px] tracking-widest uppercase font-bold">Gulir Kebawah</span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </section>

      {/* ── CATEGORIES SECTION ── */}
      <section className="bg-stone-50 py-16 px-6 border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-orange-600 text-xs tracking-widest uppercase font-bold mb-2">Kategori Utama</p>
            <h2 className="text-slate-800 text-3xl font-extrabold">Pilih Tipe Perjalanan Anda</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel Card */}
            <Link to="/hotels" className="group relative rounded-3xl overflow-hidden h-60 block shadow-md hover:shadow-xl transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
                alt="Hotel"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 uppercase tracking-wider">
                  Mulai Rp 350k / Malam
                </span>
                <p className="text-white text-2xl font-extrabold flex items-center gap-2">
                  <Building size={20} className="text-orange-400" /> Hotel &amp; Resort mewah
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 transform group-hover:bg-orange-500 transition-colors duration-300">
                <ArrowRight size={16} className="text-white" />
              </div>
            </Link>

            {/* Resto Card */}
            <Link to="/restaurants" className="group relative rounded-3xl overflow-hidden h-60 block shadow-md hover:shadow-xl transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80"
                alt="Restaurant"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md mb-2 uppercase tracking-wider">
                  Konfirmasi Instan
                </span>
                <p className="text-white text-2xl font-extrabold flex items-center gap-2">
                  <Utensils size={20} className="text-amber-400" /> Restoran &amp; Kuliner Tepi Laut
                </p>
              </div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-3 transform group-hover:bg-amber-500 transition-colors duration-300">
                <ArrowRight size={16} className="text-white" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURED RECOMMENDATIONS (6 CARDS) ── */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header & Tab Controls */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
            <div>
              <p className="text-orange-600 text-xs tracking-widest uppercase font-bold mb-2">Rekomendasi Terkurasi</p>
              <h2 className="text-slate-900 text-3xl font-black tracking-tight">Paling Banyak Dipesan Minggu Ini</h2>
            </div>
            
            {/* Quick Filters Tab */}
            <div className="flex bg-gray-100 p-1 rounded-xl self-start md:self-auto">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500 hover:text-slate-800"}`}
              >
                Semua
              </button>
              <button 
                onClick={() => setActiveTab("hotel")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "hotel" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500 hover:text-slate-800"}`}
              >
                Hotel
              </button>
              <button 
                onClick={() => setActiveTab("restaurant")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === "restaurant" ? "bg-white text-slate-900 shadow-sm" : "text-gray-500 hover:text-slate-800"}`}
              >
                Restoran
              </button>
            </div>
          </div>

          {/* Grid Cards Area */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="group rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                
                {/* Photo Header */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Badge */}
                  <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm tracking-wide">
                    {item.badge}
                  </span>
                  {/* Wishlist Button Icon */}
                  <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-700 hover:text-red-500 hover:bg-white transition-all shadow-sm">
                    <FaRegHeart size={14} />
                  </button>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] uppercase tracking-widest font-black ${item.type === 'Hotel' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                        <span className="text-slate-800 text-xs font-bold">{item.rating}</span>
                        <span className="text-gray-400 text-[10px]">({item.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-slate-900 font-bold text-base group-hover:text-orange-500 transition-colors line-clamp-1 mb-1">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-gray-400 mb-4">
                      <MapPin size={13} className="shrink-0 text-gray-400" />
                      <p className="text-xs font-medium truncate">{item.location}</p>
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
                    <div>
                      <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">Mulai Harga</p>
                      <span className="text-slate-900 font-extrabold text-base tracking-tight">{item.price}</span>
                      <span className="text-gray-400 text-xs">
                        {item.type === "Hotel" ? " / malam" : " / reservasi"}
                      </span>
                    </div>
                    
                    <Link
                      to={item.type === "Hotel" ? "/hotels" : "/restaurants"}
                      className="inline-flex items-center justify-center bg-gray-50 group-hover:bg-orange-500 p-2.5 rounded-xl transition-all duration-300 shadow-xs"
                    >
                      <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action View All */}
          <div className="text-center mt-12">
            <Link to="/hotels" className="inline-flex items-center gap-2 border border-gray-300 hover:border-orange-500 text-slate-700 hover:text-orange-600 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-xs">
              Lihat Seluruh Penawaran <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY US SECTION (BRAND TRUST) ── */}
      <section className="bg-slate-50 py-16 px-6 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <ShieldCheck className="text-orange-500" size={24} />, title: "Garansi Aman Keamanan", desc: "Sistem enkripsi pembayaran legal & kemudahan pengembalian dana penuh." },
              { icon: <Award className="text-orange-500" size={24} />, title: "Layanan Mitra Terpilih", desc: "Seluruh mitra hotel & restoran divalidasi kualitasnya secara periodik." },
              { icon: <Percent className="text-orange-500" size={24} />, title: "Jaminan Harga Termurah", desc: "Dapatkan poin loyalty dan potongan khusus diskon member harian." },
              { icon: <FaCompass className="text-orange-500" size={22} />, title: "Panduan Lokasi Akurat", desc: "Sistem integrasi map titik koordinat langsung ke lokasi akomodasi." }
            ].map((prop, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-2xs hover:-translate-y-0.5 transition-transform">
                <div className="p-3 bg-orange-50 rounded-xl inline-block mb-4">{prop.icon}</div>
                <h4 className="text-slate-900 font-bold text-sm mb-1">{prop.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section
        className="relative py-24 px-6 text-center overflow-hidden"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="text-orange-400 text-xs tracking-widest uppercase font-bold mb-3">Gabung Bersama Kami</p>
          <h2 className="text-white text-3xl sm:text-4xl font-extrabold mb-5 leading-tight">
            Siap Menikmati Liburan<br />Impian Terbaik Anda?
          </h2>
          <p className="text-gray-300 text-sm mb-8 leading-relaxed font-light">
            Daftar akun gratis hari ini dan dapatkan welcome voucher diskon tambahan sebesar 15% untuk pemesanan pertama Anda di seluruh Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              Daftar Gratis <ArrowRight size={14} />
            </Link>
            <Link
              to="/hotels"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center"
            >
              Lihat Semua Hotel
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default Home;