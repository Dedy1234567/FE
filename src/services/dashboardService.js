import api from "./api";

export const getUserDashboard =
  () => {
    return api.get(
      "/dashboard/user"
    );
  };

export const getDashboardStats =
  () => {
    return api.get(
      "/dashboard"
    );
  };