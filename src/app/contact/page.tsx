

"use client";

import { FormEvent, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  subject: "",
  message: "",
});

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;

  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   setErrors((prev) => ({
  //     ...prev,
  //     [name]: "",
  //   }));
  // };


const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  let error = "";

  // First Name
  if (name === "firstName") {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (value && !nameRegex.test(value)) {
      error = "First name must contain letters only.";
    }
  }

  // Last Name
  if (name === "lastName") {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

    if (value && !nameRegex.test(value)) {
      error = "Last name must contain letters only.";
    }
  }

  // Email
  if (name === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (value && !emailRegex.test(value)) {
      error = "Please enter a valid email address.";
    }
  }

  // Location
  if (name === "location") {
    if (!value) {
      error = "Please select your location.";
    }
  }

  // Subject
  if (name === "subject") {
    if (value && value.trim().length < 3) {
      error = "Subject must be at least 3 characters.";
    }
  }

  // Message
  if (name === "message") {
    if (value && value.trim().length < 10) {
      error = "Message must be at least 10 characters.";
    }
  }

  setErrors((prev) => ({
    ...prev,
    [name]: error,
  }));
};

  const validateForm = () => {

  const newErrors = {
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    subject: "",
    message: "",
  };

  let isValid = true;

  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required.";
    isValid = false;
  } else if (!nameRegex.test(formData.firstName.trim())) {
    newErrors.firstName = "First name must contain letters only.";
    isValid = false;
  } else if (formData.firstName.trim().length < 2) {
    newErrors.firstName = "First name must be at least 2 characters.";
    isValid = false;
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required.";
    isValid = false;
  } else if (!nameRegex.test(formData.lastName.trim())) {
    newErrors.lastName = "Last name must contain letters only.";
    isValid = false;
  } else if (formData.lastName.trim().length < 2) {
    newErrors.lastName = "Last name must be at least 2 characters.";
    isValid = false;
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email address is required.";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }
  }

  if (!formData.location) {
    newErrors.location = "Please select your location.";
    isValid = false;
  }

  if (!formData.subject.trim()) {
    newErrors.subject = "Subject is required.";
    isValid = false;
  } else if (formData.subject.trim().length < 3) {
    newErrors.subject = "Subject must be at least 3 characters.";
    isValid = false;
  }

  if (!formData.message.trim()) {
    newErrors.message = "Message is required.";
    isValid = false;
  } else if (formData.message.trim().length < 10) {
    newErrors.message = "Message must be at least 10 characters.";
    isValid = false;
  }

  setErrors(newErrors);

  return isValid;
};

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   setLoading(true);
  //   setStatus("");

  //   try {
  //     const response = await fetch("/api/contact", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.message || "Unable to send message");
  //     }

  //     setStatus("Message sent successfully.");

  //     setFormData({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       location: "",
  //       subject: "",
  //       message: "",
  //     });
  //   } catch (error) {
  //     console.error("Contact form error:", error);

  //     if (error instanceof Error) {
  //       setStatus(error.message);
  //     } else {
  //       setStatus("Something went wrong. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const isValid = validateForm();

  if (!isValid) {
    setStatus("Please correct the highlighted fields.");
    return;
  }

  setLoading(true);
  setStatus("");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to send message");
    }

    setStatus("Message sent successfully.");

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      subject: "",
      message: "",
    });

    setErrors({
      firstName: "",
      lastName: "",
      email: "",
      location: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof Error) {
      setStatus(error.message);
    } else {
      setStatus("Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Contact Hero */}

        <section className="relative min-h-[520px] overflow-hidden bg-[#063d2b] sm:min-h-[560px] lg:min-h-[600px]">

            {/* Hero Image */}
            <div className="absolute inset-0">
                <img
                src="https://res.cloudinary.com/diobpauw/image/upload/v1789311018/pawel-czerwinski--0xCCPIbl3M-unsplash.jpg"
                alt="GreenLunar Technologies"
                className="h-full w-full object-cover object-center"
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Green Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#063d2b]/90 via-[#063d2b]/55 to-transparent" />

            {/* Hero Content */}
            <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 sm:min-h-[560px] sm:px-8 sm:pb-20 lg:min-h-[600px] lg:px-10 lg:pb-24">

                <div className="max-w-4xl">

                {/* Heading */}

                <h1 className="mt-6 text-5xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-8xl">
                    Let&apos;s start a
                    <span className="block text-green-400">
                        conversation.
                    </span>
                 </h1>

                {/* Description */}

                <p className="mt-8 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
                    Have a project, idea, or business challenge? Tell us what
                    you&apos;re working on and let&apos;s explore how GreenLunar
                    can help move it forward.
                </p>

                </div>
            </div>
        </section>
      {/* Contact Section */}
      <section className="px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">

          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">

            {/* Contact Information */}
            <div>

              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Get In Touch
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                We&apos;d love to
                <span className="block text-green-600">
                  hear from you.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-8 text-gray-600">
                Whether you&apos;re looking for a technology partner,
                planning a project, or simply want to learn more about
                GreenLunar, our team is ready to listen.
              </p>

              {/* Contact Details */}
              <div className="mt-10 space-y-7">

                {/* Phone */}
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M22 16.92v3a2 2 0 0 1-2.18 2
                        19.79 19.79 0 0 1-8.63-3.07
                        19.5 19.5 0 0 1-6-6
                        19.79 19.79 0 0 1-3.07-8.67
                        A2 2 0 0 1 4.11 2h3
                        a2 2 0 0 1 2 1.72
                        12.84 12.84 0 0 0 .7 2.81
                        2 2 0 0 1-.45 2.11L8.09 9.91
                        a16 16 0 0 0 6 6l1.27-1.27
                        a2 2 0 0 1 2.11-.45
                        12.84 12.84 0 0 0 2.81.7
                        A2 2 0 0 1 22 16.92z"
                      />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 text-base font-medium text-gray-900">
                      +234 707 489 4559
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <rect
                        width="20"
                        height="16"
                        x="2"
                        y="4"
                        rx="2"
                      />
                      <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 text-base font-medium text-gray-900">
                      info@greenlunar.com
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Business Hour
                    </p>

                    <p className="mt-1 max-w-xs text-base font-medium leading-7 text-gray-900">
                      Mon - Fri 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="h-5 w-5"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Office
                    </p>

                    <p className="mt-1 max-w-xs text-base font-medium leading-7 text-gray-900">
                      Lagos, Nigeria
                    </p>
                  </div>
                </div> */}

              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl bg-[#f7faf8] p-7 sm:p-10 lg:p-12">

            <div className="mb-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
                Send Us A Message
                </p>

                <h3 className="mt-4 text-3xl font-medium tracking-tight text-gray-900">
                Tell us about your project.
                </h3>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>

                {/* First Name + Last Name */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                {/* First Name */}
                <div>
                    <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                    >
                    First Name
                    </label>

                   <input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        type="text"
                        placeholder="Your first name"
                        className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                          errors.firstName
                            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                        }`}
                      />

                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.firstName}
                        </p>
                      )}
                </div>

                {/* Last Name */}
                <div>
                    <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                    >
                    Last Name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      type="text"
                      placeholder="Your first name"
                      className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                        errors.firstName
                          ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                          : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                      }`}
                    />

                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                </div>

                </div>

                {/* Email */}
                <div>
                <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Email Address
                </label>

                <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your first name"
                    className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    }`}
                  />

                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                {/* Location */}
                <div>
                <label
                    htmlFor="location"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Your Location
                </label>

                <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                      errors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    }`}
                >
                  {errors.location && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.location}
                  </p>
                )}
                    <option value="" disabled>
                    Select your state
                    </option>

                    <option value="Abia">Abia</option>
                    <option value="Adamawa">Adamawa</option>
                    <option value="Akwa Ibom">Akwa Ibom</option>
                    <option value="Anambra">Anambra</option>
                    <option value="Bauchi">Bauchi</option>
                    <option value="Bayelsa">Bayelsa</option>
                    <option value="Benue">Benue</option>
                    <option value="Borno">Borno</option>
                    <option value="Cross River">Cross River</option>
                    <option value="Delta">Delta</option>
                    <option value="Ebonyi">Ebonyi</option>
                    <option value="Edo">Edo</option>
                    <option value="Ekiti">Ekiti</option>
                    <option value="Enugu">Enugu</option>
                    <option value="Gombe">Gombe</option>
                    <option value="Imo">Imo</option>
                    <option value="Jigawa">Jigawa</option>
                    <option value="Kaduna">Kaduna</option>
                    <option value="Kano">Kano</option>
                    <option value="Katsina">Katsina</option>
                    <option value="Kebbi">Kebbi</option>
                    <option value="Kogi">Kogi</option>
                    <option value="Kwara">Kwara</option>
                    <option value="Lagos">Lagos</option>
                    <option value="Nasarawa">Nasarawa</option>
                    <option value="Niger">Niger</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Ondo">Ondo</option>
                    <option value="Osun">Osun</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Plateau">Plateau</option>
                    <option value="Rivers">Rivers</option>
                    <option value="Sokoto">Sokoto</option>
                    <option value="Taraba">Taraba</option>
                    <option value="Yobe">Yobe</option>
                    <option value="Zamfara">Zamfara</option>
                    <option value="Federal Capital Territory">FCT - Abuja</option>
                </select>
                </div>

                {/* Subject */}
                <div>
                <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Subject
                </label>

                <input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    type="text"
                    placeholder="Your first name"
                    className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                      errors.subject
                        ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
                    }`}
                  />

                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div>
                <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Message
                </label>

                <textarea                            
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                aria-required                    
                rows={6}
                placeholder="Tell us about your project..."
                className={`w-full rounded-md border bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition ${
                  errors.firstName
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/10"
             }`}
                />

                {errors.message && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.message}
                  </p>
                )}     
            
                </div>

                {/* Submit */}
                <button
                type="submit"
                disabled = {loading}
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-8 py-4 text-sm font-medium text-white shadow-[0_10px_30px_rgba(22,163,74,0.20)] transition-all duration-300 hover:bg-green-700 hover:shadow-[0_14px_35px_rgba(22,163,74,0.28)]"
                >
                
                {loading ? "Sending..." : "Send Message"}

                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="ml-2 h-4 w-4"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 6l6 6-6 6"
                    />
                </svg>
                </button>
                {status && (
                  <p className="mt-4 text-sm text-gray-700">
                    {status}
                  </p>
                )}

            </form>
            </div>

          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-[#f7faf8] px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-600">
                Our Location
              </p>

              <h2 className="mt-5 text-4xl font-medium tracking-tight text-gray-900 sm:text-5xl">
                Find us in
                <span className="text-green-600"> Nigeria.</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-8 text-gray-600">
                GreenLunar is building solutions from Nigeria with a
                growing vision for businesses and communities across
                Africa and beyond.
              </p>

              <div className="mt-8">
                <p className="text-sm text-gray-500">
                  Why don't you
                </p>

                <p className="mt-2 text-lg font-medium text-gray-900">
                 Visit Us at HQ Today?
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
  

        {/* Office Location */}
        <div className="mt-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-green-600">
                Our Office
            </p>
            <div className="mt-5 overflow-hidden rounded-xl bg-[#063d2b] p-6 sm:p-8">

                {/* Nigeria Map */}
                <div className="relative mx-auto w-full max-w-[420px]">
                <img
                    src="https://res.cloudinary.com/diobpauw/image/upload/v1789023148/nigeria.svg"
                    alt="Map of Nigeria showing GreenLunar Lagos office location"
                    className="mx-auto h-auto w-full"
                    style={{
                    filter:
                    "brightness(0) saturate(100%) invert(82%) sepia(19%) saturate(563%) hue-rotate(92deg) brightness(101%) contrast(90%)",
                }}
                />
                {/* Lagos Location Marker */}
                <div className="absolute left-[10%] top-[75%]">
                    {/* Pulsing marker */}
                    <div className="relative flex h-7 w-7 items-center justify-center">
                    <span className="absolute h-7 w-7 animate-ping rounded-full bg-green-400/40" />
                    <span className="relative h-4 w-4 rounded-full bg-green-400 ring-4 ring-white/20" />
                    </div>
                    {/* Lagos Label */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-lg">
                    Lagos
                    </div>
                </div>
                </div>

                {/* Location Details */}
                <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-start gap-4">

                    {/* Location Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <path
                        d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"
                        />

                        <circle
                        cx="12"
                        cy="10"
                        r="2.5"
                        />
                    </svg>
                    </div>
                    {/* Address */}
                    <div>
                    <p className="text-sm font-medium text-green-400">
                        Lagos Office
                    </p>
                    <p className="mt-1 max-w-sm text-sm leading-6 text-white/70">
                        11 Tairu Olugbani Street,
                        Oregun, Ikeja,
                        Lagos, Nigeria
                    </p>

                    </div>
                </div>
                </div>
            </div>
         </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl">

          <div className="rounded-xl bg-[#063d2b] px-8 py-16 text-center sm:px-12 lg:px-20 lg:py-24">

            <p className="text-sm font-medium uppercase tracking-[0.25em] text-green-400">
              Start Something Great
            </p>

            <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-medium leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Let&apos;s build what&apos;s next.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/60">
              Tell us about your challenge, project, or idea and let&apos;s
              explore what we can build together.
            </p>

          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
