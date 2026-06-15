import api from "./api";

export const getAllHotelBookings = () => {
  return api.get("/hotel-bookings");
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

