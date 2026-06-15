import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import { getRestaurants }
from "../../services/restaurantService";

import {
  createRestaurantTable
}
from "../../services/restaurantTableService";

function CreateRestaurantTable() {

  const navigate =
    useNavigate();

  const [restaurants,
    setRestaurants] =
    useState([]);

  const [form, setForm] =
    useState({

      restaurant_id: "",
      table_number: "",
      capacity: ""

    });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadRestaurants();

  }, []);

  const loadRestaurants =
    async () => {

      const response =
        await getRestaurants();

      setRestaurants(
        response.data
      );

    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });

    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await createRestaurantTable(
          form
        );

        alert(
          "Meja berhasil ditambahkan"
        );

        navigate(
          "/admin/restaurant-tables"
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Tambah Meja Restaurant
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <select
          name="restaurant_id"
          value={form.restaurant_id}
          onChange={handleChange}
          className="border p-2 w-full"
        >

          <option value="">
            Pilih Restaurant
          </option>

          {
            restaurants.map(
              (r) => (

                <option
                  key={r.id}
                  value={r.id}
                >
                  {r.name}
                </option>

              )
            )
          }

        </select>

        <input
          type="text"
          name="table_number"
          placeholder="Nomor Meja"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          placeholder="Kapasitas"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>

      </form>

    </MainLayout>

  );

}

export default CreateRestaurantTable;