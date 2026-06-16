import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  MapPin, 
  FileText, 
  ImageIcon, 
  ArrowLeft, 
  Save,
  ImagePlus
} from "lucide-react";

import { createRestaurant } from "../../services/restaurantService";
// import AdminSidebar from "../../components/AdminSidebar"; // Sesuaikan jika ada sidebar

function CreateRestaurant() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRestaurant(form);
      alert("Restaurant berhasil ditambahkan");
      navigate("/admin/restaurants");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan restoran");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800">
      {/* <AdminSidebar /> */}

      {/* Main Content Container */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* Header / Top Nav */}
        <header className="mb-10">
          <button 
            onClick={() => navigate("/admin/restaurants")}
            className="group flex items-center gap-1 text-slate-500 hover:text-orange-600 font-medium text-sm mb-3 transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Kembali ke Daftar Restoran
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Tambah Restoran Baru
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Daftarkan merchant kuliner atau restoran mitra baru ke dalam sistem.
            </p>
          </div>
        </header>

        {/* Form Layout Split (2:1) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Form Data */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card Informasi Utama */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                  <UtensilsCrossed size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Detail Restoran</h2>
              </div>

              {/* Nama Restoran */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <UtensilsCrossed size={16} className="text-slate-400" /> Nama Restoran <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Contoh: Resto Nusantara Rasa"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Kota */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={16} className="text-slate-400" /> Kota <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Contoh: Bandung"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Alamat */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={16} className="text-slate-400" /> Alamat Lengkap
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Nama jalan, nomor gedung, atau kawasan bisnis"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Card Deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText size={16} className="text-slate-400" /> Deskripsi Singkat Restoran
                </label>
                <textarea
                  name="description"
                  placeholder="Jelaskan jenis kuliner, jam operasional, menu andalan, atau atmosfer restoran..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm resize-none"
                  onChange={handleChange}
                />
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Media Preview & Aksi Eksekusi */}
          <div className="space-y-6">
            
            {/* Card Media Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-orange-500" />
                Foto Restoran
              </h3>
              
              {/* Box Preview Gambar */}
              <div className="relative group aspect-video bg-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="preview-resto"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => (e.target.src = "https://placehold.co/600x400?text=Link+Gambar+Rusak")}
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImagePlus size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[11px] text-slate-400">Preview banner restoran</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
                  URL Gambar
                </label>
                <input
                  type="url"
                  name="image_url"
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-xs font-mono"
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Card Tombol Simpan / Batal */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg shadow-orange-100/40 space-y-3">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-md hover:shadow-orange-500/20 active:scale-95 transition-all"
              >
                <Save size={18} /> Simpan Restoran
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/admin/restaurants")}
                className="w-full px-6 py-3 rounded-xl border border-slate-700 text-slate-400 font-medium hover:bg-slate-800 hover:text-white transition-all text-sm"
              >
                Batalkan
              </button>
            </div>

          </div>

        </form>
      </main>
    </div>
  );
}

export default CreateRestaurant;