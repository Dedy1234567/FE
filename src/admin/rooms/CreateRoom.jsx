import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BedDouble,
  Hotel,
  DollarSign,
  Users,
  Hash,
  ImageIcon,
  FileText,
  ChevronLeft,
  Save,
  Loader2,
  ImagePlus,
  CheckCircle2, // Ikon untuk pop-up sukses
  X,            // Ikon silang untuk tutup pop-up
} from "lucide-react";

import { createRoom } from "../../services/roomService";
import { getHotels } from "../../services/hotelService";

// Helper Component untuk Form Label & Error
function FormField({ label, icon: Icon, error, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={16} className="text-slate-400" />
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-rose-500 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}

function CreateRoom() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingHotels, setFetchingHotels] = useState(true);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State Pop-up Sukses

  const [form, setForm] = useState({
    hotel_id: "",
    room_name: "",
    price: "",
    capacity: "",
    total_rooms: "",
    image_url: "",
    description: "",
  });

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const res = await getHotels();
        setHotels(res.data);
      } catch (err) {
        console.error("Gagal memuat daftar hotel", err);
      } finally {
        setFetchingHotels(false);
      }
    };
    loadHotels();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.hotel_id) e.hotel_id = "Silakan pilih hotel mitra";
    if (!form.room_name.trim()) e.room_name = "Nama kamar tidak boleh kosong";
    if (!form.price || Number(form.price) <= 0) e.price = "Harga harus lebih dari 0";
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = "Kapasitas minimal 1 tamu";
    if (!form.total_rooms || Number(form.total_rooms) <= 0) e.total_rooms = "Jumlah unit minimal 1";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await createRoom(form);
      setShowSuccessModal(true); // Aktifkan pop-up kustom saat sukses api call
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/rooms"); // Redirect ke daftar inventori kamar setelah ditutup
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
      errors[field]
        ? "border-rose-300 focus:ring-rose-100 bg-rose-50 text-rose-900"
        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50 bg-white text-slate-700"
    }`;

  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative">
      {/* Jika ada Sidebar, un-comment di bawah ini */}
      {/* <AdminSidebar /> */}

      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {/* Breadcrumb & Title Area */}
        <header className="mb-10">
          <button
            onClick={() => navigate("/admin/rooms")}
            className="group flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium text-sm mb-3 transition-colors"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Inventori Kamar
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Konfigurasi Kamar</h1>
              <p className="text-slate-500 mt-1">Daftarkan tipe kamar baru untuk hotel mitra Anda.</p>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Kolom Kiri: Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Seksi 1: Lokasi & Nama */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Hotel size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Informasi Dasar</h2>
              </div>

              <FormField label="Pilih Hotel Mitra" icon={Hotel} error={errors.hotel_id}>
                <select
                  name="hotel_id"
                  value={form.hotel_id}
                  onChange={handleChange}
                  disabled={fetchingHotels}
                  className={inputClass("hotel_id")}
                >
                  <option value="">{fetchingHotels ? "Memuat hotel..." : "-- Pilih Properti --"}</option>
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Nama/Tipe Kamar" icon={BedDouble} error={errors.room_name}>
                <input
                  type="text"
                  name="room_name"
                  value={form.room_name}
                  onChange={handleChange}
                  placeholder="Contoh: Executive Suite Sea View"
                  className={inputClass("room_name")}
                />
              </FormField>
            </div>

            {/* Seksi 2: Harga & Kapasitas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <DollarSign size={20} />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Detail Harga & Stok</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Harga per Malam (Rp)" icon={DollarSign} error={errors.price}>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    className={inputClass("price")}
                  />
                </FormField>

                <FormField label="Kapasitas (Orang)" icon={Users} error={errors.capacity}>
                  <input
                    type="number"
                    name="capacity"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="2"
                    className={inputClass("capacity")}
                  />
                </FormField>

                <FormField label="Jumlah Kamar Tersedia" icon={Hash} error={errors.total_rooms}>
                  <input
                    type="number"
                    name="total_rooms"
                    value={form.total_rooms}
                    onChange={handleChange}
                    placeholder="10"
                    className={inputClass("total_rooms")}
                  />
                </FormField>
              </div>
            </div>

            {/* Seksi 3: Deskripsi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-4">
              <FormField label="Deskripsi Kamar & Fasilitas" icon={FileText} error={errors.description}>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Jelaskan fasilitas seperti AC, WiFi, ukuran kasur, balkon, dll..."
                  className={`${inputClass("description")} resize-none`}
                />
              </FormField>
            </div>
          </div>

          {/* Kolom Kanan: Media & Actions */}
          <div className="space-y-6">
            {/* Card Media Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={16} className="text-indigo-500" />
                Media Visual
              </h3>
              
              <div className="relative group aspect-video bg-slate-100 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {form.image_url ? (
                  <img
                    src={form.image_url}
                    alt="preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => (e.target.src = "https://placehold.co/600x400?text=URL+Gambar+Salah")}
                  />
                ) : (
                  <div className="text-center p-4">
                    <ImagePlus size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="text-[10px] text-slate-400">Preview gambar muncul di sini</p>
                  </div>
                )}
              </div>

              <FormField label="URL Foto Kamar" icon={ImageIcon} error={errors.image_url}>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://image-link.com/photo.jpg"
                  className={inputClass("image_url")}
                />
              </FormField>
            </div>

            {/* Sticky Actions Button */}
            <div className="bg-slate-900 rounded-2xl p-6 shadow-lg shadow-indigo-100 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold transition-all shadow-md active:scale-95"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {loading ? "Memproses..." : "Simpan Kamar"}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/admin/rooms")}
                className="w-full px-6 py-3 rounded-xl border border-slate-700 text-slate-400 font-medium hover:bg-slate-800 hover:text-white transition-all text-sm"
              >
                Batalkan
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* MODAL POP-UP SUKSES MENAMBAHKAN KAMAR */}
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
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 animate-pulse">
                <CheckCircle2 size={38} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Kamar Berhasil Disimpan!</h3>
              <p className="mt-2 text-sm text-slate-500">
                Tipe kamar <strong>{form.room_name || "Baru"}</strong> telah sukses didaftarkan sebanyak <strong>{form.total_rooms} unit</strong> ke dalam sistem.
              </p>
            </div>

            {/* Tombol Konfirmasi */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 hover:bg-indigo-700 focus:outline-none transition-colors"
              >
                Kembali ke Inventori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateRoom;