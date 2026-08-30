"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ApplyJob() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [cvError, setCvError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);
  const MAX_CV_SIZE = 5 * 1024 * 1024;
  const ALLOWED_CV_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", text: "" });

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_CV_TYPES.includes(file.type)) {
      setCvError("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      setCvFile(null);
      return;
    }
    if (file.size > MAX_CV_SIZE) {
      setCvError("File is too large. Maximum size is 5 MB.");
      setCvFile(null);
      return;
    }
    setCvError("");
    setCvFile(file);
  };

  const uploadCv = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const filePath = `cvs/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      throw new Error("Failed to upload CV. Please try again.");
    }

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!cvFile) {
      setFormStatus({ type: "error", text: "Please upload your CV/Resume before submitting." });
      return;
    }

    setSubmitting(true);
    setFormStatus({ type: "", text: "" });
    setCvError("");

    let cvPath: string | null = null;

    try {
      setCvUploading(true);
      cvPath = await uploadCv(cvFile);

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
            cv_url: cvPath,
          },
        ]);

      if (error) {
        setFormStatus({ type: "error", text: error.message || "Failed to submit application." });
        if (cvPath) {
          await supabase.storage.from("cvs").remove([cvPath]);
        }
      } else {
        setFormStatus({ type: "success", text: "Application submitted successfully!" });
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          position: "",
          experience: "",
        });
        setCvFile(null);
        if (cvInputRef.current) cvInputRef.current.value = "";
      }
    } catch {
      setFormStatus({ type: "error", text: "Something went wrong. Please try again." });
      if (cvPath) {
        await supabase.storage.from("cvs").remove([cvPath]);
      }
    } finally {
      setCvUploading(false);
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

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "#07132a" }}>
              Upload CV / Resume <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCvChange}
            />
            {cvFile && (
              <p style={{ margin: 0, fontSize: 13, color: "#047857" }}>Selected: {cvFile.name}</p>
            )}
            {cvError && (
              <p style={{ margin: 0, fontSize: 13, color: "#dc2626" }}>{cvError}</p>
            )}
            {cvUploading && (
              <p style={{ margin: 0, fontSize: 13, color: "#4b5563" }}>Uploading CV...</p>
            )}
            <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
              PDF, DOC or DOCX — Maximum 5 MB
            </p>
          </div>

          <textarea
            placeholder="Your Skills"
          />


          <textarea
            placeholder="Cover Letter / Message"
          />

          <button type="submit" className="btn-primary" disabled={submitting || cvUploading}>
            {submitting || cvUploading ? "Submitting..." : "Submit Application"}
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
