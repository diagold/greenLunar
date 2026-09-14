import { NextResponse } from "next/server";
import { Resend } from "resend";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

    // -----------------------------
    // Server-side validation
    // -----------------------------

    if (
      !firstName ||
      !lastName ||
      !email ||
      !location ||
      !subject ||
      !message
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(firstName.trim())) {
      return NextResponse.json(
        { message: "Please enter a valid first name." },
        { status: 400 }
      );
    }

    if (!nameRegex.test(lastName.trim())) {
      return NextResponse.json(
        { message: "Please enter a valid last name." },
        { status: 400 }
      );
    }

    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (subject.trim().length < 3) {
      return NextResponse.json(
        { message: "Subject must be at least 3 characters." },
        { status: 400 }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        { message: "Message must be at least 10 characters." },
        { status: 400 }
      );
    }

    // -----------------------------
    // Sanitize user input
    // -----------------------------

    const safeFirstName = escapeHtml(firstName.trim());
    const safeLastName = escapeHtml(lastName.trim());
    const safeEmail = escapeHtml(email.trim());
    const safeLocation = escapeHtml(location.trim());
    const safeSubject = escapeHtml(subject.trim());
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, "<br />");

    // -----------------------------
    // Branding
    // -----------------------------

    const logoUrl =
      "https://res.cloudinary.com/diobpauw/image/upload/v1789023068/ChatGPT_Image_Sep_10_2026_07_50_53_AM.png";

    const currentYear = new Date().getFullYear();

    // -----------------------------
    // Send email
    // -----------------------------

    const { data, error } = await resend.emails.send({
      from: "Green Lunar Website <onboarding@resend.dev>",

      // Replace this after your domain is verified
      to: ["nwanzeu@gmail.com"],

      subject: `Website Enquiry: ${subject.trim()}`,

      replyTo: email.trim(),

      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Website Enquiry</title>
        </head>

        <body
          style="
            margin:0;
            padding:0;
            background-color:#f3f5f4;
            font-family:Arial, Helvetica, sans-serif;
            color:#1f2937;
          "
        >

          <table
            role="presentation"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            border="0"
            style="
              width:100%;
              background-color:#f3f5f4;
              padding:40px 15px;
            "
          >
            <tr>
              <td align="center">

                <!-- EMAIL CONTAINER -->
                <table
                  role="presentation"
                  width="100%"
                  cellspacing="0"
                  cellpadding="0"
                  border="0"
                  style="
                    width:100%;
                    max-width:700px;
                    background-color:#ffffff;
                    border-radius:16px;
                    overflow:hidden;
                    box-shadow:0 10px 35px rgba(0,0,0,0.08);
                  "
                >

                  <!-- HEADER -->
                  <tr>
                    <td
                      style="
                        padding:28px 40px;
                        background-color:#ffffff;
                      "
                    >

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >
                        <tr>

                          <td align="left" valign="middle">
                            <img
                              src="${logoUrl}"
                              alt="Green Lunar Nigeria Limited"
                              width="180"
                              style="
                                display:block;
                                width:180px;
                                max-width:100%;
                                height:auto;
                                border:0;
                              "
                            />
                          </td>

                          <td
                            align="right"
                            valign="middle"
                            style="
                              font-size:14px;
                              line-height:20px;
                              color:#64748b;
                            "
                          >
                            Powering a Cleaner,<br />
                            Greener Africa.
                          </td>

                        </tr>
                      </table>

                    </td>
                  </tr>


                  <!-- HERO SECTION -->
                  <tr>
                    <td
                      style="
                        padding:42px 40px;
                        background-color:#ecf8f0;
                      "
                    >

                      <p
                        style="
                          margin:0 0 12px 0;
                          font-size:12px;
                          line-height:18px;
                          font-weight:700;
                          letter-spacing:3px;
                          color:#08783e;
                          text-transform:uppercase;
                        "
                      >
                        New Website Enquiry
                      </p>

                      <h1
                        style="
                          margin:0 0 12px 0;
                          font-size:30px;
                          line-height:38px;
                          font-weight:700;
                          color:#111827;
                        "
                      >
                        You've received a new message
                      </h1>

                      <p
                        style="
                          margin:0;
                          font-size:15px;
                          line-height:24px;
                          color:#64748b;
                        "
                      >
                        A visitor has submitted the contact form on the
                        Green Lunar website. Their enquiry details are below.
                      </p>

                    </td>
                  </tr>


                  <!-- ENQUIRY DETAILS -->
                  <tr>
                    <td
                      style="
                        padding:30px 30px 10px 30px;
                      "
                    >

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          width:100%;
                          border:1px solid #e5e7eb;
                          border-radius:12px;
                        "
                      >

                        <!-- NAME -->
                        <tr>

                          <td
                            width="30%"
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              font-weight:700;
                              color:#334155;
                            "
                          >
                            Name
                          </td>

                          <td
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              color:#475569;
                            "
                          >
                            ${safeFirstName} ${safeLastName}
                          </td>

                        </tr>


                        <!-- EMAIL -->
                        <tr>

                          <td
                            width="30%"
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              font-weight:700;
                              color:#334155;
                            "
                          >
                            Email
                          </td>

                          <td
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                            "
                          >
                            <a
                              href="mailto:${safeEmail}"
                              style="
                                color:#08783e;
                                text-decoration:none;
                                font-weight:500;
                              "
                            >
                              ${safeEmail}
                            </a>
                          </td>

                        </tr>


                        <!-- LOCATION -->
                        <tr>

                          <td
                            width="30%"
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              font-weight:700;
                              color:#334155;
                            "
                          >
                            Location
                          </td>

                          <td
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              color:#475569;
                            "
                          >
                            ${safeLocation}
                          </td>

                        </tr>


                        <!-- SUBJECT -->
                        <tr>

                          <td
                            width="30%"
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              font-weight:700;
                              color:#334155;
                            "
                          >
                            Subject
                          </td>

                          <td
                            valign="top"
                            style="
                              padding:18px 24px;
                              border-bottom:1px solid #e5e7eb;
                              font-size:14px;
                              color:#475569;
                            "
                          >
                            ${safeSubject}
                          </td>

                        </tr>


                        <!-- MESSAGE -->
                        <tr>

                          <td
                            width="30%"
                            valign="top"
                            style="
                              padding:18px 24px;
                              font-size:14px;
                              font-weight:700;
                              color:#334155;
                            "
                          >
                            Message
                          </td>

                          <td
                            valign="top"
                            style="
                              padding:18px 24px;
                              font-size:14px;
                              line-height:24px;
                              color:#475569;
                            "
                          >
                            ${safeMessage}
                          </td>

                        </tr>

                      </table>

                    </td>
                  </tr>


                  <!-- BRAND MESSAGE -->
                  <tr>
                    <td
                      style="
                        padding:18px 30px 30px 30px;
                      "
                    >

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                        style="
                          width:100%;
                          background-color:#eef9f2;
                          border-radius:10px;
                        "
                      >
                        <tr>

                          <td
                            style="
                              padding:22px 24px;
                            "
                          >

                            <p
                              style="
                                margin:0 0 5px 0;
                                font-size:15px;
                                line-height:22px;
                                font-weight:700;
                                color:#166534;
                              "
                            >
                              Building a cleaner, brighter future together.
                            </p>

                            <p
                              style="
                                margin:0;
                                font-size:14px;
                                line-height:21px;
                                color:#64748b;
                              "
                            >
                              This message was submitted through the
                              Green Lunar Nigeria Limited website.
                            </p>

                          </td>

                        </tr>
                      </table>

                    </td>
                  </tr>


                  <!-- FOOTER -->
                  <tr>
                    <td
                      style="
                        padding:30px 40px;
                        background-color:#073f30;
                        color:#ffffff;
                      "
                    >

                      <table
                        role="presentation"
                        width="100%"
                        cellspacing="0"
                        cellpadding="0"
                        border="0"
                      >

                        <tr>

                          <!-- LEFT FOOTER -->
                          <td
                            valign="top"
                            width="50%"
                            style="
                              padding-bottom:22px;
                            "
                          >

                            <img
                              src="${logoUrl}"
                              alt="Green Lunar Nigeria Limited"
                              width="150"
                              style="
                                display:block;
                                width:150px;
                                max-width:100%;
                                height:auto;
                                border:0;
                                margin-bottom:15px;
                              "
                            />

                            <p
                              style="
                                margin:0;
                                font-size:12px;
                                line-height:20px;
                                color:#d1fae5;
                              "
                            >
                              Technology • Construction • Renewable Energy
                            </p>

                          </td>


                          <!-- RIGHT FOOTER -->
                          <td
                            align="right"
                            valign="top"
                            width="50%"
                            style="
                              padding-bottom:22px;
                              font-size:12px;
                              line-height:21px;
                              color:#e2e8f0;
                            "
                          >

                            11 Tairu Olugbani Street,<br />
                            Oregun, Ikeja,<br />
                            Lagos, Nigeria

                            <br /><br />

                            <a
                              href="mailto:info@greenlunar.com"
                              style="
                                color:#ffffff;
                                text-decoration:none;
                              "
                            >
                              info@greenlunar.com
                            </a>

                            <br />

                            <a
                              href="tel:+2347074894559"
                              style="
                                color:#ffffff;
                                text-decoration:none;
                              "
                            >
                              +234 707 489 4559
                            </a>

                          </td>

                        </tr>


                        <!-- DIVIDER -->
                        <tr>
                          <td colspan="2">

                            <div
                              style="
                                height:1px;
                                background-color:rgba(255,255,255,0.20);
                                margin-bottom:18px;
                              "
                            ></div>

                          </td>
                        </tr>


                        <!-- COPYRIGHT -->
                        <tr>

                          <td
                            valign="middle"
                            style="
                              font-size:11px;
                              line-height:18px;
                              color:#cbd5e1;
                            "
                          >
                            © ${currentYear} Green Lunar Nigeria Limited.
                            All rights reserved.
                          </td>

                          <td
                            align="right"
                            valign="middle"
                            style="
                              font-size:11px;
                              line-height:18px;
                              color:#cbd5e1;
                            "
                          >
                            Cleaner Energy • Smarter Technology • Better Communities
                          </td>

                        </tr>

                      </table>

                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>

        </body>
        </html>
              `,
            });

    if (error) {
      console.error("Resend API Error:", error);

      return NextResponse.json(
        {
          message: error.message || "Unable to send message.",
        },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);

    return NextResponse.json(
      {
        message: "Message sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      {
        message: "Unable to send message. Please try again.",
      },
      { status: 500 }
    );
  }
}