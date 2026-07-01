import { useEffect, useState } from "react";

import API from "../../api/api";

import "./VehicleManagement.css";

function VehicleManagement() {

  /* =========================
     STATES
  ========================= */

  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({

    name: "",

    brand: "",

    price_per_day: "",

    vehicle_type: "SUV",

    rental_type: "Self Drive",

    seats: "",

    transmission: "",

    fuel_type: "",

    description: "",

    image: null,

  });

  /* =========================
     FETCH VEHICLES
  ========================= */

  useEffect(() => {

    fetchVehicles();

  }, []);

  async function fetchVehicles() {

    try {

      const response = await API.get("/vehicles/");

      setVehicles(response.data);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  }

  /* =========================
     HANDLE INPUTS
  ========================= */

  function handleChange(e) {

    const { name, value } = e.target;

    setFormData({

      ...formData,

      [name]: value,

    });

  }

  /* =========================
     HANDLE IMAGE
  ========================= */

  function handleImage(e) {

    setFormData({

      ...formData,

      image: e.target.files[0],

    });

  }

  /* =========================
     ADD VEHICLE
  ========================= */

  async function handleAddVehicle(e) {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        data.append(key, formData[key]);

      });

      await API.post(

        "/vehicles/add/",

        data,

        {

          headers: {

            "Content-Type":
            "multipart/form-data",

          },

        }

      );

      alert("Vehicle Added Successfully");

      setShowForm(false);

      fetchVehicles();

    }

    catch (error) {

      console.log(error);

      alert("Failed To Add Vehicle");

    }

  }

  /* =========================
     DELETE VEHICLE
  ========================= */

  async function handleDelete(id) {

    const confirmDelete = window.confirm(

      "Delete this vehicle?"

    );

    if (!confirmDelete) return;

    try {

      await API.delete(

        `/vehicles/delete/${id}/`

      );

      fetchVehicles();

    }

    catch (error) {

      console.log(error);

    }

  }

  return (

    <section className="dashboard-section">

      {/* HEADER */}

      <div className="section-header">

        <h2>
          Vehicle Management
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Vehicle"}
        </button>

      </div>

      {/* ADD FORM */}

      {showForm && (

        <form
          className="vehicle-form"
          onSubmit={handleAddVehicle}
        >

          <input
            type="text"
            name="name"
            placeholder="Vehicle Name"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="brand"
            placeholder="Brand"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price_per_day"
            placeholder="Price Per Day"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="seats"
            placeholder="Seats"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="transmission"
            placeholder="Transmission"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="fuel_type"
            placeholder="Fuel Type"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          />

          <select
            name="vehicle_type"
            onChange={handleChange}
          >

            <option>SUV</option>

            <option>Luxury</option>

            <option>Jeep</option>

            <option>Bike</option>

          </select>

          <select
            name="rental_type"
            onChange={handleChange}
          >

            <option>Self Drive</option>

            <option>With Driver</option>

          </select>

          <input
            type="file"
            onChange={handleImage}
            required
          />

          <button type="submit">

            Save Vehicle

          </button>

        </form>

      )}

      {/* VEHICLE TABLE */}

      {loading ? (

        <p>
          Loading vehicles...
        </p>

      ) : (

        <table>

          <thead>

            <tr>

              <th>Image</th>

              <th>Name</th>

              <th>Brand</th>

              <th>Price</th>

              <th>Status</th>

              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {vehicles.map((vehicle) => (

              <tr key={vehicle.id}>

                <td>

                  <img

                    src={vehicle.image}

                    alt={vehicle.name}

                    width="80"

                  />

                </td>

                <td>
                  {vehicle.name}
                </td>

                <td>
                  {vehicle.brand}
                </td>

                <td>
                  NPR {vehicle.price_per_day}
                </td>

                <td>
                  {vehicle.status}
                </td>

                <td>

                  <button
                    onClick={() => handleDelete(vehicle.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </section>

  );

}

export default VehicleManagement;