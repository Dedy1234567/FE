import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import {getRestaurantTableById } from "../services/restaurantTableService";

import {
  createRestaurantBooking
} from "../services/restaurantBookingService";

function BookTable() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [table, setTable] =
    useState(null);

  const [form, setForm] =
    useState({
      reservation_date: "",
      reservation_time: "",
      guest_count: 1
    });

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function loadTable() {

      try {

        const response =
          await getRestaurantTableById(id);

        setTable(response.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    }

    loadTable();

  }, [id]);

  const handleChange = (e) => {

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

        await createRestaurantBooking({
          restaurant_id:
            table.restaurant_id,

          table_id:
            table.id,

          reservation_date:
            form.reservation_date,

          reservation_time:
            form.reservation_time,

          guest_count:
            Number(
              form.guest_count
            )
        });

        alert(
          "Reservasi berhasil"
        );

        navigate(
          "/my-restaurant-bookings"
        );

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Gagal reservasi"
        );

      }

    };

  if (loading) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  if (!table) {
    return (
      <MainLayout>
        <h2>Meja tidak ditemukan</h2>
      </MainLayout>
    );
  }

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">

        Booking Meja
      </h1>

      <div className="border p-4 rounded mb-6">

        <h2 className="text-xl font-bold">

          Meja {table.table_number}

        </h2>

        <p>
          Kapasitas:
          {" "}
          {table.capacity}
          {" "}
          Orang
        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div>

          <label>
            Tanggal Reservasi
          </label>

          <input
            type="date"
            name="reservation_date"
            value={form.reservation_date}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />

        </div>

        <div>

          <label>
            Jam Reservasi
          </label>

          <input
            type="time"
            name="reservation_time"
            value={form.reservation_time}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />

        </div>

        <div>

          <label>
            Jumlah Tamu
          </label>

          <input
            type="number"
            name="guest_count"
            min="1"
            max={table.capacity}
            value={form.guest_count}
            onChange={handleChange}
            className="border p-2 w-full"
            required
          />

        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Konfirmasi Reservasi
        </button>

      </form>

    </MainLayout>

  );

}

export default BookTable;