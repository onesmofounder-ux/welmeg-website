import Image from "next/image";

export default function Solutions() {
  return (
    <section className="solutions-section">
      <h2>Our Solution Suite</h2>

      <p className="solutions-text">
        Discover our innovative business solutions designed
        to transform industries and communities.
      </p>

      <div className="solutions-grid">

        <div className="solution-card">
          <img
            src="/images/optimized/construction-1024.webp"
            srcSet="/images/optimized/construction-640.webp 640w, /images/optimized/construction-1024.webp 1024w, /images/optimized/construction-1600.webp 1600w"
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Construction"
            className="solution-image"
            width={500}
            height={300}
          />

          <div className="solution-content">
            <h3>Construction</h3>

            <p>
              Modern residential and commercial construction
              solutions.
            </p>

            <button className="btn-primary">
              Learn More
            </button>
          </div>
        </div>


        <div className="solution-card">
          <Image
            src="/images/property.jpg"
            alt="Property Development"
            width={500}
            height={300}
            className="solution-image"
          />

          <div className="solution-content">
            <h3>Property Development</h3>

            <p>
              Professional real estate and property
              investment solutions.
            </p>

            <button className="btn-primary">
              Learn More
            </button>
          </div>
        </div>


        <div className="solution-card">
          <img
            src="/images/optimized/agriculture-1024.webp"
            srcSet="/images/optimized/agriculture-640.webp 640w, /images/optimized/agriculture-1024.webp 1024w, /images/optimized/agriculture-1600.webp 1600w"
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Agriculture"
            className="solution-image"
            width={500}
            height={300}
          />

          <div className="solution-content">
            <h3>Agriculture</h3>

            <p>
              Smart farming and agribusiness
              development solutions.
            </p>

            <button className="btn-primary">
              Learn More
            </button>
          </div>
        </div>


        <div className="solution-card">
          <Image
            src="/images/technology.jpg"
            alt="Technology"
            width={500}
            height={300}
            className="solution-image"
          />

          <div className="solution-content">
            <h3>Technology</h3>

            <p>
              Software, websites and digital
              transformation services.
            </p>

            <button className="btn-primary">
              Learn More
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}