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
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { createRoom } from "../../services/roomService";
import { getHotels } from "../../services/hotelService"; // sesuaikan path

function FormField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-1.5">
        <span className="flex items-center gap-1.5">
          <Icon size={14} className="text-indigo-400" />
          {label}
        </span>
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </div>
  );
}

function CreateRoom() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        console.log(err);
      }
    };
    loadHotels();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.hotel_id) e.hotel_id = "Pilih hotel terlebih dahulu";
    if (!form.room_name.trim()) e.room_name = "Nama kamar wajib diisi";
    if (!form.price || Number(form.price) <= 0) e.price = "Harga harus lebih dari 0";
    if (!form.capacity || Number(form.capacity) <= 0) e.capacity = "Kapasitas harus lebih dari 0";
    if (!form.total_rooms || Number(form.total_rooms) <= 0)
      e.total_rooms = "Jumlah unit harus lebih dari 0";
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
      navigate("/admin/rooms");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 transition ${
      errors[field]
        ? "border-rose-300 focus:ring-rose-200 bg-rose-50"
        : "border-slate-200 focus:ring-indigo-200 bg-white"
    }`;

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/admin/rooms")}
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 text-sm mb-4 transition"
        >
          <ChevronLeft size={16} />
          Kembali ke Daftar Kamar
        </button>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tambah Kamar Baru</h1>
        <p className="text-slate-400 text-sm mt-1">Isi detail informasi kamar hotel</p>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1 – Info Utama */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
              Informasi Utama
            </h2>

            <FormField label="Hotel" icon={Hotel} error={errors.hotel_id}>
              <select
                name="hotel_id"
                value={form.hotel_id}
                onChange={handleChange}
                className={inputClass("hotel_id")}
              >
                <option value="">-- Pilih Hotel --</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Nama Kamar" icon={BedDouble} error={errors.room_name}>
              <input
                type="text"
                name="room_name"
                value={form.room_name}
                onChange={handleChange}
                placeholder="cth. Deluxe King Room"
                className={inputClass("room_name")}
              />
            </FormField>
          </div>

          {/* Card 2 – Harga & Kapasitas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
              Harga & Kapasitas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormField label="Harga / Malam (Rp)" icon={DollarSign} error={errors.price}>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  placeholder="500000"
                  className={inputClass("price")}
                />
              </FormField>

              <FormField label="Kapasitas Tamu" icon={Users} error={errors.capacity}>
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min="1"
                  placeholder="2"
                  className={inputClass("capacity")}
                />
              </FormField>

              <FormField label="Jumlah Unit" icon={Hash} error={errors.total_rooms}>
                <input
                  type="number"
                  name="total_rooms"
                  value={form.total_rooms}
                  onChange={handleChange}
                  min="1"
                  placeholder="10"
                  className={inputClass("total_rooms")}
                />
              </FormField>
            </div>
          </div>

          {/* Card 3 – Media & Deskripsi */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100">
              Media & Deskripsi
            </h2>

            <FormField label="URL Gambar" icon={ImageIcon} error={errors.image_url}>
              <input
                type="url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className={inputClass("image_url")}
              />
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt="preview"
                  className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-200"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </FormField>

            <FormField label="Deskripsi" icon={FileText} error={errors.description}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan fasilitas dan keunggulan kamar..."
                className={`${inputClass("description")} resize-none`}
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/rooms")}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-medium shadow-sm shadow-indigo-200 transition text-sm"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={15} />
                  Simpan Kamar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default CreateRoom;