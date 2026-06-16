import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mengimpor service yang dibutuhkan
import {
  getRoomById,
  updateRoom
} from "../../services/roomService";

function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    room_name: "",
    price: "",
    capacity: "",
    total_rooms: "",
    image_url: "",
    description: ""
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRoom = async () => {
    try {
      const response = await getRoomById(id);
      setFormData({
        room_name: response.data.room_name || "",
        price: response.data.price || "",
        capacity: response.data.capacity || "",
        total_rooms: response.data.total_rooms || "",
        image_url: response.data.image_url || "",
        description: response.data.description || ""
      });
    } catch (error) {
      console.error(error);
      alert("Room tidak ditemukan");
      navigate("/admin/rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateRoom(id, formData);
      alert("Room berhasil diupdate");
      navigate("/admin/rooms");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal update room");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data kamar...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Edit Data Kamar
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Kelola tipe kamar, penyesuaian harga, kuota ketersediaan unit, serta deskripsi fasilitas.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Nama Kamar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nama Tipe Kamar
            </label>
            <input
              type="text"
              name="room_name"
              value={formData.room_name}
              onChange={handleChange}
              placeholder="Contoh: Deluxe King Ocean View"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          {/* Grid Informasi Detail */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Harga */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Harga per Malam
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-gray-500 text-sm">Rp</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 py-3 pl-10 pr-4 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Kapasitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kapasitas (Orang)
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="2"
                min="1"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* Jumlah Kamar */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Total Kamar Tersedia
              </label>
              <input
                type="number"
                name="total_rooms"
                value={formData.total_rooms}
                onChange={handleChange}
                placeholder="10"
                min="0"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Foto Kamar
            </label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/foto-kamar.jpg"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
            {formData.image_url && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Preview Foto Kamar:</p>
                <img 
                  src={formData.image_url} 
                  alt="Preview Kamar" 
                  className="h-40 w-full rounded-lg object-cover border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi & Fasilitas Kamar
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Sebutkan detail fasilitas (misal: Free Wi-Fi, AC, Breakfast, Bathtub)..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/rooms")}
              className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:bg-gray-100"
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-[0.98] disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                "Update Room"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRoom;