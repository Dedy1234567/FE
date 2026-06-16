import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Mengimpor service yang dibutuhkan
import {
  getRestaurantTableById,
  updateRestaurantTable
} from "../../services/restaurantTableService";

function EditRestaurantTable() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    table_number: "",
    capacity: "",
    status: "available"
  });

  // State untuk manajemen Pop-up / Modal
  const [modal, setModal] = useState({
    isOpen: false,
    type: "success", // 'success' | 'error'
    title: "",
    message: "",
    onClose: () => {}
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadTable();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTable = async () => {
    try {
      const response = await getRestaurantTableById(id);
      setForm({
        table_number: response.data.table_number || "",
        capacity: response.data.capacity || "",
        status: response.data.status || "available"
      });
    } catch (error) {
      console.error(error);
      setModal({
        isOpen: true,
        type: "error",
        title: "Gagal Memuat Data",
        message: "Meja tidak ditemukan atau terjadi kesalahan server.",
        onClose: () => navigate("/admin/restaurant-tables")
      });
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
      await updateRestaurantTable(id, form);
      setModal({
        isOpen: true,
        type: "success",
        title: "Berhasil!",
        message: "Data meja restoran berhasil diperbarui.",
        onClose: () => navigate("/admin/restaurant-tables")
      });
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Gagal mengupdate data meja.";
      setModal({
        isOpen: true,
        type: "error",
        title: "Update Gagal",
        message: errorMsg,
        onClose: () => setModal((prev) => ({ ...prev, isOpen: false }))
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 font-medium">Memuat data meja...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Edit Meja Restoran
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Perbarui informasi nomor meja, kapasitas, dan status ketersediaan di bawah ini.
        </p>
      </div>

      {/* Form Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/40 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            
            {/* Input Nomor Meja */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor Meja
              </label>
              <input
                type="text"
                name="table_number"
                value={form.table_number}
                onChange={handleChange}
                placeholder="Contoh: Meja 05"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>

            {/* Input Kapasitas */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kapasitas (Orang)
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                placeholder="0"
                min="1"
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                required
              />
            </div>
          </div>

          {/* Select Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status Meja
            </label>
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                <option value="available">🟢 Available (Tersedia)</option>
                <option value="booked">🔴 Booked (Dipesan)</option>
              </select>
              {/* Custom Arrow Icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/admin/restaurant-tables")}
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
                "Update Meja"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* --- POP-UP MODAL SECTION --- */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-2xl transition-all animate-scale-up">
            
            {/* Icon Status */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4">
              {modal.type === "success" ? (
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="bg-red-100 p-3 rounded-full text-red-600">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
            </div>

            {/* Title & Message */}
            <h3 className="text-xl font-bold leading-6 text-gray-900 mb-2">
              {modal.title}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {modal.message}
            </p>

            {/* Tombol OK / Aksi */}
            <div>
              <button
                type="button"
                onClick={modal.onClose}
                className={`w-full inline-flex justify-center rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  modal.type === "success" 
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500" 
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
              >
                Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditRestaurantTable;