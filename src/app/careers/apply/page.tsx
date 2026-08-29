"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplyJob() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
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
        .from("job_applications")
        .insert([
          {
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            position: formData.position,
            experience: formData.experience,
            status: "Pending",
          },
        ]);

      if (error) {
        setFormStatus({ type: "error", text: error.message || "Failed to submit application." });
      } else {
        setFormStatus({ type: "success", text: "Application submitted successfully!" });
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
        });
      }
    } catch {
      setFormStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="apply-page">

      <section className="apply-hero">

        <h1>
          Apply For A Job
        </h1>

        <p>
          Join WELMEG Solution Company Limited
          and build the future with us.
        </p>

      </section>



      <section className="apply-form">

        <h2>
          Job Application Form
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
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            placeholder="Position Applying For"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />


          <input
            type="text"
            placeholder="Education Level"
          />


          <input
            type="text"
            placeholder="Years of Experience"
            value={formData.experience}
            onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
          />


          <textarea
            placeholder="Your Skills"
          />


          <textarea
            placeholder="Cover Letter / Message"
          />


          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Application"}
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
