import api from "./api";

export const getAllHotelBookings = async ({ page, limit, search, status }) => {
  return api.get("/hotel-bookings", {
    params: { page, limit, search, status }
  });
};

export const cancelHotelBooking = (id) => {
  return api.put(
    `/hotel-bookings/${id}/cancel`
  );
};

export const completeHotelBooking = (id) => {
    return api.put(
      `/hotel-bookings/${id}/complete`
    );
  };

