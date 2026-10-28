import { Link } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";

import Footer from "../components/Footer/Footer";

function NotFound() {

  return (

    <>

      <Navbar />

      <section className="not-found">

        <h1>404</h1>

        <p>The page you are looking for doesn't exist.</p>

        <Link to="/">Back to Home</Link>

      </section>

      <Footer />

    </>

  );

}

export default NotFound;
