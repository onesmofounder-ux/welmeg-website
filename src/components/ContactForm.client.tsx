"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  return (
    <div className="contact-form-wrapper">
      <h3>Start a Conversation</h3>

      <p>
        Tell us about your project and our team will
        get back to you.
      </p>

      <form
        className="contact-form"
        onSubmit={async (e) => {
          e.preventDefault();

          try {
            const response = await fetch("/api/contact", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
              setStatus(
                "Message sent successfully! We will get back to you soon."
              );

              setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
              });
              setTimeout(() => {
                setStatus("");
              }, 5000);
            } else {
              setStatus(
                result.error || "Failed to send message. Please try again."
              );
            }
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <div className="form-row">
          <input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            required
          />
        </div>

        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) =>
            setFormData({
              ...formData,
              phone: e.target.value,
            })
          }
        />

        <input
          type="text"
          placeholder="Subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData({
              ...formData,
              subject: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Tell us about your project..."
          rows={6}
          value={formData.message}
          onChange={(e) =>
            setFormData({
              ...formData,
              message: e.target.value,
            })
          }
          required
        />

        <button type="submit" className="btn-primary">
          Send Message
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </div>
  );
}
