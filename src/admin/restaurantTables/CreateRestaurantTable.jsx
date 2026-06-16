import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Grid,
  Users,
  ChevronLeft,
  Save,
  Loader2,
} from "lucide-react";

import { getRestaurants } from "../../services/restaurantService";
import { createRestaurantTable } from "../../services/restaurantTableService";

// Helper Component untuk konsistensi form label
function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={16} className="text-slate-400" />
        {label}
      </label>
      {children}
    </div>
  );
}

function CreateRestaurantTable() {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingRestaurants, setFetchingRestaurants] = useState(true);

  const [form, setForm] = useState({
    restaurant_id: "",
    table_number: "",
    capacity: "",
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const response = await getRestaurants();
      setRestaurants(response.data);
    } catch (error) {
      console.error("Gagal memuat data restoran", error);
    } finally {
      setFetchingRestaurants(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.restaurant_id) {
      alert("Silakan pilih restoran terlebih dahulu");
      return;
    }

    try {
      setLoading(true);
      await createRestaurantTable(form);
      alert("Meja berhasil ditambahkan");
      navigate("/admin/restaurant-tables");
    } catch (error) {
      console.log(error);
      alert("Gagal menambahkan meja");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50 outline-none transition-all placeholder:text-slate-400 text-sm bg-white text-slate-700";

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* <AdminSidebar /> */}

      <main className="flex-1 p-6 md:p-10 max-w-3xl mx-auto w-full">
        {/* Header / Navigasi Atas */}
        <header className="mb-8">
          <button
            onClick={() => navigate("/admin/restaurant-tables")}
            className="group flex items-center gap-1 text-slate-500 hover:text-orange-600 font-medium text-sm mb-3 transition-colors"
          >
            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Meja
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Tambah Meja Restoran
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Konfigurasikan nomor meja beserta kapasitas penampungan tamunya.
            </p>
          </div>
        </header>

        {/* Form Card Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Pilih Restoran */}
            <FormField label="Pilih Restoran Mitra" icon={UtensilsCrossed}>
              <select
                name="restaurant_id"
                value={form.restaurant_id}
                onChange={handleChange}
                disabled={fetchingRestaurants}
                className={inputClass}
                required
              >
                <option value="">
                  {fetchingRestaurants ? "Memuat restoran..." : "-- Pilih Restoran --"}
                </option>
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Grid Sistem untuk Nomor Meja & Kapasitas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nomor Meja */}
              <FormField label="Nomor / Kode Meja" icon={Grid}>
                <input
                  type="text"
                  name="table_number"
                  placeholder="Contoh: T-01 atau Meja 12"
                  className={inputClass}
                  onChange={handleChange}
                  required
                />
              </FormField>

              {/* Kapasitas Meja */}
              <FormField label="Kapasitas Meja (Orang)" icon={Users}>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  placeholder="Contoh: 4"
                  className={inputClass}
                  onChange={handleChange}
                  required
                />
              </FormField>
              
            </div>

            {/* Garis Pembatas */}
            <hr className="border-slate-100 my-2" />

            {/* Tombol Aksi */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/admin/restaurant-tables")}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition text-sm"
              >
                Batal
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-orange-500/10 active:scale-95 transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Simpan Meja
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateRestaurantTable;