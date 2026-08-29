import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Missing or invalid Authorization header." },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { error: "Invalid or expired token." },
        { status: 401 }
      );
    }

    if (user.app_metadata?.role !== "admin") {
      return Response.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { client_name, email, project_type, new_status } = body;

    if (!client_name || !email || !new_status) {
      return Response.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "WELMEG Website <onboarding@resend.dev>",
      to: [email],
      subject: "WELMEG Project Request Status Update",
      replyTo: "welmegsolution@gmail.com",
      html: `
        <h2>Project Request Status Update</h2>
        <p>Hello ${escapeHtml(client_name)},</p>
        <p>We are writing to inform you that the status of your WELMEG project request has been updated.</p>
        <p><strong>Project:</strong> ${escapeHtml(project_type || "Not specified")}</p>
        <p><strong>New Status:</strong> ${escapeHtml(new_status)}</p>
        <p>Our team will continue to process your request accordingly.</p>
        <p>Regards,<br/>WELMEG Solution Company Limited</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "Failed to send status email." },
        { status: 500 }
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("Project status email error:", error);
    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
