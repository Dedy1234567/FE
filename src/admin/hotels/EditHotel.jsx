import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, X } from "lucide-react"; // Mengimpor ikon untuk pop-up sukses

// Mengimpor service yang dibutuhkan
import {
  getHotelById,
  updateHotel
} from "../../services/hotelService";

function EditHotel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State Pop-up Sukses
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: 0
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadHotel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHotel = async () => {
    try {
      const response = await getHotelById(id);
      setForm(response.data);
    } catch (error) {
      console.error(error);
      alert("Data hotel tidak ditemukan");
      navigate("/admin/hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateHotel(id, form);
      setShowSuccessModal(true); // Membuka pop-up kustom saat berhasil update
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal update hotel");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/hotels"); // Redirect ke daftar hotel setelah modal ditutup
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data hotel...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 relative">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Edit Data Hotel
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Ubah informasi detail hotel, alamat, reputasi rating, hingga media foto di sini.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nama Hotel */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Hotel
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama hotel"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* Kota */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kota
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Contoh: Bandung"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating (0.0 - 5.0)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="4.5"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Alamat Lengkap
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Jl. Raya Utama No. 123..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Foto Hotel
            </label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://example.com/foto-hotel.jpg"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />
            {form.image_url && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Preview Gambar:</p>
                <img 
                  src={form.image_url} 
                  alt="Preview Hotel" 
                  className="h-32 w-full rounded-lg object-cover border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Hotel
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tuliskan deskripsi lengkap fasilitas and keunggulan hotel..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/hotels")}
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
                "Update Hotel"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL POP-UP SUKSES UPDATE */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl border border-gray-100 transition-all">
            
            {/* Tombol Close silang di pojok kanan atas */}
            <button 
              type="button"
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Konten Utama */}
            <div className="mt-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4 animate-bounce">
                <CheckCircle2 size={38} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Berhasil Diperbarui!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Data untuk <strong>{form.name || "Hotel"}</strong> telah berhasil diperbarui dan disimpan dalam sistem.
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/10 hover:bg-blue-700 focus:outline-none transition-colors"
              >
                Kembali ke Daftar Hotel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default EditHotel;