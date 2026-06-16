import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, X } from "lucide-react"; 

import {
  getRestaurantById,
  updateRestaurant
} from "../../services/restaurantService";

function EditRestaurant() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  
  // 1. Daftarkan rating di initial state agar input terkontrol (controlled component)
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: "" 
  });

  // 2. Gunakan useEffect dengan benar tanpa memicu infinite loop atau melanggar rule
  useEffect(() => {
    let isMounted = true;

    const loadRestaurant = async () => {
      try {
        const response = await getRestaurantById(id);
        
        // Memastikan data yang didapat dari backend diekstrak dengan aman
        if (response && response.data && isMounted) {
          const data = response.data;
          setForm({
            name: data.name || "",
            city: data.city || "",
            address: data.address || "",
            description: data.description || "",
            image_url: data.image_url || "",
            rating: data.rating !== undefined && data.rating !== null ? data.rating.toString() : ""
          });
        }
      } catch (error) {
        console.error("Gagal memuat data restoran:", error);
        alert("Restaurant tidak ditemukan atau terjadi kesalahan server.");
        navigate("/admin/restaurants");
      } finally {
        if (isMounted) {
          setLoading(false); // Memastikan loading dimatikan di block finally
        }
      }
    };

    loadRestaurant();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

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
      // 3. Konversi nilai rating ke tipe data Float/Number sebelum dikirim ke backend
      const payload = {
        ...form,
        rating: form.rating ? parseFloat(form.rating) : 0
      };

      await updateRestaurant(id, payload);
      setShowSuccessModal(true); 
    } catch (error) {
      console.error("Gagal update data:", error);
      alert(error.response?.data?.message || "Gagal update restaurant");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/admin/restaurants"); 
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data restoran...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 relative">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Edit Restaurant
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Perbarui data restoran Anda seperti nama, lokasi kota, alamat fisik, rating, dan kelola foto utama kuliner.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nama Restaurant */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Restaurant
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Resto Nusantara Rasa"
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
                placeholder="Contoh: Jakarta Selatan"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Mengubah layout agar Alamat dan Rating sejajar di desktop */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {/* Alamat Lengkap */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alamat Lengkap
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Jl. Kuliner No. 88, Blok C..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* INPUT RATING (Baru dimasukkan) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rating Restoran
              </label>
              <input
                type="number"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                placeholder="Contoh: 4.5"
                step="0.1"
                min="0"
                max="5"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              URL Foto Banner Restoran
            </label>
            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://example.com/foto-restoran.jpg"
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
            {form.image_url && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-1">Preview Banner Restoran:</p>
                <img 
                  src={form.image_url} 
                  alt="Preview Restaurant" 
                  className="h-44 w-full rounded-lg object-cover border border-gray-200"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Singkat Restoran
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Jelaskan mengenai spesialisasi menu hidangan, atmosfer restoran, atau jam operasional singkat..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/restaurants")}
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
                "Update Restaurant"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL POP-UP SUKSES */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition-all border border-gray-100">
            
            <button 
              onClick={handleCloseModal}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="mt-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                <CheckCircle size={36} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Berhasil Diperbarui!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Data restoran <strong>{form.name}</strong> telah berhasil diperbarui di dalam sistem database.
              </p>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full inline-flex justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 focus:outline-none transition-colors"
              >
                Oke, Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditRestaurant;