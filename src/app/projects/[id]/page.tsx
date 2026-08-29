import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

// Keep hardcoded projects as a fallback
const fallbackProjects = {
  "modern-buildings": {
    title: "Modern Buildings",
    category: "Construction",
    location: "Dar es Salaam, Tanzania",
    status: "Completed",
    image: "/images/optimized/construction-1024.webp",
    description:
      "Professional construction projects delivered with modern engineering standards and quality."
  },

  "property-development": {
    title: "Property Development",
    category: "Real Estate",
    location: "Tanzania",
    status: "Ongoing",
    image: "/images/property.jpg",
    description:
      "Creating modern residential and commercial properties."
  },

  "agriculture-projects": {
    title: "Agriculture Projects",
    category: "Agriculture",
    location: "Tanzania",
    status: "Ongoing",
    image: "/images/optimized/agriculture-1024.webp",
    description:
      "Innovative farming and agribusiness development solutions."
  },

  "technology-solutions": {
    title: "Technology Solutions",
    category: "Technology",
    location: "Tanzania",
    status: "Active",
    image: "/images/technology.jpg",
    description:
      "Digital solutions supporting modern businesses."
  }
};

export default async function ProjectDetails({params}: any) {
  const idParam = params.id;

  // First, try to interpret param as numeric id and fetch from Supabase
  const maybeId = Number(idParam);
  if (!Number.isNaN(maybeId)) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', maybeId)
        .maybeSingle();

      if (error) {
        // fallthrough to fallback handling
        console.error('Supabase error fetching project by id', error);
      }

      if (data) {
        const project = data as any;
        return (
          <main>
            <Navbar />

            <section className="project-details">

              <h1>{project.title}</h1>

              <p>{project.description}</p>

              <div className="project-info">
                <div>
                  <h3>Category</h3>
                  <p>{project.category}</p>
                </div>

                <div>
                  <h3>Location</h3>
                  <p>{project.location}</p>
                </div>

                <div>
                  <h3>Status</h3>
                  <p>{project.status}</p>
                </div>
              </div>

              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  width={900}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 70vw"
                  className="details-image"
                />
              )}

              <h2>About Project</h2>

              <p>
                WELMEG Solution Company Limited delivers
                professional solutions through innovation,
                quality and reliable project management.
              </p>

            </section>

            <Footer />
          </main>
        );
      }
    } catch (err) {
      console.error('Error fetching project by id', err);
    }
  }

  // Fallback: try hardcoded projects by slug
  const project = fallbackProjects[idParam as keyof typeof fallbackProjects];

  if (!project) {
    return (
      <main>
        <Navbar />

        <h1>Project Not Found</h1>

        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section className="project-details">

        <h1>{project.title}</h1>

        <p>{project.description}</p>

        <div className="project-info">

          <div>
            <h3>Category</h3>
            <p>{project.category}</p>
          </div>

          <div>
            <h3>Location</h3>
            <p>{project.location}</p>
          </div>

          <div>
            <h3>Status</h3>
            <p>{project.status}</p>
          </div>

        </div>

        <img
          src={project.image}
          alt={project.title}
          width={900}
          height={500}
          sizes="(max-width: 768px) 100vw, 70vw"
          className="details-image"
        />

        <h2>About Project</h2>

        <p>
          WELMEG Solution Company Limited delivers
          professional solutions through innovation,
          quality and reliable project management.
        </p>

      </section>

      <Footer />
    </main>
  );
}