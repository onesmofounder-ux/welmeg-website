"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ClientPortal() {

  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    location: "",
    project_type: "",
    message: "",
  });


  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();


    const { data, error } = await supabase
      .from("project_requests")
      .insert([
        {
          client_name: formData.client_name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          project_type: formData.project_type,
          message: formData.message,
        },
      ])
      .select()
      .single();


     if(error){

   console.log(error);
   alert(error.message);

 }else {

       setSuccessRequestId(data.id as string);
       setSuccessEmail(formData.email);
       setFormData({
         client_name:"",
         email:"",
         phone:"",
         location:"",
         project_type:"",
         message:"",
       });

     }

  };

  const [trackingId, setTrackingId] = useState("");
  const [trackingEmail, setTrackingEmail] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingStatus, setTrackingStatus] = useState<"idle" | "loading" | "found" | "not_found" | "error">("idle");
  const [trackingError, setTrackingError] = useState("");

  const [successRequestId, setSuccessRequestId] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const trackingSectionRef = useRef<HTMLDivElement>(null);
  const trackingIdInputRef = useRef<HTMLInputElement>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingStatus("loading");
    setTrackingResult(null);
    setTrackingError("");

    try {
      const { data, error } = await supabase
        .from("project_requests")
        .select("*")
        .eq("id", trackingId)
        .eq("email", trackingEmail)
        .maybeSingle();

      if (error) {
        setTrackingStatus("error");
        setTrackingError(error.message);
      } else if (data) {
        setTrackingResult(data);
        setTrackingStatus("found");
      } else {
        setTrackingStatus("not_found");
      }
    } catch (err) {
      setTrackingStatus("error");
      setTrackingError("Something went wrong. Please try again.");
    }
  };

  const steps = ["Pending", "Reviewing", "Approved", "Completed"];
  const currentStatus = trackingResult?.status || "";
  const currentIndex = steps.indexOf(currentStatus);

  const handleCopyId = async () => {
    if (!successRequestId) return;
    try {
      await navigator.clipboard.writeText(successRequestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleTrackMyRequest = () => {
    if (trackingSectionRef.current) {
      trackingSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (successRequestId && trackingIdInputRef.current) {
      setTrackingId(successRequestId);
      setTrackingEmail(successEmail);
      setTimeout(() => {
        trackingIdInputRef.current?.focus();
      }, 400);
    }
  };

  const handleSubmitAnother = () => {
    setSuccessRequestId(null);
    setSuccessEmail("");
    setCopied(false);
  };

  return (
    <main className="client-page">


      <section className="client-hero">

        <h1>
          Request A Project
        </h1>

        <p>
          Tell WELMEG about your construction,
          property development or consultancy project.
        </p>

      </section>



      <section className="client-form">


        <h2>
          Project Information
        </h2>


        <form onSubmit={handleSubmit}>


          <input
            type="text"
            placeholder="Full Name"
            value={formData.client_name}
            onChange={(e)=>setFormData({...formData,client_name:e.target.value})}
          />



          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e)=>setFormData({...formData,email:e.target.value})}
          />



          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e)=>setFormData({...formData,phone:e.target.value})}
          />



          <input
            type="text"
            placeholder="Project Location"
            value={formData.location}
            onChange={(e)=>setFormData({...formData,location:e.target.value})}
          />



          <select
            value={formData.project_type}
            onChange={(e)=>setFormData({...formData,project_type:e.target.value})}
          >

            <option value="">
              Select Project Type
            </option>

            <option>
              Residential Building
            </option>

            <option>
              Commercial Building
            </option>

            <option>
              Road Construction
            </option>

            <option>
              Renovation
            </option>

          </select>



          <textarea
            placeholder="Describe your project"
            value={formData.message}
            onChange={(e)=>setFormData({...formData,message:e.target.value})}
          />



          <button className="btn-primary">
            Submit Request
          </button>


        </form>


      </section>

      {successRequestId && (
        <section className="client-form" style={{ marginTop: 40 }}>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}>
            <h2 style={{ margin: "0 0 12px", color: "#0b1f3a" }}>Project Request Submitted Successfully</h2>
            <p style={{ margin: "0 0 16px", color: "#475569" }}>
              Thank you for reaching out to WELMEG Solution Company Limited. We have received your project request and will review it shortly.
            </p>

            <div style={{
              background: "#f8fafc",
              border: "1px solid #eef2f7",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16
            }}>
              <p style={{ margin: "0 0 8px", color: "#6b7280", fontSize: 13 }}>Your Request ID</p>
              <p style={{ margin: "0 0 12px", color: "#0b1f3a", fontWeight: 700, fontSize: 20 }}>{successRequestId}</p>
              <p style={{ margin: "0 0 12px", color: "#475569", fontSize: 14 }}>
                <strong>Email:</strong> {successEmail}
              </p>
              <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>
                Please keep this Request ID safe. You will need it to track your request status.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" className="btn-primary" onClick={handleCopyId}>
                {copied ? "Copied!" : "Copy Request ID"}
              </button>
              <button type="button" className="btn-secondary" onClick={handleTrackMyRequest}>
                Track My Request
              </button>
              <button type="button" className="btn-secondary" onClick={handleSubmitAnother}>
                Submit Another Request
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="client-form" style={{ marginTop: 40 }} ref={trackingSectionRef}>

        <h2>
          Track Your Request
        </h2>

        <form onSubmit={handleTrack}>

          <input
            type="text"
            placeholder="Request ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            required
            ref={trackingIdInputRef}
          />

          <input
            type="email"
            placeholder="Email Address"
            value={trackingEmail}
            onChange={(e) => setTrackingEmail(e.target.value)}
            required
          />

          <button type="submit" className="btn-primary">
            Track Request
          </button>

        </form>

        {trackingStatus === "loading" && (
          <p style={{ marginTop: 12 }}>Loading...</p>
        )}

        {trackingStatus === "error" && (
          <p style={{ marginTop: 12, color: "#b91c1c" }}>{trackingError}</p>
        )}

        {trackingStatus === "not_found" && (
          <p style={{ marginTop: 12, color: "#6b7280" }}>Request not found. Please check your Request ID and email.</p>
        )}

        {trackingStatus === "found" && trackingResult && (
          <div style={{ marginTop: 20 }}>
            <p><strong>Request ID:</strong> {trackingResult.id}</p>
            <p><strong>Name:</strong> {trackingResult.client_name}</p>
            <p><strong>Project Type:</strong> {trackingResult.project_type}</p>
            <p><strong>Location:</strong> {trackingResult.location}</p>
            <p><strong>Submitted:</strong> {trackingResult.created_at ? new Date(trackingResult.created_at).toLocaleDateString() : ""}</p>
            <p><strong>Status:</strong> {trackingResult.status}</p>
            {trackingResult.message && (
              <p><strong>Message:</strong> {trackingResult.message}</p>
            )}

            <div style={{ marginTop: 20 }}>
              <p><strong>Progress</strong></p>
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                {steps.map((step, index) => {
                  const isActive = currentIndex >= index;
                  const isCurrent = currentStatus === step;
                  return (
                    <div
                      key={step}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 6,
                        background: isActive ? "#d4af37" : "#e5e7eb",
                        color: isActive ? "#fff" : "#6b7280",
                        fontWeight: isCurrent ? 700 : 400,
                      }}
                    >
                      {step}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </section>


    </main>
  );
}
