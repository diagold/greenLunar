"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export default function BackButton({
  fallback = "/",
  label = "Back",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 12H5M12 19l-7-7 7-7"
        />
      </svg>

      <span>{label}</span>
    </button>
  );
}