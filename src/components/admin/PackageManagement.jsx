import { useEffect, useState } from "react";

import API from "../../api/api";

import "./PackageManagement.css";

function PackageManagement() {

  const [packages, setPackages] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({

    title: "",

    location: "",

    duration: "",

    price: "",

    description: "",

    image: null,

  });

  useEffect(() => {

    fetchPackages();

  }, []);

  async function fetchPackages() {

    try {

      const response = await API.get(

        "/packages/"

      );

      setPackages(response.data);

    }

    catch (error) {

      console.log(error);

    }

  }

  function handleChange(e) {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  }

  function handleImage(e) {

    setFormData({

      ...formData,

      image: e.target.files[0],

    });

  }

  async function handleAddPackage(e) {

    e.preventDefault();

    try {

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        data.append(key, formData[key]);

      });

      await API.post(

        "/packages/add/",

        data,

        {

          headers: {

            "Content-Type":
            "multipart/form-data",

          },

        }

      );

      alert("Package Added Successfully");

      fetchPackages();

      setShowForm(false);

    }

    catch (error) {

      console.log(error);

      alert("Failed To Add Package");

    }

  }

  async function handleDelete(id) {

    try {

      await API.delete(

        `/packages/delete/${id}/`

      );

      fetchPackages();

    }

    catch (error) {

      console.log(error);

    }

  }

  return (

    <section className="dashboard-section">

      <div className="section-header">

        <h2>
          Package Management
        </h2>

        <button
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "Add Package"}
        </button>

      </div>

      {showForm && (

        <form
          className="package-form"
          onSubmit={handleAddPackage}
        >

          <input
            type="text"
            name="title"
            placeholder="Package Title"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="duration"
            placeholder="Duration"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            onChange={handleImage}
            required
          />

          <button type="submit">

            Save Package

          </button>

        </form>

      )}

      <div className="package-grid">

        {packages.map((pkg) => (

          <div
            className="package-card"
            key={pkg.id}
          >

            <img
              src={pkg.image}
              alt={pkg.title}
            />

            <h3>
              {pkg.title}
            </h3>

            <p>
              {pkg.location}
            </p>

            <span>
              NPR {pkg.price}
            </span>

            <button
              onClick={() => handleDelete(pkg.id)}
            >
              Delete
            </button>

          </div>

        ))}

      </div>

    </section>

  );

}

export default PackageManagement;