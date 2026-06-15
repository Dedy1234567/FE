import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getRestaurantById,
  updateRestaurant
} from "../../services/restaurantService";

function EditRestaurant() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    image_url: ""
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadRestaurant();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRestaurant = async () => {

    try {

      const response =
        await getRestaurantById(id);

      setForm({
        name: response.data.name || "",
        city: response.data.city || "",
        address: response.data.address || "",
        description: response.data.description || "",
        image_url: response.data.image_url || ""
      });

    } catch (error) {

      console.log(error);

      alert("Restaurant tidak ditemukan");

      navigate("/admin/restaurants");

    } finally {

      setLoading(false);

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

      await updateRestaurant(
        id,
        form
      );

      alert(
        "Restaurant berhasil diupdate"
      );

      navigate(
        "/admin/restaurants"
      );

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Gagal update restaurant"
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

      <div className="max-w-2xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Restaurant
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="block mb-1">
              Nama Restaurant
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />

          </div>

          <div>

            <label className="block mb-1">
              Kota
            </label>

            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />

          </div>

          <div>

            <label className="block mb-1">
              Alamat
            </label>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />

          </div>

          <div>

            <label className="block mb-1">
              Deskripsi
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              rows="4"
            />

          </div>

          <div>

            <label className="block mb-1">
              URL Gambar
            </label>

            <input
              type="text"
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />

          </div>

          {form.image_url && (

            <div>

              <p className="mb-2 font-semibold">
                Preview Gambar
              </p>

              <img
                src={form.image_url}
                alt="Restaurant"
                className="w-full max-w-md rounded border"
              />

            </div>

          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Update Restaurant
          </button>

        </form>

      </div>

    </MainLayout>

  );

}

export default EditRestaurant;