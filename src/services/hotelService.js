import api from "./api";

export const getHotels = () => api.get("/hotel");

export const getHotelById = (id) => api.get(`/hotel/${id}`);

export const createHotel = (data) => {
  return api.post("/hotel", data);
};

export const updateHotel = (id, data) => {
  return api.put(`/hotel/${id}`, data);
};

export const deleteHotel = (id) => {
  return api.delete(`/hotel/${id}`);
};
