export default function Careers(){

  return(

    <main className="careers-page">


      <section className="careers-hero">

        <h1>
          Join WELMEG Team
        </h1>

        <p>
          Build your future with WELMEG Solution Company Limited.
        </p>

      </section>



      <section className="career-options">


        <div className="career-card">

          <h2>
            Apply For A Job
          </h2>

          <p>
            Are you a professional looking for
            opportunities in construction,
            engineering or management?
          </p>

          <a href="/careers/apply" className="btn-primary">
  Apply Now
</a>

        </div>



        <div className="career-card">

          <h2>
            Register As Skilled Worker
          </h2>

          <p>
            Are you a mason, electrician,
            carpenter, plumber or technician?
          </p>

         <a 
 href="/careers/skilled-worker" 
 className="btn-primary"
>
  Register Now
</a> 

        </div>


      </section>


    </main>

  );

}