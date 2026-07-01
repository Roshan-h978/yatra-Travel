import {

  useEffect,

  useState

}

from "react";

import API from "../../api/api";

function DriverManagement(){

  const [drivers,setDrivers] =
  useState([]);

  const [formData,setFormData] =
  useState({

    full_name:"",

    phone:"",

    email:"",

    license_number:"",

    experience_years:"",

    address:"",

    status:"Available",

  });

  useEffect(()=>{

    fetchDrivers();

  },[]);

  async function fetchDrivers(){

    try{

      const response =
      await API.get("/drivers/");

      setDrivers(response.data);

    }

    catch(error){

      console.log(error);

    }

  }

  function handleChange(e){

    setFormData({

      ...formData,

      [e.target.name]:
      e.target.value

    });

  }

  async function addDriver(e){

    e.preventDefault();

    try{

      await API.post(

        "/drivers/add/",

        formData

      );

      fetchDrivers();

    }

    catch(error){

      console.log(error);

    }

  }

  async function deleteDriver(id){

    try{

      await API.delete(

        `/drivers/delete/${id}/`

      );

      fetchDrivers();

    }

    catch(error){

      console.log(error);

    }

  }

  return(

    <section className="dashboard-section">

      <div className="section-header">

        <h2>

          Driver Management

        </h2>

      </div>

      <form
        className="vehicle-form"
        onSubmit={addDriver}
      >

        <input
          type="text"
          name="full_name"
          placeholder="Driver Name"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="license_number"
          placeholder="License Number"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="experience_years"
          placeholder="Experience"
          onChange={handleChange}
          required
        />

        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <button type="submit">

          Add Driver

        </button>

      </form>

      <table>

        <thead>

          <tr>

            <th>Name</th>

            <th>Phone</th>

            <th>Status</th>

            <th>Experience</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {

            drivers.map((driver)=>(

              <tr key={driver.id}>

                <td>

                  {driver.full_name}

                </td>

                <td>

                  {driver.phone}

                </td>

                <td>

                  {driver.status}

                </td>

                <td>

                  {driver.experience_years} Years

                </td>

                <td>

                  <button
                    onClick={()=>deleteDriver(driver.id)}
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          }

        </tbody>

      </table>

    </section>

  );

}

export default DriverManagement;