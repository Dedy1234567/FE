import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  UtensilsCrossed, 
  MapPin, 
  FileText, 
  ImageIcon, 
  ArrowLeft, 
  Save,
  ImagePlus,
  CheckCircle2,
  X,
  Star
} from "lucide-react";

import { createRestaurant } from "../../services/restaurantService";

function CreateRestaurant() {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State Pop-up
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: "" // Sudah terintegrasi dengan backend Anda
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
      setShowSuccessModal(true); // Pemicu pop-up aktif saat sukses
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan restoran");
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/restaurants"); // Pindah halaman setelah modal ditutup
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-800 relative">
      
      {/* Main Content Container */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        
        {/* Header / Top Nav */}
        <header className="mb-10">
          <button 
            type="button"
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
                  value={form.name}
                  placeholder="Contoh: Resto Nusantara Rasa"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Grid untuk Kota dan Rating */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Kota */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <MapPin size={16} className="text-slate-400" /> Kota <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    placeholder="Contoh: Bandung"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Input Rating (Menjawab kebutuhan backend Anda) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Star size={16} className="text-slate-400" /> Rating (1-5) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={form.rating}
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder="4.5"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Alamat */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <MapPin size={16} className="text-slate-400" /> Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  placeholder="Nama jalan, nomor gedung, atau kawasan bisnis"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Card Deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <FileText size={16} className="text-slate-400" /> Deskripsi Singkat Restoran <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  placeholder="Jelaskan jenis kuliner, jam operasional, menu andalan, atau atmosfer restoran..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm resize-none"
                  onChange={handleChange}
                  required
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
                Foto Restoran <span className="text-red-500">*</span>
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
                  URL Gambar <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-xs font-mono"
                  onChange={handleChange}
                  required
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

      {/* MODAL POP-UP SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-xl border border-slate-100 transition-all">
            
            {/* Tombol X Pojok Kanan Atas */}
            <button 
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Konten Pop-up */}
            <div className="mt-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-500 mb-4 animate-pulse">
                <CheckCircle2 size={38} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Restoran Terdaftar!</h3>
              <p className="mt-2 text-sm text-slate-500">
                Kemitraan baru untuk <strong>{form.name || "Restoran Baru"}</strong> telah sukses ditambahkan ke sistem dengan rating <strong>{form.rating}★</strong>.
              </p>
            </div>

            {/* Tombol Konfirmasi */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/10 hover:bg-orange-600 focus:outline-none transition-colors"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default CreateRestaurant;