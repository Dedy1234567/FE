import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { getRestaurantTableById } from "../services/restaurantTableService";
import { createRestaurantBooking } from "../services/restaurantBookingService";

function BookTable() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false); // State untuk mengontrol pop-up login
  const [form, setForm] = useState({
    reservation_date: "",
    reservation_time: "",
    guest_count: 1
  });

  useEffect(() => {
    async function loadTable() {
      try {
        const response = await getRestaurantTableById(id);
        setTable(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadTable();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRestaurantBooking({
        restaurant_id: table.restaurant_id,
        table_id: table.id,
        reservation_date: form.reservation_date,
        reservation_time: form.reservation_time,
        guest_count: Number(form.guest_count)
      });

      alert("Reservasi berhasil");
      navigate("/my-restaurant-bookings");
    } catch (error) {
      // Deteksi jika server merespon dengan status 401 (Unauthorized)
      if (error.response?.status === 401) {
        setShowAuthModal(true);
      } else {
        alert(error.response?.data?.message || "Gagal reservasi");
      }
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <p className="text-gray-500 animate-pulse text-lg">Memuat data meja...</p>
        </div>
      </MainLayout>
    );
  }

  if (!table) {
    return (
      <MainLayout>
        <div className="max-w-md mx-auto text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700">Meja tidak ditemukan</h2>
          <p className="text-gray-500 mt-2">Silakan periksa kembali tautan Anda.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto my-8 bg-white border border-gray-100 shadow-sm rounded-xl p-6">
        {/* Header */}
        <div className="border-b border-gray-100 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Booking Meja</h1>
          <p className="text-sm text-gray-500 mt-1">Silakan isi formulir di bawah untuk reservasi</p>
        </div>

        {/* Info Meja */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-6 flex justify-between items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Nomor Meja</span>
            <h2 className="text-xl font-bold text-gray-700">Meja {table.table_number}</h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Kapasitas</span>
            <p className="text-sm font-medium text-gray-600">{table.capacity} Orang</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tanggal Reservasi
            </label>
            <input
              type="date"
              name="reservation_date"
              value={form.reservation_date}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Jam Reservasi
            </label>
            <input
              type="time"
              name="reservation_time"
              value={form.reservation_time}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Jumlah Tamu
            </label>
            <input
              type="number"
              name="guest_count"
              min="1"
              max={table.capacity}
              value={form.guest_count}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-3 px-4 rounded-lg shadow-sm transition-colors duration-150"
          >
            Konfirmasi Reservasi
          </button>
        </form>
      </div>

      {/* POP-UP / MODAL BELUM LOGIN */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 text-center transform transition-all scale-100">
            {/* Icon Gembok / Warning Minimalis */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-50 mb-4">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m0 0v3m0-3h3m-3 0H9m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900 mb-2">Anda Belum Login</h3>
            <p className="text-sm text-gray-500 mb-6">
              Silakan login terlebih dahulu untuk melakukan reservasi meja di restoran kami.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-2.5 rounded-lg transition-colors"
              >
                Login Sekarang
              </button>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium text-sm py-2.5 rounded-lg border border-gray-200 transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default BookTable;