import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      location,
      subject,
      message,
    } = body;

    const { data, error } = await resend.emails.send({
      from: "Green Lunar Website <onboarding@resend.dev>",
      to: ["nwanzeu@gmail.com"],
      subject: subject || `Website enquiry from ${firstName} ${lastName}`,
      replyTo: email,
      html: `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        {
          message: error.message || "Resend failed",
          error,
        },
        { status: 500 }
      );
    }

    console.log("EMAIL SENT:", data);

    return NextResponse.json(
      {
        message: "Message sent successfully.",
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("CONTACT API ERROR:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unknown server error",
      },
      { status: 500 }
    );
  }
}