import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getRoomById,
  updateRoom
} from "../../services/roomService";

function EditRoom() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    room_name: "",
    price: "",
    capacity: "",
    total_rooms: "",
    image_url: "",
    description: ""
  });

  useEffect(() => {

    // eslint-disable-next-line react-hooks/immutability
    loadRoom();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadRoom = async () => {

    try {

      const response =
        await getRoomById(id);

      setFormData({
        room_name:
          response.data.room_name || "",
        price:
          response.data.price || "",
        capacity:
          response.data.capacity || "",
        total_rooms:
          response.data.total_rooms || "",
        image_url:
          response.data.image_url || "",
        description:
          response.data.description || ""
      });

    } catch (error) {

      console.log(error);

      alert("Room tidak ditemukan");

    }

  };

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
      e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await updateRoom(
        id,
        formData
      );

      alert(
        "Room berhasil diupdate"
      );

      navigate("/admin/rooms");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Gagal update room"
      );

    }

  };

  return (

    <MainLayout>

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Edit Room
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            name="room_name"
            placeholder="Nama Room"
            value={formData.room_name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Kapasitas"
            value={formData.capacity}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="number"
            name="total_rooms"
            placeholder="Jumlah Room"
            value={formData.total_rooms}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />

          <input
            type="text"
            name="image_url"
            placeholder="URL Gambar"
            value={formData.image_url}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <textarea
            name="description"
            placeholder="Deskripsi"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            rows="5"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update Room
          </button>

        </form>

      </div>

    </MainLayout>

  );

}

export default EditRoom;