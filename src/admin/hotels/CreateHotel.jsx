import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import { createHotel } from "../../services/hotelService";

function CreateHotel() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: "",
    rating: 0
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await createHotel(form);

      alert("Hotel berhasil ditambahkan");

      navigate("/admin/hotels");

    } catch (error) {

      console.log(error);

      alert("Gagal menambahkan hotel");

    }

  };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Tambah Hotel
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="text"
          name="name"
          placeholder="Nama Hotel"
          className="border p-2 w-full"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="Kota"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Alamat"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Deskripsi"
          rows="4"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="text"
          name="image_url"
          placeholder="URL Gambar"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          type="number"
          name="rating"
          step="0.1"
          min="0"
          max="5"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Simpan Hotel
        </button>

      </form>

    </MainLayout>

  );

}

export default CreateHotel;