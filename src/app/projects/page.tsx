export const dynamic = 'force-dynamic'
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

export default async function ProjectsPage() {
  // Keep the hardcoded fallback projects available
  const fallbackProjects = [
    {
      title: "Modern Buildings",
      image: "/images/optimized/construction-1024.webp",
      description:
        "Professional construction projects with modern engineering standards."
    },

    {
      title: "Property Development",
      image: "/images/property.jpg",
      description:
        "Creating quality residential and commercial properties."
    },

    {
      title: "Agriculture Projects",
      image: "/images/optimized/agriculture-1024.webp",
      description:
        "Innovative farming and agribusiness development solutions."
    },

    {
      title: "Technology Solutions",
      image: "/images/technology.jpg",
      description:
        "Digital solutions supporting modern businesses."
    }

  ];

  // Try to fetch published projects from Supabase; fall back to hardcoded list if unavailable
  let projectsFromDb = [] as any[];
  let fetchError = null as any;

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id,title,category,location,description,image_url,status')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) {
      fetchError = error;
    } else if (data) {
      projectsFromDb = data;
    }
  } catch (err:any) {
    fetchError = err;
  }

  const useDb = projectsFromDb && projectsFromDb.length > 0;

  const projectsToRender = useDb ? projectsFromDb : fallbackProjects;

  return (
    <main>

      <Navbar />


      <section className="projects-header">

        <h1>Our Projects</h1>

        <p>
          Explore our projects delivered through
          innovation, quality and professional expertise.
        </p>

      </section>


      <section className="projects-gallery">

        {fetchError && (
          <div style={{color:'red', marginBottom:12}}>
            Could not load projects from the database. Showing default projects.
          </div>
        )}

        {projectsToRender.map((project:any, index:number) => (

          <div className="project-box" key={project.id ?? index}>

            <img
              src={project.image_url || project.image}
              alt={project.title}
              width={500}
              height={300}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="project-image"
            />

            <div className="project-content">

              <h2>
                {project.title}
              </h2>

              <p>
                {project.description}
              </p>

             <Link href={useDb ? `/projects/${project.id}` : `/projects/${project.title.toLowerCase().replaceAll(" ","-")}`}>
  <button className="btn-primary">
    View Details
  </button>
</Link>

            </div>

          </div>

        ))}

      </section>


      <Footer />

    </main>
  );
}