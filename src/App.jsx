import { lazy, Suspense } from "react"; // Menambahkan Suspense
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Ikon loading yang estetik

// ── Layout & Guard ────────────────────────────────────────────────────────────
import AdminRoute  from "./components/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";

// ── Halaman publik (Home dibuat lazy, sisanya tetap import langsung) ───────────
const Home            = lazy(() => import("./pages/Home")); // Diubah menjadi lazy untuk alur Register -> Home
import Login          from "./auth/Login";
import Register       from "./auth/Register";
import NotFound       from "./pages/NotFound";
import Dashboard      from "./pages/Dashboard";
import HotelList      from "./hotel/HotelList";
import HotelDetail    from "./hotel/HotelDetail";
import HotelBooking   from "./booking/HotelBooking";
import MyBookings     from "./booking/MyBookings";
import RestaurantList from "./restaurant/RestaurantList";
import RestaurantDetail from "./restaurant/RestaurantDetail";
import BookTable      from "./restaurant/BookTable";
import MyRestaurantBookings from "./restaurant/MyRestaurantBookings";
import MyHotelBookings from "./hotel/MyHotelBookings";

// ── Halaman admin (lazy) ──────────────────────────────────────────────────────
const AdminDashboard          = lazy(() => import("./admin/AdminDashboard"));
const AdminHotels             = lazy(() => import("./admin/hotels/AdminHotels"));
const CreateHotel             = lazy(() => import("./admin/hotels/CreateHotel"));
const EditHotel               = lazy(() => import("./admin/hotels/EditHotel"));
const AdminRooms              = lazy(() => import("./admin/rooms/AdminRooms"));
const CreateRoom              = lazy(() => import("./admin/rooms/CreateRoom"));
const EditRoom                = lazy(() => import("./admin/rooms/EditRoom"));
const AdminRestaurants        = lazy(() => import("./admin/restaurants/AdminRestaurants"));
const CreateRestaurant        = lazy(() => import("./admin/restaurants/CreateRestaurant"));
const EditRestaurant          = lazy(() => import("./admin/restaurants/EditRestaurant"));
const AdminRestaurantTables   = lazy(() => import("./admin/restaurantTables/AdminRestaurantTables"));
const CreateRestaurantTable   = lazy(() => import("./admin/restaurantTables/CreateRestaurantTable"));
const EditRestaurantTable     = lazy(() => import("./admin/restaurantTables/EditRestaurantTable"));
const AdminHotelBookings      = lazy(() => import("./admin/bookings/AdminHotelBookings"));
const AdminRestaurantBookings = lazy(() => import("./admin/bookings/AdminRestaurantBookings"));

// ── Komponen Loading State (Serasi dengan tema gelap slate-900) ────────────────
function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-slate-900 flex flex-col items-center justify-center gap-3">
      <Loader2 size={32} className="animate-spin text-teal-400" />
      <p className="text-white/50 text-sm tracking-wide font-medium">Memuat Halaman...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* Membungkus semua rute dengan Suspense. 
        Saat file chunk halaman lazy sedang diunduh, PageLoader akan otomatis muncul.
      */}
      <Suspense fallback={<PageLoader />}>
        <Routes>

          {/* ── Halaman publik ── */}
          <Route path="/"                        element={<Home />} />
          <Route path="/login"                   element={<Login />} />
          <Route path="/register"                element={<Register />} />
          <Route path="/dashboard"               element={<Dashboard />} />
          <Route path="/hotels"                  element={<HotelList />} />
          <Route path="/hotels/:id"              element={<HotelDetail />} />
          <Route path="/book-room/:roomId"       element={<HotelBooking />} />
          <Route path="/my-bookings"             element={<MyBookings />} />
          <Route path="/restaurants"             element={<RestaurantList />} />
          <Route path="/restaurants/:id"         element={<RestaurantDetail />} />
          <Route path="/book-table/:id"          element={<BookTable />} />
          <Route path="/my-restaurant-bookings"  element={<MyRestaurantBookings />} />
          <Route path="/my-hotel-bookings"       element={<MyHotelBookings />} />
          <Route path="*"                        element={<NotFound />} />

          {/* ── Halaman admin ── */}
          <Route
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="/admin"                               element={<AdminDashboard />} />
            <Route path="/admin/hotels"                        element={<AdminHotels />} />
            <Route path="/admin/hotels/create-hotel"           element={<CreateHotel />} />
            <Route path="/admin/hotels/edit/:id"               element={<EditHotel />} />
            <Route path="/admin/rooms"                         element={<AdminRooms />} />
            <Route path="/admin/rooms/create-room"             element={<CreateRoom />} />
            <Route path="/admin/rooms/edit/:id"                element={<EditRoom />} />
            <Route path="/admin/restaurants"                   element={<AdminRestaurants />} />
            <Route path="/admin/restaurants/create"            element={<CreateRestaurant />} />
            <Route path="/admin/restaurants/edit/:id"          element={<EditRestaurant />} />
            <Route path="/admin/restaurant-tables"             element={<AdminRestaurantTables />} />
            <Route path="/admin/restaurant-tables/create"      element={<CreateRestaurantTable />} />
            <Route path="/admin/restaurant-tables/edit/:id"    element={<EditRestaurantTable />} />
            <Route path="/admin/hotel-bookings"                element={<AdminHotelBookings />} />
            <Route path="/admin/restaurant-bookings"           element={<AdminRestaurantBookings />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;