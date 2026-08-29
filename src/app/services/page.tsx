import Navbar from "@/components/Navbar";
export default function ServicesPage(){

  return (

    <main>
<Navbar />
      <section className="services-page">

        <h1>Our Services</h1>

        <p>
          We provide professional solutions in construction,
          project management, property development and
          consultancy.
        </p>

      </section>


      <section className="service-list">


        <div className="service-box">
          <h2>Construction Services</h2>
          <p>
            Quality construction solutions for residential,
            commercial and infrastructure projects.
          </p>
        </div>


        <div className="service-box">
          <h2>Project Management</h2>
          <p>
            Professional planning, supervision and delivery
            of successful projects.
          </p>
        </div>


        <div className="service-box">
          <h2>Property Development</h2>
          <p>
            Developing modern properties that create value.
          </p>
        </div>


        <div className="service-box">
          <h2>Consultancy</h2>
          <p>
            Expert guidance for construction and investment
            decisions.
          </p>
        </div>


      </section>


    </main>

  );
}