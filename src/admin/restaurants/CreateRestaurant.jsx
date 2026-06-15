import { useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  createRestaurant
} from "../../services/restaurantService";

function CreateRestaurant() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState({

      name: "",
      city: "",
      address: "",
      description: "",
      image_url: ""

    });

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

        await createRestaurant(form);

        alert(
          "Restaurant berhasil ditambahkan"
        );

        navigate(
          "/admin/restaurants"
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Tambah Restaurant
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          name="name"
          placeholder="Nama Restaurant"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="Kota"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Alamat"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Deskripsi"
          className="border p-2 w-full"
          onChange={handleChange}
        />

        <input
          name="image_url"
          placeholder="Image URL"
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

export default CreateRestaurant;