import Link from "next/link";
import ContactForm from "@/components/ContactForm.client";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider.client";
import Navbar from "@/components/Navbar";
import Solutions from "@/components/Solutions";
import Stats from "@/components/Stats";

export default function Home() {
 return (
   <main>
     <Navbar />

     <HeroSlider />

     <div className="animated-background">
       <Solutions />
       <section className="divisions">
         <h2>Our Business Divisions</h2>

         <p className="division-text">
           WELMEG Solution Company Limited operates through
           multiple specialized business divisions delivering
           innovative solutions across different industries.
         </p>

         <div className="division-grid">
           <div className="division-card">
             <img
               src="/images/optimized/construction-1024.webp"
               srcSet="/images/optimized/construction-640.webp 640w, /images/optimized/construction-1024.webp 1024w, /images/optimized/construction-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 50vw"
               alt="WELMEG Construction"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Construction</h3>

               <p>
                 Building modern residential, commercial and
                 infrastructure projects with quality,
                 innovation and professional project management.
               </p>

               <button className="btn-primary">Explore Division</button>
             </div>
           </div>

           <div className="division-card">
             <img
               src="/images/property.jpg"
               alt="WELMEG Properties"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Properties</h3>

               <p>Real estate development and property investment.</p>

               <Link href="/divisions/properties" className="btn-primary">
                 Explore Division
               </Link>
             </div>
           </div>

           <div className="division-card">
             <img
               src="/images/optimized/agriculture-1024.webp"
               srcSet="/images/optimized/agriculture-640.webp 640w, /images/optimized/agriculture-1024.webp 1024w, /images/optimized/agriculture-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 50vw"
               alt="WELMEG Agriculture"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Agriculture</h3>

               <p>Commercial farming and agribusiness solutions.</p>

               <Link href="/divisions/agriculture" className="btn-primary">
                 Explore Division
               </Link>
             </div>
           </div>

           <div className="division-card">
             <img
               src="/images/technology.jpg"
               alt="WELMEG Technology"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Technology</h3>

               <p>Software, websites and digital transformation.</p>

               <Link href="/divisions/technology" className="btn-primary">
                 Explore Division
               </Link>
             </div>
           </div>

           <div className="division-card">
             <img
               src="/images/energy.jpg"
               alt="WELMEG Energy"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Energy</h3>

               <p>Renewable energy and engineering solutions.</p>

               <Link href="/divisions/energy" className="btn-primary">
                 Explore Division
               </Link>
             </div>
           </div>

           <div className="division-card">
             <img
               src="/images/optimized/logistics-1024.webp"
               srcSet="/images/optimized/logistics-640.webp 640w, /images/optimized/logistics-1024.webp 1024w, /images/optimized/logistics-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 50vw"
               alt="WELMEG Logistics"
               className="division-image"
             />

             <div className="division-content">
               <span className="division-icon"></span>

               <h3>WELMEG Logistics</h3>

               <p>Transportation, supply chain and logistics services.</p>

               <Link href="/divisions/logistics" className="btn-primary">
                 Explore Division
               </Link>
             </div>
           </div>
         </div>
       </section>

       <Stats />

       <section className="services-section">
         <h2>Our Services</h2>

         <div className="service-container">
           <div className="service-card">
             <h3>Construction Services</h3>
             <p>
               Professional construction solutions delivering
               quality buildings and infrastructure.
             </p>
           </div>

           <div className="service-card">
             <h3>Project Management</h3>
             <p>
               Efficient planning, supervision and execution
               of construction projects.
             </p>
           </div>

           <div className="service-card">
             <h3>Property Development</h3>
             <p>
               Creating modern residential and commercial
               properties.
             </p>
           </div>

           <div className="service-card">
             <h3>Consultancy Services</h3>
             <p>
               Expert advice for construction and property
               investments.
             </p>
           </div>
         </div>
       </section>

       <section className="about">
         <div className="about-content">
           <h2>About WELMEG</h2>

           <p>
             WELMEG Solution Company Limited is a professional
             construction and property development company
             committed to delivering innovative solutions,
             quality projects and sustainable development.
           </p>

           <p>
             We combine experience, technology and creativity
             to build modern solutions that transform communities
             and create lasting value.
           </p>

           <button className="btn-primary">Learn More</button>
         </div>
       </section>

       <section className="projects">
         <h2>Our Projects</h2>

         <div className="project-container">
           <div className="project-card">
             <img
               src="/images/optimized/construction-1024.webp"
               srcSet="/images/optimized/construction-640.webp 640w, /images/optimized/construction-1024.webp 1024w, /images/optimized/construction-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 33vw"
               alt="Modern Building Project"
             />

             <h3>Modern Buildings</h3>

             <p>
               Designing and constructing modern
               buildings with quality standards.
             </p>
             <button className="project-btn">View Project</button>
           </div>

           <div className="project-card">
             <img
               src="/images/optimized/construction-1024.webp"
               srcSet="/images/optimized/construction-640.webp 640w, /images/optimized/construction-1024.webp 1024w, /images/optimized/construction-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 33vw"
               alt="Residential Building Project"
             />

             <h3>Residential Projects</h3>

             <p>
               Creating comfortable and sustainable
               homes for modern living.
             </p>
             <button className="project-btn">View Project</button>
           </div>

           <div className="project-card">
             <img
               src="/images/optimized/commercial building-1024.webp"
               srcSet="/images/optimized/commercial building-640.webp 640w, /images/optimized/commercial building-1024.webp 1024w, /images/optimized/commercial building-1600.webp 1600w"
               sizes="(max-width: 768px) 100vw, 33vw"
               alt="Commercial Building Project"
             />

             <h3>Commercial Properties</h3>

             <p>
               Developing commercial spaces that
               support business growth.
             </p>

             <button className="project-btn">View Project</button>
           </div>
         </div>
       </section>

       <section className="why-us">
         <div className="why-left">
           <h2>Why Choose WELMEG?</h2>

           <p>
             We combine innovation, engineering excellence and
             professional project management to deliver world-class
             solutions across multiple industries.
           </p>

           <div className="why-item">
             <span>✔</span>
             <p>Experienced Professional Team</p>
           </div>

           <div className="why-item">
             <span>✔</span>
             <p>Quality Guaranteed Projects</p>
           </div>

           <div className="why-item">
             <span>✔</span>
             <p>Modern Engineering Solutions</p>
           </div>

           <div className="why-item">
             <span>✔</span>
             <p>Trusted by Clients</p>
           </div>
         </div>

         <div className="why-right">
           <img
             src="/images/optimized/team-1024.webp"
             srcSet="/images/optimized/team-640.webp 640w, /images/optimized/team-1024.webp 1024w, /images/optimized/team-1600.webp 1600w"
             sizes="(max-width: 768px) 100vw, 50vw"
             alt="WELMEG Team"
             className="why-image"
           />
         </div>
       </section>

       <section className="cta">
         <h2>Let's Build Something Great Together</h2>

         <p>
           Whether you're planning a construction project,
           property investment, or engineering solution,
           WELMEG is ready to help you succeed.
         </p>

         <div className="cta-buttons">
           <button className="btn-primary">Contact Us</button>
           <button className="btn-secondary">View Projects</button>
         </div>
       </section>

       <section className="contact-section">
         <div className="contact-container">
           <div className="contact-info">
             <span className="contact-eyebrow">GET IN TOUCH</span>

             <h2>Let’s Build Something Great Together</h2>

             <p className="contact-intro">
               Have a construction, property, technology or business
               project in mind? Our team is ready to discuss your
               vision and explore the right solution for you.
             </p>

             <div className="contact-details">
               <a href="tel:+255794561067" className="contact-item">
                 <span className="contact-icon">📞</span>

                 <div>
                   <strong>Call Us</strong>
                   <p>0794 561 067</p>
                 </div>
               </a>

               <a
                 href="https://wa.me/255794561067"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="contact-item"
               >
                 <span className="contact-icon">💬</span>

                 <div>
                   <strong>WhatsApp</strong>
                   <p>Chat with our team</p>
                 </div>
               </a>

               <a href="mailto:welmegsolution@gmail.com" className="contact-item">
                 <span className="contact-icon">📧</span>

                 <div>
                   <strong>Email Us</strong>
                   <p>welmegsolution@gmail.com</p>
                 </div>
               </a>

               <div className="contact-item">
                 <span className="contact-icon">📍</span>

                 <div>
                   <strong>Location</strong>
                   <p>Dar es Salaam, Tanzania</p>
                 </div>
               </div>
             </div>
           </div>

           <ContactForm />
         </div>
       </section>
     </div>

     <Footer />
   </main>
 );
}
