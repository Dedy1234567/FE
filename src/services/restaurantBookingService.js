import api from "./api";

export const createRestaurantBooking = (data) => {
  return api.post(
    "/restaurant-bookings",
    data
  );
};

export const getMyRestaurantBookings = () => {
  return api.get(
    "/restaurant-bookings/my"
  );
};

export const getAllRestaurantBookings = async ({ page, limit, search, status }) => {
  return api.get(`/restaurant-bookings`, {
    params: { page, limit, search, status }
  });
};

export const cancelRestaurantBooking = (id) => {
    return api.put(
      `/restaurant-bookings/${id}/cancel`
    );
  };

export const completeRestaurantBooking = (id) => {
    return api.put(`/restaurant-bookings/${id}/complete`);
  };