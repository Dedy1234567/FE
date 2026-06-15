import api from "./api";

export const getRestaurantTables = () => {
  return api.get("/restaurant-tables");
};

export const getRestaurantTableById = (id) => {
  return api.get(`/restaurant-tables/${id}`);
};

export const getTablesByRestaurant = (restaurantId) => {
  return api.get(
    `/restaurant-tables/restaurant/${restaurantId}`
  );
};

export const createRestaurantTable = (data) => {
  return api.post(
    "/restaurant-tables",
    data
  );
};

export const updateRestaurantTable = (
  id,
  data
) => {
  return api.put(
    `/restaurant-tables/${id}`,
    data
  );
};

export const deleteRestaurantTable = (id) => {
  return api.delete(
    `/restaurant-tables/${id}`
  );
};