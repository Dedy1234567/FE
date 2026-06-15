import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getRestaurantTableById,
  updateRestaurantTable
} from "../../services/restaurantTableService";

function EditRestaurantTable() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      table_number: "",
      capacity: "",
      status: "available"
    });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadTable();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTable =
    async () => {

      try {

        const response =
          await getRestaurantTableById(id);

        setForm({
          table_number:
            response.data.table_number || "",

          capacity:
            response.data.capacity || "",

          status:
            response.data.status || "available"
        });

      } catch (error) {

        console.log(error);

        alert(
          "Meja tidak ditemukan"
        );

        navigate(
          "/admin/restaurant-tables"
        );

      } finally {

        setLoading(false);

      }

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

        await updateRestaurantTable(
          id,
          form
        );

        alert(
          "Meja berhasil diupdate"
        );

        navigate(
          "/admin/restaurant-tables"
        );

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          "Gagal update meja"
        );

      }

    };

  if (loading) {

    return (

      <MainLayout>

        <p>Loading...</p>

      </MainLayout>

    );

  }

  return (

    <MainLayout>

      <div className="max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Meja Restaurant
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="block mb-1">
              Nomor Meja
            </label>

            <input
              type="text"
              name="table_number"
              value={form.table_number}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />

          </div>

          <div>

            <label className="block mb-1">
              Kapasitas
            </label>

            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />

          </div>

          <div>

            <label className="block mb-1">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            >

              <option value="available">
                Available
              </option>

              <option value="booked">
                Booked
              </option>

            </select>

          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Update Meja
          </button>

        </form>

      </div>

    </MainLayout>

  );

}

export default EditRestaurantTable;