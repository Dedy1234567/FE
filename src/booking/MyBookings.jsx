import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getMyHotelBookings,
  cancelHotelBooking
} from "../services/bookingService";

function MyBookings() {

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const loadBookings =
    async () => {

      try {

        const response =
          await getMyHotelBookings();

        setBookings(response.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();

  }, []);

  const handleCancel =
    async (id) => {

      const confirmCancel =
        window.confirm(
          "Batalkan booking ini?"
        );

      if (!confirmCancel) {
        return;
      }

      try {

        await cancelHotelBooking(id);

        alert(
          "Booking berhasil dibatalkan"
        );

        loadBookings();

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Gagal membatalkan booking"
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

  return (

    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">

        My Bookings

      </h1>

      {
        bookings.length === 0 && (

          <div className="border p-4 rounded">

            Belum ada booking.

          </div>

        )
      }

      <div className="space-y-4">

        {
          bookings.map((booking) => (

            <div
              key={booking.id}
              className="border rounded p-4 shadow"
            >

              <h2 className="text-xl font-bold">

                {booking.hotel_name}

              </h2>

              <p>

                Room:
                {" "}
                {booking.room_name}

              </p>

              <p>

                Check In:
                {" "}
                {booking.check_in}

              </p>

              <p>

                Check Out:
                {" "}
                {booking.check_out}

              </p>

              <p>

                Total Nights:
                {" "}
                {booking.total_nights}

              </p>

              <p>

                Total Price:
                {" "}
                Rp
                {" "}
                {Number(
                  booking.total_price
                ).toLocaleString()}

              </p>

              <p>

                Status:
                {" "}

                <span
                  className={
                    booking.status === "pending"
                      ? "text-yellow-600"
                      : booking.status === "cancelled"
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {booking.status}
                </span>

              </p>

              {
                booking.status !==
                  "cancelled" && (

                  <button
                    onClick={() =>
                      handleCancel(
                        booking.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded mt-4"
                  >
                    Cancel Booking
                  </button>

                )
              }

            </div>

          ))
        }

      </div>

    </MainLayout>

  );

}

export default MyBookings;