import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is missing");

      return NextResponse.json(
        { message: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

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
      subject:
        subject || `Website enquiry from ${firstName} ${lastName}`,
      replyTo: email,
      html: `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${location || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("RESEND ERROR:", error);

      return NextResponse.json(
        { message: error.message || "Unable to send message." },
        { status: 500 }
      );
    }

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
      { message: "Unable to send message." },
      { status: 500 }
    );
  }
}