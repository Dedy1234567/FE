import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Building2, 
  MapPin, 
  FileText, 
  Image as ImageIcon, 
  Star, 
  ArrowLeft, 
  Save 
} from "lucide-react";

import { createHotel } from "../../services/hotelService";
// Silakan import Sidebar admin milikmu jika ingin langsung ditempel di sini,
// atau gunakan layout khusus admin di tingkat routing.
// import AdminSidebar from "../../components/AdminSidebar"; 

function CreateHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: 0
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
      await createHotel(form);
      alert("Hotel berhasil ditambahkan");
      navigate("/admin/hotels");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan hotel");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      {/* JIKA SIDEBAR BELUM DIBUNGKUS DI ROUTER, 
        kamu bisa un-comment komponen sidebar kamu di sini:
        <AdminSidebar /> 
      */}

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-4xl mx-auto Box-border">
        {/* Header / Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate("/admin/hotels")}
              className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <ArrowLeft size={16} /> Kembali ke List Hotel
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Tambah Hotel Baru
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Isi formulir di bawah ini untuk mendaftarkan properti baru ke dalam sistem.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Grid untuk input yang bisa sejajar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nama Hotel */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <Building2 size={16} className="text-slate-400" /> Nama Hotel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Contoh: Grand Jaya Luxury"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Kota */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <MapPin size={16} className="text-slate-400" /> Kota
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Contoh: Jakarta Selatan"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <Star size={16} className="text-slate-400" /> Rating Properti (0 - 5)
                </label>
                <input
                  type="number"
                  name="rating"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="Contoh: 4.5"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>

              {/* Alamat Lengkap */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-slate-400" /> Alamat Lengkap
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Nama jalan, nomor, RT/RW, dan kecamatan"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                  onChange={handleChange}
                />
              </div>

              {/* URL Gambar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2 items-center gap-2">
                  <ImageIcon size={16} className="text-slate-400" /> URL Gambar Hotel
                </label>
                <input
                  type="text"
                  name="image_url"
                  placeholder="https://example.com/foto-hotel.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-mono text-sm"
                  onChange={handleChange}
                />
              </div>

              {/* Deskripsi */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Deskripsi Hotel
                </label>
                <textarea
                  name="description"
                  placeholder="Tuliskan deskripsi lengkap mengenai fasilitas, keunggulan, dan info penting hotel..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Divider Line */}
            <hr className="border-slate-200 my-6" />

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate("/admin/hotels")}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
              >
                Batal
              </button>
              
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all"
              >
                <Save size={18} /> Simpan Hotel
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateHotel;