"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  CheckCircle2,
  Mail,
  Loader2,
  RotateCcw,
} from "lucide-react";

import { updateEnquiryStatus } from "@/app/admin/(dashboard)/enquiries/actions";

type EnquiryActionsProps = {
  enquiryId: string;
  email: string;
  subject: string;
  status: "new" | "read" | "replied" | "archived";
};

export default function EnquiryActions({
  enquiryId,
  email,
  subject,
  status,
}: EnquiryActionsProps) {
  const router = useRouter();

const [loadingAction, setLoadingAction] = useState<
  "read" | "replied" | "archived" | null
>(null);

  const handleStatusChange = async (
    newStatus: "read" | "replied" | "archived"
  ) => {
    try {
      setLoadingAction(newStatus);

      await updateEnquiryStatus(enquiryId, newStatus);

      router.refresh();
    } catch (error) {
      console.error("Unable to update enquiry:", error);
      alert("Unable to update enquiry. Please try again.");
    } finally {
      setLoadingAction(null);
    }
  };

  const replyUrl = `mailto:${email}?subject=${encodeURIComponent(
    `Re: ${subject}`
  )}`;


  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* REPLY */}
      <a
        href={replyUrl}
        className="
          inline-flex items-center gap-2
          rounded-lg bg-[#073f30]
          px-4 py-2.5
          text-sm font-medium text-white
          transition
          hover:bg-[#09543f]
        "
      >
        <Mail size={17} />
        Reply by Email
      </a>

      {/* MARK REPLIED */}
      {status !== "replied" && status !== "archived" && (
        <button
          type="button"
          disabled={loadingAction !== null}
          onClick={() => handleStatusChange("replied")}
          className="
            inline-flex items-center gap-2
            rounded-lg border border-gray-200
            bg-white px-4 py-2.5
            text-sm font-medium text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {loadingAction === "replied" ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <CheckCircle2 size={17} />
          )}

          Mark as Replied
        </button>
      )}

      {/* ARCHIVE */}
      {status === "archived" && (
        <button
            type="button"
            disabled={loadingAction !== null}
            onClick={() => handleStatusChange("read")}
            className="
            inline-flex items-center gap-2
            rounded-lg border border-gray-200
            bg-white px-4 py-2.5
            text-sm font-medium text-gray-700
            transition
            hover:bg-gray-50
            disabled:cursor-not-allowed
            disabled:opacity-50
            "
        >
            <RotateCcw size={17} />
            Restore
        </button>
        )}

      {/* ARCHIVED STATUS */}
      {status === "archived" && (
        <span
          className="
            inline-flex items-center gap-2
            rounded-lg bg-gray-100
            px-4 py-2.5
            text-sm font-medium text-gray-600
          "
        >
          <Archive size={17} />
          Archived
        </span>
      )}
    </div>
  );
}