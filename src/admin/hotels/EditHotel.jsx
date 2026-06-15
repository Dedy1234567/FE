import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getHotelById,
  updateHotel
} from "../../services/hotelService";

function EditHotel() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: 0
  });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadHotel();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadHotel = async () => {

    try {

      const response =
        await getHotelById(id);

      setForm(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateHotel(
        id,
        form
      );

      alert("Hotel berhasil diupdate");

      navigate("/admin/hotels");

    } catch (error) {

      console.log(error);

      alert("Gagal update hotel");

    }

  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Edit Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="city"
          value={form.city}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          className="border p-2 w-full"
        />

        <input
          type="text"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          className="border p-2 w-full"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Hotel
        </button>

      </form>

    </MainLayout>

  );

}

export default EditHotel;