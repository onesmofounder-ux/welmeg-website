"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SkilledWorker() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    location: "",
    skill_type: "",
    experience: "",
    availability: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", text: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFormStatus({ type: "", text: "" });

    try {
      const { error } = await supabase
        .from("skilled_workers")
        .insert([
          {
            full_name: formData.full_name,
            phone: formData.phone,
            location: formData.location,
            skill_type: formData.skill_type,
            experience: formData.experience,
            availability: formData.availability || "Available",
          },
        ]);

      if (error) {
        setFormStatus({ type: "error", text: error.message || "Failed to register. Please try again." });
      } else {
        setFormStatus({ type: "success", text: "Registration submitted successfully!" });
        setFormData({
          full_name: "",
          phone: "",
          location: "",
          skill_type: "",
          experience: "",
          availability: "",
        });
      }
    } catch {
      setFormStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="worker-page">


      <section className="worker-hero">

        <h1>
          Register As Skilled Worker
        </h1>

        <p>
          Join WELMEG network of professional
          construction workers.
        </p>

      </section>



      <section className="worker-form">

        <h2>
          Worker Registration Form
        </h2>


        <form onSubmit={handleSubmit}>


          <input
            type="text"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />


          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />


          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />


          <select
            value={formData.skill_type}
            onChange={(e) => setFormData({ ...formData, skill_type: e.target.value })}
            required
          >

            <option value="">
              Select Profession
            </option>

            <option value="Mason">
              Mason
            </option>

            <option value="Electrician">
              Electrician
            </option>

            <option value="Plumber">
              Plumber
            </option>

            <option value="Carpenter">
              Carpenter
            </option>

            <option value="Welder">
              Welder
            </option>

            <option value="Painter">
              Painter
            </option>

          </select>



          <input
            type="text"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />



          <textarea
            placeholder="Describe your skills and previous work"
          />



          <textarea
            placeholder="Availability"
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          />



          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Registering..." : "Register"}
          </button>

          {formStatus.text && (
            <p
              className="form-status"
              style={{
                background: formStatus.type === "error" ? "#fef2f2" : "#ecfdf5",
                color: formStatus.type === "error" ? "#b91c1c" : "#047857",
              }}
            >
              {formStatus.text}
            </p>
          )}

        </form>


      </section>


    </main>
  );
}
