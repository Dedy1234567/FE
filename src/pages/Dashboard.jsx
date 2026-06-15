import MainLayout from "../layouts/MainLayout";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="mt-4">
        <p>Nama : {user?.fullname}</p>

        <p>Email : {user?.email}</p>

        <p>Role : {user?.role}</p>
      </div>

      <Link to="/dashboard"> Dashboard </Link>
    </MainLayout>
  );
}

export default Dashboard;
