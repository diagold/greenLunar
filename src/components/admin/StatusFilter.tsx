"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";


const statuses = [
  {
    value: "all",
    label: "All statuses",
    dot: "bg-gray-400",
  },
  {
    value: "new",
    label: "New enquiries",
    dot: "bg-blue-500",
  },
  {
    value: "read",
    label: "Read",
    dot: "bg-amber-500",
  },
  {
    value: "replied",
    label: "Replied",
    dot: "bg-green-600",
  },
  {
    value: "archived",
    label: "Archived",
    dot: "bg-gray-500",
  },
];

type StatusCounts = {
  all: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
};

type StatusFilterProps = {
  value: string;
  counts: StatusCounts;
};

export default function StatusFilter({
  value,
  counts,
}: StatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedStatus =
    statuses.find((item) => item.value === value) ??
    statuses[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleSelect = (status: string) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }

    // Always return to page 1 after filtering
    params.delete("page");

    const query = params.toString();

    router.push(
      query ? `${pathname}?${query}` : pathname
    );

    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative min-w-[210px]"
    >
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          flex w-full items-center justify-between
          gap-4 rounded-xl
          border bg-white
          px-4 py-2.5
          text-sm font-medium
          shadow-sm
          outline-none
          transition-all duration-200

          ${
            open
              ? "border-[#073f30] ring-4 ring-green-100"
              : "border-gray-200 hover:border-gray-300"
          }
        `}
      >
        <span className="flex items-center gap-3">
          <span
            className={`
              h-2.5 w-2.5
              rounded-full
              ${selectedStatus.dot}
            `}
          />

          <span className="text-gray-700">
            {selectedStatus.label}
          </span>
        </span>

        <div className="ml-auto flex items-center gap-2">
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-500">
            {
            counts[
                selectedStatus.value as keyof StatusCounts
            ]
            }
        </span>

        <ChevronDown
            size={17}
            className={`
            text-gray-400
            transition-transform duration-200
            ${open ? "rotate-180" : ""}
            `}
        />
        </div>
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          role="listbox"
          className="
            absolute right-0 top-full z-50
            mt-2 w-full
            overflow-hidden
            rounded-2xl
            border border-gray-100
            bg-white
            p-1.5
            shadow-xl
            shadow-gray-200/70
          "
        >
          <div className="px-3 pb-2 pt-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Filter by status
            </p>
          </div>

          <div className="space-y-1">
            {statuses.map((item) => {
              const selected =
                selectedStatus.value === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() =>
                    handleSelect(item.value)
                  }
                  className={`
                    flex w-full items-center
                    justify-between
                    rounded-xl
                    px-3 py-2.5
                    text-left text-sm
                    transition-colors

                    ${
                      selected
                        ? "bg-green-50 text-[#073f30]"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`
                        h-2.5 w-2.5
                        rounded-full
                        ${item.dot}
                      `}
                    />

                    <span
                      className={
                        selected
                          ? "font-semibold"
                          : "font-medium"
                      }
                    >
                      {item.label}
                    </span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                        className={`
                        flex min-w-7 items-center justify-center
                        rounded-full px-2 py-0.5
                        text-[11px] font-semibold
                        ${
                            selected
                            ? "bg-white text-[#073f30]"
                            : "bg-gray-100 text-gray-500"
                        }
                        `}
                    >
                        {counts[item.value as keyof StatusCounts]}
                    </span>

                    {selected && (
                        <Check
                        size={16}
                        strokeWidth={2.5}
                        className="text-[#073f30]"
                        />
                    )}
                    </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}