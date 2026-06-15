import api from "./api";

export const createHotelBooking = (data) =>
  api.post("/hotel-bookings", data);

export const getMyHotelBookings = () =>
  api.get("/hotel-bookings/my");

export const getBookingDetail = (id) =>
  api.get(`/hotel-bookings/${id}`);

export const cancelHotelBooking = (id) =>
  api.put(`/hotel-bookings/${id}/cancel`);