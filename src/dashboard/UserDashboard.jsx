import {
    useEffect,
    useState
  } from "react";
  
  import MainLayout
  from "../layouts/MainLayout";
  
  import {
    getUserDashboard
  } from "../services/dashboardService";
  
  function UserDashboard() {
  
    const [stats, setStats] =
      useState(null);
  
    const [loading, setLoading] =
      useState(true);
  
    useEffect(() => {
  
      const loadDashboard =
        async () => {
  
          try {
  
            const response =
              await getUserDashboard();
  
            setStats(
              response.data
            );
  
          } catch (error) {
  
            console.log(error);
  
          } finally {
  
            setLoading(false);
  
          }
  
        };
  
      loadDashboard();
  
    }, []);
  
    if (loading) {
      return (
        <MainLayout>
          <h2>Loading...</h2>
        </MainLayout>
      );
    }
  
    return (
  
      <MainLayout>
  
        <h1 className="text-3xl font-bold mb-8">
          Dashboard User
        </h1>
  
        <div className="grid md:grid-cols-4 gap-6">
  
          <div className="bg-blue-500 text-white p-6 rounded">
            <h2>Total Hotel</h2>
  
            <p className="text-4xl font-bold mt-2">
              {stats.totalHotelBookings}
            </p>
          </div>
  
          <div className="bg-green-500 text-white p-6 rounded">
            <h2>Total Restaurant</h2>
  
            <p className="text-4xl font-bold mt-2">
              {stats.totalRestaurantBookings}
            </p>
          </div>
  
          <div className="bg-yellow-500 text-white p-6 rounded">
            <h2>Booking Aktif</h2>
  
            <p className="text-4xl font-bold mt-2">
              {stats.activeBookings}
            </p>
          </div>
  
          <div className="bg-red-500 text-white p-6 rounded">
            <h2>Dibatalkan</h2>
  
            <p className="text-4xl font-bold mt-2">
              {stats.cancelledBookings}
            </p>
          </div>
  
        </div>
  
      </MainLayout>
  
    );
  
  }
  
  export default UserDashboard;