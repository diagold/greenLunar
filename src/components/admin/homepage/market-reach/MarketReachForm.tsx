"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import {
  createMarketReachLocation,
  deleteMarketReachLocation,
  reorderMarketReachLocations,
  toggleMarketReachLocation,
  updateMarketReachLocation,
  updateMarketReachSettings,
} from "@/app/admin/(dashboard)/homepage/market-reach/actions";

import MarketReachImageUpload from "./MarketReachImageUpload";

/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;
  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;
  map_image_url: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Location = {
  id: string;
  section_id: string;
  name: string;
  address: string | null;
  link_url: string | null;
  link_label: string | null;
  marker_left: number | string | null;
  marker_top: number | string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  settings: Settings;
  locations: Location[];
};

type LocationForm = {
  name: string;
  address: string;
  linkUrl: string;
  linkLabel: string;
  markerLeft: number;
  markerTop: number;
  isActive: boolean;
};

const emptyLocation: LocationForm = {
  name: "",
  address: "",
  linkUrl: "",
  linkLabel: "Learn More",
  markerLeft: 50,
  markerTop: 50,
  isActive: true,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MarketReachForm({
  settings,
  locations,
}: Props) {
  /* =======================================================
     SECTION SETTINGS
  ======================================================= */

  const [eyebrow, setEyebrow] =
    useState(settings.eyebrow ?? "");

  const [heading, setHeading] =
    useState(settings.heading ?? "");

  const [highlight, setHighlight] =
    useState(settings.highlight ?? "");

  const [description, setDescription] =
    useState(settings.description ?? "");

  const [mapImageUrl, setMapImageUrl] =
    useState(settings.map_image_url ?? "");

  const [sectionActive, setSectionActive] =
    useState(settings.is_active);

  /* =======================================================
     LOCATIONS
  ======================================================= */

  const [
    displayLocations,
    setDisplayLocations,
  ] = useState<Location[]>(
    [...locations].sort(
      (a, b) =>
        a.sort_order - b.sort_order
    )
  );

  const [
    editingLocationId,
    setEditingLocationId,
  ] = useState<string | null>(null);

  const [
    showNewLocation,
    setShowNewLocation,
  ] = useState(false);

  const [
    locationForm,
    setLocationForm,
  ] = useState<LocationForm>({
    ...emptyLocation,
  });

  /* =======================================================
     DELETE CONFIRMATION
  ======================================================= */

  const [
    deletingLocation,
    setDeletingLocation,
  ] = useState<Location | null>(null);

  /* =======================================================
     MESSAGES
  ======================================================= */

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isPending, startTransition] =
    useTransition();

  /* =======================================================
     HELPERS
  ======================================================= */

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  function resetLocationEditor() {
    setEditingLocationId(null);
    setShowNewLocation(false);

    setLocationForm({
      ...emptyLocation,
    });
  }

  function openNewLocation() {
    clearMessages();

    setEditingLocationId(null);
    setDeletingLocation(null);

    setLocationForm({
      ...emptyLocation,
    });

    setShowNewLocation(true);
  }

  function openEditLocation(
    location: Location
  ) {
    clearMessages();

    setDeletingLocation(null);
    setShowNewLocation(false);

    setEditingLocationId(
      location.id
    );

    setLocationForm({
      name: location.name,

      address:
        location.address ?? "",

      linkUrl:
        location.link_url ?? "",

      linkLabel:
        location.link_label ??
        "Learn More",

      markerLeft:
        Number(
          location.marker_left ?? 50
        ),

      markerTop:
        Number(
          location.marker_top ?? 50
        ),

      isActive:
        location.is_active,
    });
  }

  function openDeleteConfirmation(
    location: Location
  ) {
    clearMessages();

    setDeletingLocation(location);
  }

  function closeDeleteConfirmation() {
    if (isPending) return;

    setDeletingLocation(null);
  }

  /* =======================================================
     VALIDATE MARKER
  ======================================================= */

  function markerIsValid() {
    return (
      Number.isFinite(
        locationForm.markerLeft
      ) &&
      Number.isFinite(
        locationForm.markerTop
      ) &&
      locationForm.markerLeft >= 0 &&
      locationForm.markerLeft <= 100 &&
      locationForm.markerTop >= 0 &&
      locationForm.markerTop <= 100
    );
  }

  /* =======================================================
     SAVE SECTION
  ======================================================= */

  function saveSection() {
    clearMessages();

    if (!heading.trim()) {
      setErrorMessage(
        "Section heading is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateMarketReachSettings(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,
            description,
            mapImageUrl,
            isActive:
              sectionActive,
          }
        );

        setSuccessMessage(
          "Market Reach section updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update Market Reach."
        );
      }
    });
  }

  /* =======================================================
     CREATE LOCATION
  ======================================================= */

  function createLocation() {
    clearMessages();

    if (!locationForm.name.trim()) {
      setErrorMessage(
        "Location name is required."
      );

      return;
    }

    if (!markerIsValid()) {
      setErrorMessage(
        "Map marker positions must be between 0 and 100."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createMarketReachLocation({
            sectionId:
              settings.id,

            name:
              locationForm.name,

            address:
              locationForm.address,

            linkUrl:
              locationForm.linkUrl,

            linkLabel:
              locationForm.linkLabel,

            markerLeft:
              locationForm.markerLeft,

            markerTop:
              locationForm.markerTop,

            sortOrder:
              displayLocations.length +
              1,

            isActive:
              locationForm.isActive,
          });

        if (result.location) {
          setDisplayLocations(
            (current) => [
              ...current,
              result.location as Location,
            ]
          );
        }

        const locationName =
          locationForm.name.trim();

        resetLocationEditor();

        setSuccessMessage(
          `"${locationName}" was added successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to create location."
        );
      }
    });
  }

  /* =======================================================
     UPDATE LOCATION
  ======================================================= */

  function saveLocation(
    location: Location
  ) {
    clearMessages();

    if (!locationForm.name.trim()) {
      setErrorMessage(
        "Location name is required."
      );

      return;
    }

    if (!markerIsValid()) {
      setErrorMessage(
        "Map marker positions must be between 0 and 100."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateMarketReachLocation(
          location.id,
          {
            sectionId:
              settings.id,

            name:
              locationForm.name,

            address:
              locationForm.address,

            linkUrl:
              locationForm.linkUrl,

            linkLabel:
              locationForm.linkLabel,

            markerLeft:
              locationForm.markerLeft,

            markerTop:
              locationForm.markerTop,

            sortOrder:
              location.sort_order,

            isActive:
              locationForm.isActive,
          }
        );

        const updatedName =
          locationForm.name.trim();

        setDisplayLocations(
          (current) =>
            current.map((item) =>
              item.id === location.id
                ? {
                    ...item,

                    name:
                      updatedName,

                    address:
                      locationForm.address.trim() ||
                      null,

                    link_url:
                      locationForm.linkUrl.trim() ||
                      null,

                    link_label:
                      locationForm.linkLabel.trim() ||
                      "Learn More",

                    marker_left:
                      locationForm.markerLeft,

                    marker_top:
                      locationForm.markerTop,

                    is_active:
                      locationForm.isActive,
                  }
                : item
            )
        );

        resetLocationEditor();

        setSuccessMessage(
          `"${updatedName}" was updated successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update location."
        );
      }
    });
  }

  /* =======================================================
     TOGGLE LOCATION
  ======================================================= */

  function toggleLocation(
    location: Location
  ) {
    clearMessages();

    const nextValue =
      !location.is_active;

    startTransition(async () => {
      try {
        await toggleMarketReachLocation(
          location.id,
          nextValue
        );

        setDisplayLocations(
          (current) =>
            current.map((item) =>
              item.id === location.id
                ? {
                    ...item,
                    is_active:
                      nextValue,
                  }
                : item
            )
        );

        setSuccessMessage(
          nextValue
            ? `"${location.name}" is now visible.`
            : `"${location.name}" is now hidden.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to change visibility."
        );
      }
    });
  }

  /* =======================================================
     DELETE LOCATION
  ======================================================= */

  function deleteLocation(
    location: Location
  ) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteMarketReachLocation(
          location.id
        );

        const remaining =
          displayLocations.filter(
            (item) =>
              item.id !==
              location.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,
              sort_order:
                index + 1,
            })
          );

        setDisplayLocations(
          normalized
        );

        if (
          normalized.length > 0
        ) {
          await reorderMarketReachLocations(
            normalized.map(
              (item) => item.id
            )
          );
        }

        if (
          editingLocationId ===
          location.id
        ) {
          resetLocationEditor();
        }

        setDeletingLocation(null);

        setSuccessMessage(
          `"${location.name}" was deleted successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete location."
        );
      }
    });
  }

  /* =======================================================
     REORDER
  ======================================================= */

  function moveLocation(
    index: number,
    direction: "up" | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >=
        displayLocations.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...displayLocations,
    ];

    const reordered = [
      ...displayLocations,
    ];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    const normalized =
      reordered.map(
        (item, itemIndex) => ({
          ...item,
          sort_order:
            itemIndex + 1,
        })
      );

    setDisplayLocations(
      normalized
    );

    startTransition(async () => {
      try {
        await reorderMarketReachLocations(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccessMessage(
          "Location order updated successfully."
        );
      } catch (error) {
        setDisplayLocations(
          previous
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder locations."
        );
      }
    });
  }

  /* =======================================================
     LOCATION EDITOR
  ======================================================= */

  function renderLocationEditor(
    mode: "create" | "edit",
    location?: Location
  ) {
    return (
      <div className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-6 lg:px-8">

        {/* EDITOR HEADER */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              {mode === "create"
                ? "Add Location"
                : `Edit ${location?.name}`}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Configure the location
              card and its position on
              the Nigeria map.
            </p>
          </div>

          <button
            type="button"
            onClick={
              resetLocationEditor
            }
            disabled={isPending}
            className="
              rounded-lg
              border
              border-gray-200
              bg-white
              p-2
              text-gray-500
              transition
              hover:bg-gray-50
              hover:text-gray-900
              disabled:opacity-50
            "
            aria-label="Close editor"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-6">

          {/* NAME + ADDRESS */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Location Name
              </label>

              <input
                value={
                  locationForm.name
                }
                onChange={(event) =>
                  setLocationForm(
                    (current) => ({
                      ...current,
                      name:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder="Lagos"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                value={
                  locationForm.address
                }
                onChange={(event) =>
                  setLocationForm(
                    (current) => ({
                      ...current,
                      address:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder="Lagos State, Nigeria"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>
          </div>

          {/* LINK SETTINGS */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Destination URL
              </label>

              <input
                value={
                  locationForm.linkUrl
                }
                onChange={(event) =>
                  setLocationForm(
                    (current) => ({
                      ...current,
                      linkUrl:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder="/contact"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />

              <p className="mt-2 text-xs text-gray-400">
                Example: /contact
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Link Label
              </label>

              <input
                value={
                  locationForm.linkLabel
                }
                onChange={(event) =>
                  setLocationForm(
                    (current) => ({
                      ...current,
                      linkLabel:
                        event.target
                          .value,
                    })
                  )
                }
                placeholder="Learn More"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>
          </div>

          {/* =================================================
              MAP MARKER POSITION
          ================================================== */}

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-5">
              <h4 className="font-medium text-gray-800">
                Map Marker Position
              </h4>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Set the marker position
                as a percentage from the
                top-left corner of the
                Nigeria map.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">

              {/* HORIZONTAL */}

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Horizontal Position
                  (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={
                    locationForm.markerLeft
                  }
                  onChange={(event) =>
                    setLocationForm(
                      (current) => ({
                        ...current,

                        markerLeft:
                          Number(
                            event.target
                              .value
                          ),
                      })
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />
              </div>

              {/* VERTICAL */}

              <div>
                <label className="mb-2 block text-sm text-gray-600">
                  Vertical Position (%)
                </label>

                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={
                    locationForm.markerTop
                  }
                  onChange={(event) =>
                    setLocationForm(
                      (current) => ({
                        ...current,

                        markerTop:
                          Number(
                            event.target
                              .value
                          ),
                      })
                    )
                  }
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />
              </div>
            </div>

            {/* SIMPLE MARKER PREVIEW */}

            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-700">
                  <MapPin size={18} />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700">
                    Current marker
                    coordinates
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {
                      locationForm.markerLeft
                    }
                    % left,{" "}
                    {
                      locationForm.markerTop
                    }
                    % top
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              VISIBILITY
          ================================================== */}

          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Visibility
            </p>

            <button
              type="button"
              onClick={() =>
                setLocationForm(
                  (current) => ({
                    ...current,

                    isActive:
                      !current.isActive,
                  })
                )
              }
              className={`
                inline-flex
                items-center
                gap-2
                rounded-lg
                px-4
                py-2.5
                text-sm
                font-medium
                transition

                ${
                  locationForm.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }
              `}
            >
              {locationForm.isActive ? (
                <Eye size={17} />
              ) : (
                <EyeOff size={17} />
              )}

              {locationForm.isActive
                ? "Visible"
                : "Hidden"}
            </button>
          </div>

          {/* =================================================
              EDITOR ACTIONS
          ================================================== */}

          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5">
            <button
              type="button"
              onClick={
                resetLocationEditor
              }
              disabled={isPending}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={() => {
                if (
                  mode === "create"
                ) {
                  createLocation();
                } else if (
                  location
                ) {
                  saveLocation(
                    location
                  );
                }
              }}
              className="
                inline-flex
                min-w-[150px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#073f30]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0a503d]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isPending ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />

                  {mode === "create"
                    ? "Add Location"
                    : "Save Changes"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* =====================================================
          STATUS MESSAGES
      ====================================================== */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={18} />

          <span>
            {successMessage}
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          DELETE CONFIRMATION MESSAGE
      ====================================================== */}

      {deletingLocation && (
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            {/* MESSAGE */}

            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-50
                  text-red-600
                "
              >
                <Trash2 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Delete{" "}
                  {deletingLocation.name}
                  ?
                </h3>

                <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                  Are you sure you want
                  to remove{" "}
                  <span className="font-medium text-gray-700">
                    {
                      deletingLocation.name
                    }
                  </span>{" "}
                  from the Market Reach
                  section? This action
                  cannot be undone.
                </p>
              </div>
            </div>

            {/* ACTIONS */}

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={
                  closeDeleteConfirmation
                }
                disabled={isPending}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  deleteLocation(
                    deletingLocation
                  )
                }
                disabled={isPending}
                className="
                  inline-flex
                  min-w-[125px]
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                    />

                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          SECTION SETTINGS
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the heading,
              description and Nigeria
              map displayed on the
              homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSectionActive(
                (value) => !value
              )
            }
            className={`
              inline-flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-sm
              font-medium
              transition

              ${
                sectionActive
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }
            `}
          >
            {sectionActive ? (
              <Eye size={17} />
            ) : (
              <EyeOff size={17} />
            )}

            {sectionActive
              ? "Section Visible"
              : "Section Hidden"}
          </button>
        </div>

        <div className="grid gap-6">

          {/* EYEBROW */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Eyebrow
            </label>

            <input
              value={eyebrow}
              onChange={(event) =>
                setEyebrow(
                  event.target.value
                )
              }
              placeholder="Locations"
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* HEADING */}

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Heading
              </label>

              <input
                value={heading}
                onChange={(event) =>
                  setHeading(
                    event.target.value
                  )
                }
                placeholder="Where we operate"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Highlight
              </label>

              <input
                value={highlight}
                onChange={(event) =>
                  setHighlight(
                    event.target.value
                  )
                }
                placeholder="across Nigeria"
                className="
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  py-3
                  text-sm
                  outline-none
                  transition
                  focus:border-green-500
                  focus:ring-2
                  focus:ring-green-100
                "
              />
            </div>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              rows={4}
              placeholder="Our technology solutions are designed to support businesses..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                leading-6
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            />
          </div>

          {/* =================================================
              MAP IMAGE
          ================================================== */}

          <div>
            <div className="mb-5">
              <h3 className="text-sm font-medium text-gray-700">
                Nigeria Map
              </h3>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                Upload a map image from
                your computer or use a
                Cloudinary / external
                image URL.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* UPLOAD */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Upload Map
                </label>

                <MarketReachImageUpload
                  value={mapImageUrl}
                  onChange={
                    setMapImageUrl
                  }
                />
              </div>

              {/* CLOUDINARY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Cloudinary / External
                  Image URL
                </label>

                <input
                  type="url"
                  value={mapImageUrl}
                  onChange={(event) =>
                    setMapImageUrl(
                      event.target
                        .value
                    )
                  }
                  placeholder="https://res.cloudinary.com/..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-100
                  "
                />

                <p className="mt-2 text-xs leading-5 text-gray-400">
                  You can continue using
                  the existing Cloudinary
                  SVG map or another
                  publicly accessible
                  image URL.
                </p>

                {mapImageUrl && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-gray-500">
                      Current Map URL
                    </p>

                    <div className="break-all rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs leading-5 text-gray-500">
                      {mapImageUrl}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SAVE SECTION */}

          <div className="flex justify-end border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={saveSection}
              disabled={isPending}
              className="
                inline-flex
                min-w-[170px]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#073f30]
                px-6
                py-3
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0a503d]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isPending ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  Save Section
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          LOCATIONS
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* HEADER */}

        <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Locations
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Manage the location cards
              displayed on the homepage
              and their corresponding
              positions on the Nigeria
              map.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewLocation}
            disabled={
              showNewLocation ||
              isPending
            }
            className="
              inline-flex
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#073f30]
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#0a503d]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Plus size={17} />

            Add Location
          </button>
        </div>

        {/* CREATE EDITOR */}

        {showNewLocation &&
          renderLocationEditor(
            "create"
          )}

        {/* LOCATION LIST */}

        <div className="divide-y divide-gray-100">
          {displayLocations.map(
            (location, index) => (
              <div key={location.id}>

                {/* LOCATION ROW */}

                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center lg:px-8">

                  {/* ICON */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <MapPin size={21} />
                  </div>

                  {/* INFORMATION */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {
                          location.name
                        }
                      </h3>

                      <span
                        className={`
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-medium

                          ${
                            location.is_active
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }
                        `}
                      >
                        {location.is_active
                          ? "Visible"
                          : "Hidden"}
                      </span>

                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                        Position{" "}
                        {index + 1}
                      </span>
                    </div>

                    {location.address && (
                      <p className="mt-1 text-sm text-gray-500">
                        {
                          location.address
                        }
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      Marker:{" "}
                      {Number(
                        location.marker_left ??
                          0
                      )}
                      % left,{" "}
                      {Number(
                        location.marker_top ??
                          0
                      )}
                      % top
                    </p>
                  </div>

                  {/* CONTROLS */}

                  <div className="flex flex-wrap items-center gap-2">

                    {/* MOVE UP */}

                    <button
                      type="button"
                      disabled={
                        index === 0 ||
                        isPending
                      }
                      onClick={() =>
                        moveLocation(
                          index,
                          "up"
                        )
                      }
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        p-2
                        text-gray-500
                        transition
                        hover:bg-gray-50
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                      aria-label={`Move ${location.name} up`}
                    >
                      <ChevronUp
                        size={18}
                      />
                    </button>

                    {/* MOVE DOWN */}

                    <button
                      type="button"
                      disabled={
                        index ===
                          displayLocations.length -
                            1 ||
                        isPending
                      }
                      onClick={() =>
                        moveLocation(
                          index,
                          "down"
                        )
                      }
                      className="
                        rounded-lg
                        border
                        border-gray-200
                        p-2
                        text-gray-500
                        transition
                        hover:bg-gray-50
                        disabled:cursor-not-allowed
                        disabled:opacity-30
                      "
                      aria-label={`Move ${location.name} down`}
                    >
                      <ChevronDown
                        size={18}
                      />
                    </button>

                    {/* VISIBILITY */}

                    <button
                      type="button"
                      onClick={() =>
                        toggleLocation(
                          location
                        )
                      }
                      disabled={isPending}
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        px-3
                        py-2
                        text-xs
                        font-medium
                        transition
                        disabled:opacity-50

                        ${
                          location.is_active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      `}
                    >
                      {location.is_active ? (
                        <Eye
                          size={15}
                        />
                      ) : (
                        <EyeOff
                          size={15}
                        />
                      )}

                      {location.is_active
                        ? "Visible"
                        : "Hidden"}
                    </button>

                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() =>
                        openEditLocation(
                          location
                        )
                      }
                      disabled={isPending}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-gray-200
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-gray-600
                        transition
                        hover:bg-gray-50
                        hover:text-gray-900
                        disabled:opacity-50
                      "
                    >
                      <Pencil
                        size={15}
                      />

                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() =>
                        openDeleteConfirmation(
                          location
                        )
                      }
                      disabled={isPending}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-lg
                        border
                        border-red-200
                        px-3
                        py-2
                        text-xs
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      <Trash2
                        size={15}
                      />

                      Delete
                    </button>
                  </div>
                </div>

                {/* EDITOR */}

                {editingLocationId ===
                  location.id &&
                  renderLocationEditor(
                    "edit",
                    location
                  )}
              </div>
            )
          )}

          {/* =================================================
              EMPTY STATE
          ================================================== */}

          {displayLocations.length ===
            0 && (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-700">
                <MapPin size={22} />
              </div>

              <p className="mt-4 font-medium text-gray-700">
                No locations have been
                added.
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first location
                to display it in the
                Market Reach section.
              </p>

              <button
                type="button"
                onClick={
                  openNewLocation
                }
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#073f30]
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-[#0a503d]
                "
              >
                <Plus size={17} />

                Add Location
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}