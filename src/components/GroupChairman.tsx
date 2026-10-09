type GroupChairmanProps = {
  imageUrl?: string | null;
  imageAlt?: string | null;
  label?: string | null;
  position?: string | null;
  name?: string | null;
  description?: string | null;

  /*
   * Allows us to slightly adjust spacing depending
   * on where the component is being used.
   */
  className?: string;
};


export default function GroupChairman({
  imageUrl,
  imageAlt,
  label,
  position,
  name,
  description,
  className = "",
}: GroupChairmanProps) {
  /*
   * If there is no meaningful Chairman content,
   * don't render an empty section.
   */
  if (
    !imageUrl &&
    !name &&
    !position &&
    !description
  ) {
    return null;
  }


  return (
    <section
      className={`w-full bg-[#ecfdf5] ${className}`}
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">

        <div
          className="
            grid
            grid-cols-1
            items-center
            gap-10
            py-10
            lg:grid-cols-[380px_1fr]
            lg:gap-20
            lg:py-12
            xl:gap-28
          "
        >

          {/* =============================================
              CHAIRMAN IMAGE
          ============================================== */}

          <div className="flex justify-center lg:justify-start">

            <div
              className="
                relative
                min-h-[360px]
                w-full
                max-w-[360px]
                overflow-hidden
                lg:min-h-[420px]
              "
            >

              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={
                    imageAlt ||
                    name ||
                    "Group Chairman"
                  }
                  className="
                    h-full
                    w-full
                    object-cover
                    object-top
                    transition-transform
                    duration-700
                    ease-out
                    hover:scale-[1.03]
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    min-h-[360px]
                    w-full
                    items-center
                    justify-center
                    bg-green-100
                    lg:min-h-[420px]
                  "
                >
                  <ChairmanPlaceholderIcon />
                </div>
              )}


              {/* IMAGE OVERLAY */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/10
                  via-transparent
                  to-transparent
                "
              />

            </div>

          </div>


          {/* =============================================
              CHAIRMAN INFORMATION
          ============================================== */}

          <div className="flex items-center">

            <div className="max-w-lg">

              {/* LABEL */}

              {label && (
                <div className="flex items-center gap-3">

                  <span className="h-[2px] w-8 bg-green-600" />


                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-green-600
                    "
                  >
                    {label}
                  </p>

                </div>
              )}


              {/* POSITION */}

              {position && (
                <p
                  className="
                    mt-4
                    text-base
                    font-medium
                    tracking-wide
                    text-gray-700
                  "
                >
                  {position}
                </p>
              )}


              {/* NAME */}

              {name && (
                <h3
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-[#063d2b]
                    sm:text-4xl
                    lg:text-[42px]
                    lg:leading-[1.1]
                  "
                >
                  {name}
                </h3>
              )}


              {/* DIVIDER */}

              <div className="mt-4 h-[2px] w-14 bg-green-600" />


              {/* DESCRIPTION */}

              {description && (
                <p
                  className="
                    mt-5
                    text-sm
                    leading-7
                    text-gray-600
                    sm:text-[15px]
                  "
                >
                  {description}
                </p>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}


/* =========================================================
   PLACEHOLDER ICON
========================================================= */

function ChairmanPlaceholderIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="h-14 w-14 text-green-700/30"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 21a8 8 0 0 1 16 0"
      />
    </svg>
  );
}