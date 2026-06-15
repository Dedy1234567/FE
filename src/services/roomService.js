import api from "./api";

export const getRooms = () => {
  return api.get("/rooms");
};

export const getRoomById = (id) => {
  return api.get(`/rooms/${id}`);
};

export const createRoom = (data) => {
  return api.post("/rooms", data);
};

export const updateRoom = (id, data) => {
  return api.put(`/rooms/${id}`, data);
};

export const deleteRoom = (id) => {
  return api.delete(`/rooms/${id}`);
};

export const getRoomsByHotel = (hotelId) => {
  return api.get(`/rooms/hotel/${hotelId}`);
};