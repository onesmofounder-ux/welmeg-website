import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      subject,
      message,
    } = body;

    if (!name || !email || !message) {
      return Response.json(
        {
          error: "Please fill in all required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "WELMEG Website <onboarding@resend.dev>",
      to: ["onesmofounder@gmail.com"],
      subject: subject || "New Contact Message - WELMEG",
      replyTo: email,
      html: `
        <h2>New Contact Message</h2>

        <p><strong>Name:</strong> ${name}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>

        <p><strong>Subject:</strong> ${
          subject || "Not provided"
        }</p>

        <hr />

        <p><strong>Message:</strong></p>

        <p>${message}</p>

        <hr />

        <p>
          Sent from the WELMEG Solution Company Limited website.
        </p>
      `,
    });

    if (error) {
      console.error(error);

      return Response.json(
        {
          error: "Failed to send email.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}