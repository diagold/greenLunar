"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  FileBadge2,
  Loader2,
  LockKeyhole,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";

import {
  createCertificationItem,
  createCertificationLogo,
  deleteCertificationItem,
  deleteCertificationLogo,
  reorderCertificationItems,
  reorderCertificationLogos,
  toggleCertificationItem,
  toggleCertificationLogo,
  updateCertificationItem,
  updateCertificationLogo,
  updateCertificationSettings,
} from "@/app/admin/(dashboard)/about/certifications-standards/actions";

import CertificationLogoUpload from "./CertificationLogoUpload";


/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;

  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;

  frameworks_eyebrow:
    | string
    | null;

  frameworks_heading:
    | string
    | null;

  frameworks_highlight:
    | string
    | null;

  frameworks_description:
    | string
    | null;

  is_active: boolean;
};


type CertificationItem = {
  id: string;
  section_id: string;

  title: string;

  description:
    | string
    | null;

  icon: string;

  sort_order: number;

  is_active: boolean;
};


type CertificationLogo = {
  id: string;
  section_id: string;

  name: string;

  logo_url: string;

  image_alt:
    | string
    | null;

  website_url:
    | string
    | null;

  sort_order: number;

  is_active: boolean;
};


type Props = {
  settings: Settings;

  items:
    CertificationItem[];

  logos:
    CertificationLogo[];
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CertificationsStandardsForm({
  settings,
  items,
  logos,
}: Props) {
  /* =======================================================
     INTRODUCTION
  ======================================================= */

  const [eyebrow, setEyebrow] =
    useState(
      settings.eyebrow ?? ""
    );

  const [heading, setHeading] =
    useState(
      settings.heading ?? ""
    );

  const [highlight, setHighlight] =
    useState(
      settings.highlight ?? ""
    );

  const [
    description,
    setDescription,
  ] = useState(
    settings.description ?? ""
  );

  const [isActive, setIsActive] =
    useState(
      settings.is_active
    );


  /* =======================================================
     FRAMEWORK SETTINGS
  ======================================================= */

  const [
    frameworksEyebrow,
    setFrameworksEyebrow,
  ] = useState(
    settings.frameworks_eyebrow ??
      ""
  );

  const [
    frameworksHeading,
    setFrameworksHeading,
  ] = useState(
    settings.frameworks_heading ??
      ""
  );

  const [
    frameworksHighlight,
    setFrameworksHighlight,
  ] = useState(
    settings.frameworks_highlight ??
      ""
  );

  const [
    frameworksDescription,
    setFrameworksDescription,
  ] = useState(
    settings.frameworks_description ??
      ""
  );


  /* =======================================================
     STANDARD CARDS
  ======================================================= */

  const [
    itemList,
    setItemList,
  ] = useState<
    CertificationItem[]
  >(
    [...items].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );

  const [
    itemEditorOpen,
    setItemEditorOpen,
  ] = useState(false);

  const [
    editingItem,
    setEditingItem,
  ] =
    useState<
      CertificationItem | null
    >(null);

  const [
    deletingItem,
    setDeletingItem,
  ] =
    useState<
      CertificationItem | null
    >(null);

  const [
    itemTitle,
    setItemTitle,
  ] = useState("");

  const [
    itemDescription,
    setItemDescription,
  ] = useState("");

  const [
    itemIcon,
    setItemIcon,
  ] = useState("shield");

  const [
    itemActive,
    setItemActive,
  ] = useState(true);


  /* =======================================================
     LOGOS
  ======================================================= */

  const [
    logoList,
    setLogoList,
  ] = useState<
    CertificationLogo[]
  >(
    [...logos].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );

  const [
    logoEditorOpen,
    setLogoEditorOpen,
  ] = useState(false);

  const [
    editingLogo,
    setEditingLogo,
  ] =
    useState<
      CertificationLogo | null
    >(null);

  const [
    deletingLogo,
    setDeletingLogo,
  ] =
    useState<
      CertificationLogo | null
    >(null);

  const [
    logoName,
    setLogoName,
  ] = useState("");

  const [
    logoUrl,
    setLogoUrl,
  ] = useState("");

  const [
    logoAlt,
    setLogoAlt,
  ] = useState("");

  const [
    logoWebsite,
    setLogoWebsite,
  ] = useState("");

  const [
    logoActive,
    setLogoActive,
  ] = useState(true);


  /* =======================================================
     FEEDBACK
  ======================================================= */

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();


  /* =======================================================
     SAVE SECTION SETTINGS
  ======================================================= */

  function saveSettings() {
    setSuccess("");
    setError("");

    if (!heading.trim()) {
      setError(
        "Heading is required."
      );

      return;
    }

    startTransition(
      async () => {
        try {
          await updateCertificationSettings(
            settings.id,
            {
              eyebrow,
              heading,
              highlight,
              description,

              frameworksEyebrow,
              frameworksHeading,
              frameworksHighlight,
              frameworksDescription,

              isActive,
            }
          );

          setSuccess(
            "Certifications & Standards settings updated successfully."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to update section."
            )
          );
        }
      }
    );
  }


  /* =======================================================
     STANDARD EDITOR
  ======================================================= */

  function resetItemEditor() {
    setItemEditorOpen(false);
    setEditingItem(null);

    setItemTitle("");
    setItemDescription("");
    setItemIcon("shield");
    setItemActive(true);
  }


  function openNewItem() {
    setError("");
    setSuccess("");

    setEditingItem(null);

    setItemTitle("");
    setItemDescription("");
    setItemIcon("shield");
    setItemActive(true);

    setItemEditorOpen(true);
  }


  function openEditItem(
    item: CertificationItem
  ) {
    setError("");
    setSuccess("");

    setEditingItem(item);

    setItemTitle(
      item.title
    );

    setItemDescription(
      item.description ?? ""
    );

    setItemIcon(
      item.icon ||
        "shield"
    );

    setItemActive(
      item.is_active
    );

    setItemEditorOpen(true);
  }


  function saveItem() {
    setError("");
    setSuccess("");

    if (!itemTitle.trim()) {
      setError(
        "Standard title is required."
      );

      return;
    }

    startTransition(
      async () => {
        try {
          if (editingItem) {
            await updateCertificationItem(
              editingItem.id,
              {
                sectionId:
                  settings.id,

                title:
                  itemTitle,

                description:
                  itemDescription,

                icon:
                  itemIcon,

                sortOrder:
                  editingItem.sort_order,

                isActive:
                  itemActive,
              }
            );

            setItemList(
              (current) =>
                current.map(
                  (item) =>
                    item.id ===
                    editingItem.id
                      ? {
                          ...item,

                          title:
                            itemTitle.trim(),

                          description:
                            itemDescription.trim() ||
                            null,

                          icon:
                            itemIcon,

                          is_active:
                            itemActive,
                        }
                      : item
                )
            );

            setSuccess(
              "Standard updated successfully."
            );
          } else {
            const result =
              await createCertificationItem(
                {
                  sectionId:
                    settings.id,

                  title:
                    itemTitle,

                  description:
                    itemDescription,

                  icon:
                    itemIcon,

                  sortOrder:
                    itemList.length +
                    1,

                  isActive:
                    itemActive,
                }
              );

            setItemList(
              (current) => [
                ...current,

                result.item as CertificationItem,
              ]
            );

            setSuccess(
              "Standard added successfully."
            );
          }

          resetItemEditor();
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to save standard."
            )
          );
        }
      }
    );
  }


  function toggleItem(
    item: CertificationItem
  ) {
    const next =
      !item.is_active;

    setError("");
    setSuccess("");

    startTransition(
      async () => {
        try {
          await toggleCertificationItem(
            item.id,
            next
          );

          setItemList(
            (current) =>
              current.map(
                (currentItem) =>
                  currentItem.id ===
                  item.id
                    ? {
                        ...currentItem,
                        is_active:
                          next,
                      }
                    : currentItem
              )
          );

          setSuccess(
            next
              ? "Standard is now visible."
              : "Standard is now hidden."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to change standard visibility."
            )
          );
        }
      }
    );
  }


  function deleteItem(
    item: CertificationItem
  ) {
    setError("");
    setSuccess("");

    startTransition(
      async () => {
        try {
          await deleteCertificationItem(
            item.id
          );

          const remaining =
            itemList.filter(
              (current) =>
                current.id !==
                item.id
            );

          const normalized =
            normalizeOrder(
              remaining
            );

          if (
            normalized.length
          ) {
            await reorderCertificationItems(
              normalized.map(
                (current) =>
                  current.id
              )
            );
          }

          setItemList(
            normalized
          );

          setDeletingItem(
            null
          );

          setSuccess(
            "Standard deleted successfully."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to delete standard."
            )
          );
        }
      }
    );
  }


  function moveItem(
    index: number,
    direction:
      | "up"
      | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >=
        itemList.length
    ) {
      return;
    }

    const previous =
      [...itemList];

    const reordered =
      [...itemList];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    const normalized =
      normalizeOrder(
        reordered
      );

    setItemList(
      normalized
    );

    startTransition(
      async () => {
        try {
          await reorderCertificationItems(
            normalized.map(
              (item) =>
                item.id
            )
          );

          setSuccess(
            "Standard order updated."
          );
        } catch (err) {
          setItemList(
            previous
          );

          setError(
            getErrorMessage(
              err,
              "Unable to reorder standards."
            )
          );
        }
      }
    );
  }


  /* =======================================================
     LOGO EDITOR
  ======================================================= */

  function resetLogoEditor() {
    setLogoEditorOpen(false);
    setEditingLogo(null);

    setLogoName("");
    setLogoUrl("");
    setLogoAlt("");
    setLogoWebsite("");
    setLogoActive(true);
  }


  function openNewLogo() {
    setError("");
    setSuccess("");

    setEditingLogo(null);

    setLogoName("");
    setLogoUrl("");
    setLogoAlt("");
    setLogoWebsite("");
    setLogoActive(true);

    setLogoEditorOpen(true);
  }


  function openEditLogo(
    logo: CertificationLogo
  ) {
    setError("");
    setSuccess("");

    setEditingLogo(
      logo
    );

    setLogoName(
      logo.name
    );

    setLogoUrl(
      logo.logo_url
    );

    setLogoAlt(
      logo.image_alt ?? ""
    );

    setLogoWebsite(
      logo.website_url ?? ""
    );

    setLogoActive(
      logo.is_active
    );

    setLogoEditorOpen(
      true
    );
  }


  function saveLogo() {
    setError("");
    setSuccess("");

    if (!logoName.trim()) {
      setError(
        "Certification name is required."
      );

      return;
    }

    if (!logoUrl.trim()) {
      setError(
        "Please upload a certification logo."
      );

      return;
    }

    startTransition(
      async () => {
        try {
          if (editingLogo) {
            await updateCertificationLogo(
              editingLogo.id,
              {
                sectionId:
                  settings.id,

                name:
                  logoName,

                logoUrl,

                imageAlt:
                  logoAlt,

                websiteUrl:
                  logoWebsite,

                sortOrder:
                  editingLogo.sort_order,

                isActive:
                  logoActive,
              }
            );

            setLogoList(
              (current) =>
                current.map(
                  (logo) =>
                    logo.id ===
                    editingLogo.id
                      ? {
                          ...logo,

                          name:
                            logoName.trim(),

                          logo_url:
                            logoUrl.trim(),

                          image_alt:
                            logoAlt.trim() ||
                            logoName.trim(),

                          website_url:
                            logoWebsite.trim() ||
                            null,

                          is_active:
                            logoActive,
                        }
                      : logo
                )
            );

            setSuccess(
              "Certification logo updated successfully."
            );
          } else {
            const result =
              await createCertificationLogo(
                {
                  sectionId:
                    settings.id,

                  name:
                    logoName,

                  logoUrl,

                  imageAlt:
                    logoAlt,

                  websiteUrl:
                    logoWebsite,

                  sortOrder:
                    logoList.length +
                    1,

                  isActive:
                    logoActive,
                }
              );

            setLogoList(
              (current) => [
                ...current,

                result.logo as CertificationLogo,
              ]
            );

            setSuccess(
              "Certification logo added successfully."
            );
          }

          resetLogoEditor();
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to save certification logo."
            )
          );
        }
      }
    );
  }


  function toggleLogo(
    logo: CertificationLogo
  ) {
    const next =
      !logo.is_active;

    setError("");
    setSuccess("");

    startTransition(
      async () => {
        try {
          await toggleCertificationLogo(
            logo.id,
            next
          );

          setLogoList(
            (current) =>
              current.map(
                (currentLogo) =>
                  currentLogo.id ===
                  logo.id
                    ? {
                        ...currentLogo,
                        is_active:
                          next,
                      }
                    : currentLogo
              )
          );

          setSuccess(
            next
              ? "Certification logo is now visible."
              : "Certification logo is now hidden."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to change logo visibility."
            )
          );
        }
      }
    );
  }


  function deleteLogo(
    logo: CertificationLogo
  ) {
    setError("");
    setSuccess("");

    startTransition(
      async () => {
        try {
          await deleteCertificationLogo(
            logo.id
          );

          const remaining =
            logoList.filter(
              (current) =>
                current.id !==
                logo.id
            );

          const normalized =
            normalizeOrder(
              remaining
            );

          if (
            normalized.length
          ) {
            await reorderCertificationLogos(
              normalized.map(
                (current) =>
                  current.id
              )
            );
          }

          setLogoList(
            normalized
          );

          setDeletingLogo(
            null
          );

          setSuccess(
            "Certification logo deleted successfully."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to delete certification logo."
            )
          );
        }
      }
    );
  }


  function moveLogo(
    index: number,
    direction:
      | "up"
      | "down"
  ) {
    const target =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      target < 0 ||
      target >=
        logoList.length
    ) {
      return;
    }

    const previous =
      [...logoList];

    const reordered =
      [...logoList];

    [
      reordered[index],
      reordered[target],
    ] = [
      reordered[target],
      reordered[index],
    ];

    const normalized =
      normalizeOrder(
        reordered
      );

    setLogoList(
      normalized
    );

    startTransition(
      async () => {
        try {
          await reorderCertificationLogos(
            normalized.map(
              (logo) =>
                logo.id
            )
          );

          setSuccess(
            "Certification logo order updated."
          );
        } catch (err) {
          setLogoList(
            previous
          );

          setError(
            getErrorMessage(
              err,
              "Unable to reorder certification logos."
            )
          );
        }
      }
    );
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-8">

      {/* FEEDBACK */}

      {success && (
        <SuccessNotice
          message={success}
        />
      )}

      {error && (
        <ErrorNotice
          message={error}
        />
      )}


      {/* ===================================================
          INTRODUCTION
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Certifications & Standards"
          title="Section Introduction"
          description="Manage the main introduction displayed at the beginning of this About Us section."
        />


        <div className="space-y-6">

          <Field
            label="Eyebrow"
            value={eyebrow}
            onChange={setEyebrow}
          />

          <Field
            label="Heading"
            value={heading}
            onChange={setHeading}
          />

          <Field
            label="Green Highlight"
            value={highlight}
            onChange={setHighlight}
          />

          <TextArea
            label="Description"
            value={description}
            onChange={
              setDescription
            }
          />


          <VisibilityButton
            active={isActive}
            activeLabel="Section Visible"
            inactiveLabel="Section Hidden"
            onClick={() =>
              setIsActive(
                (current) =>
                  !current
              )
            }
          />

        </div>

      </SectionCard>


      {/* ===================================================
          STANDARD EDITOR
      =================================================== */}

      {itemEditorOpen && (
        <SectionCard>

          <div className="flex items-start justify-between gap-4">

            <SectionHeader
              eyebrow="Standards Card"
              title={
                editingItem
                  ? "Edit Standard"
                  : "Add Standard"
              }
              description="Manage the content, icon and visibility of this standards card."
            />


            <CloseButton
              onClick={
                resetItemEditor
              }
            />

          </div>


          <div className="space-y-6">

            <Field
              label="Title"
              value={itemTitle}
              onChange={
                setItemTitle
              }
            />


            <TextArea
              label="Description"
              value={
                itemDescription
              }
              onChange={
                setItemDescription
              }
            />


            <div>

              <label className="mb-3 block text-sm font-medium text-gray-700">
                Card Icon
              </label>


              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">

                {[
                  ["shield", "Regulatory"],
                  ["iso", "International"],
                  ["check", "Quality"],
                  ["lock", "Security"],
                ].map(
                  ([
                    value,
                    label,
                  ]) => {

                    const selected =
                      itemIcon ===
                      value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setItemIcon(
                            value
                          )
                        }
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-green-600 bg-green-50 text-green-700"
                            : "border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >

                        <StandardIcon
                          icon={
                            value
                          }
                        />

                        <span className="text-sm font-medium">
                          {label}
                        </span>

                      </button>
                    );
                  }
                )}

              </div>

            </div>


            <VisibilityButton
              active={
                itemActive
              }
              onClick={() =>
                setItemActive(
                  (current) =>
                    !current
                )
              }
            />


            <EditorActions
              pending={
                isPending
              }
              saveLabel={
                editingItem
                  ? "Save Standard"
                  : "Add Standard"
              }
              onCancel={
                resetItemEditor
              }
              onSave={
                saveItem
              }
            />

          </div>

        </SectionCard>
      )}


      {/* ===================================================
          STANDARDS CARDS
      =================================================== */}

      <CollectionCard
        eyebrow="Standards"
        title="Standards Cards"
        description={`${itemList.length} card(s)`}
        buttonLabel="Add Standard"
        onAdd={openNewItem}
      >

        {itemList.length === 0 ? (

          <EmptyState
            message="No standards have been added yet."
          />

        ) : (

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

            {itemList.map(
              (item, index) => (

                <article
                  key={item.id}
                  className={`flex flex-col rounded-2xl border p-5 ${
                    item.is_active
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-50 opacity-70"
                  }`}
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">

                      <StandardIcon
                        icon={
                          item.icon
                        }
                      />

                    </div>


                    <StatusBadge
                      active={
                        item.is_active
                      }
                    />

                  </div>


                  <div className="mt-5 flex-1">

                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>


                    {item.description && (
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        {
                          item.description
                        }
                      </p>
                    )}

                  </div>


                  <p className="mt-5 border-t border-gray-100 pt-4 text-xs uppercase tracking-wide text-gray-400">
                    Position{" "}
                    {index + 1}
                  </p>


                  <CardActions
                    index={index}
                    total={
                      itemList.length
                    }
                    active={
                      item.is_active
                    }
                    pending={
                      isPending
                    }
                    onUp={() =>
                      moveItem(
                        index,
                        "up"
                      )
                    }
                    onDown={() =>
                      moveItem(
                        index,
                        "down"
                      )
                    }
                    onToggle={() =>
                      toggleItem(
                        item
                      )
                    }
                    onEdit={() =>
                      openEditItem(
                        item
                      )
                    }
                    onDelete={() =>
                      setDeletingItem(
                        item
                      )
                    }
                  />

                </article>

              )
            )}

          </div>
        )}

      </CollectionCard>


      {/* ===================================================
          FRAMEWORK SECTION SETTINGS
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Certifications & Frameworks"
          title="Framework Section"
          description="Manage the heading and supporting copy displayed directly above the certification logos."
        />


        <div className="space-y-6">

          <Field
            label="Eyebrow"
            value={
              frameworksEyebrow
            }
            onChange={
              setFrameworksEyebrow
            }
          />


          <Field
            label="Heading"
            value={
              frameworksHeading
            }
            onChange={
              setFrameworksHeading
            }
          />


          <Field
            label="Green Highlight"
            value={
              frameworksHighlight
            }
            onChange={
              setFrameworksHighlight
            }
          />


          <TextArea
            label="Description"
            value={
              frameworksDescription
            }
            onChange={
              setFrameworksDescription
            }
          />

        </div>

      </SectionCard>


      {/* ===================================================
          LOGO EDITOR
      =================================================== */}

      {logoEditorOpen && (

        <SectionCard>

          <div className="flex items-start justify-between gap-4">

            <SectionHeader
              eyebrow="Certification Logo"
              title={
                editingLogo
                  ? "Edit Certification"
                  : "Add Certification"
              }
              description="Upload and manage a certification, regulatory body or framework logo."
            />


            <CloseButton
              onClick={
                resetLogoEditor
              }
            />

          </div>


          <div className="grid gap-6 lg:grid-cols-2">

            <div className="space-y-6">

              <Field
                label="Certification / Organization Name"
                value={
                  logoName
                }
                onChange={
                  setLogoName
                }
                placeholder="Corporate Affairs Commission"
              />


              <Field
                label="Image Alt Text"
                value={
                  logoAlt
                }
                onChange={
                  setLogoAlt
                }
                placeholder="Corporate Affairs Commission"
              />


              <Field
                label="Website URL"
                value={
                  logoWebsite
                }
                onChange={
                  setLogoWebsite
                }
                placeholder="https://..."
              />


              <VisibilityButton
                active={
                  logoActive
                }
                onClick={() =>
                  setLogoActive(
                    (current) =>
                      !current
                  )
                }
              />

            </div>


            <CertificationLogoUpload
              value={logoUrl}
              onChange={
                setLogoUrl
              }
            />

          </div>


          <EditorActions
            pending={
              isPending
            }
            saveLabel={
              editingLogo
                ? "Save Certification"
                : "Add Certification"
            }
            onCancel={
              resetLogoEditor
            }
            onSave={
              saveLogo
            }
          />

        </SectionCard>

      )}


      {/* ===================================================
          CERTIFICATION LOGOS
      =================================================== */}

      <CollectionCard
        eyebrow="Certifications & Frameworks"
        title="Certification Logos"
        description={`${logoList.length} logo(s)`}
        buttonLabel="Add Certification"
        onAdd={
          openNewLogo
        }
      >

        {logoList.length === 0 ? (

          <EmptyState
            message="No certification logos have been added yet."
          />

        ) : (

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {logoList.map(
              (logo, index) => (

                <article
                  key={logo.id}
                  className={`overflow-hidden rounded-2xl border ${
                    logo.is_active
                      ? "border-gray-200 bg-white"
                      : "border-gray-200 bg-gray-50 opacity-70"
                  }`}
                >

                  <div className="flex h-[150px] items-center justify-center bg-[#f7faf8] p-6">

                    <img
                      src={
                        logo.logo_url
                      }
                      alt={
                        logo.image_alt ??
                        logo.name
                      }
                      className="max-h-[90px] max-w-full object-contain"
                    />

                  </div>


                  <div className="p-5">

                    <div className="flex items-start justify-between gap-3">

                      <h3 className="text-sm font-semibold text-gray-900">
                        {
                          logo.name
                        }
                      </h3>


                      <StatusBadge
                        active={
                          logo.is_active
                        }
                      />

                    </div>


                    <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">
                      Position{" "}
                      {index + 1}
                    </p>


                    <CardActions
                      index={index}
                      total={
                        logoList.length
                      }
                      active={
                        logo.is_active
                      }
                      pending={
                        isPending
                      }
                      onUp={() =>
                        moveLogo(
                          index,
                          "up"
                        )
                      }
                      onDown={() =>
                        moveLogo(
                          index,
                          "down"
                        )
                      }
                      onToggle={() =>
                        toggleLogo(
                          logo
                        )
                      }
                      onEdit={() =>
                        openEditLogo(
                          logo
                        )
                      }
                      onDelete={() =>
                        setDeletingLogo(
                          logo
                        )
                      }
                    />

                  </div>

                </article>

              )
            )}

          </div>
        )}

      </CollectionCard>


      {/* ===================================================
          SAVE ALL TEXT SETTINGS
      =================================================== */}

      <div className="sticky bottom-4 z-20 flex justify-end">

        <button
          type="button"
          disabled={
            isPending
          }
          onClick={
            saveSettings
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a503d] disabled:opacity-60"
        >

          {isPending ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save
              size={18}
            />
          )}

          Save Section Settings

        </button>

      </div>


      {/* ===================================================
          DELETE STANDARD
      =================================================== */}

      {deletingItem && (

        <DeleteConfirmation
          title="Delete standard?"
          name={
            deletingItem.title
          }
          pending={
            isPending
          }
          onCancel={() =>
            setDeletingItem(
              null
            )
          }
          onDelete={() =>
            deleteItem(
              deletingItem
            )
          }
        />

      )}


      {/* ===================================================
          DELETE LOGO
      =================================================== */}

      {deletingLogo && (

        <DeleteConfirmation
          title="Delete certification?"
          name={
            deletingLogo.name
          }
          pending={
            isPending
          }
          onCancel={() =>
            setDeletingLogo(
              null
            )
          }
          onDelete={() =>
            deleteLogo(
              deletingLogo
            )
          }
        />

      )}

    </div>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function normalizeOrder<
  T extends {
    sort_order: number;
  }
>(
  values: T[]
): T[] {
  return values.map(
    (value, index) => ({
      ...value,
      sort_order:
        index + 1,
    })
  );
}


function getErrorMessage(
  error: unknown,
  fallback: string
) {
  return error instanceof Error
    ? error.message
    : fallback;
}


/* =========================================================
   STANDARD ICON
========================================================= */

function StandardIcon({
  icon,
}: {
  icon: string;
}) {
  switch (icon) {
    case "iso":
      return (
        <FileBadge2
          size={21}
        />
      );

    case "check":
      return (
        <CheckCircle2
          size={21}
        />
      );

    case "lock":
      return (
        <LockKeyhole
          size={21}
        />
      );

    default:
      return (
        <ShieldCheck
          size={21}
        />
      );
  }
}


/* =========================================================
   SECTION CARD
========================================================= */

function SectionCard({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
      {children}
    </section>
  );
}


/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">

      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-lg font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   COLLECTION
========================================================= */

function CollectionCard({
  eyebrow,
  title,
  description,
  buttonLabel,
  onAdd,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  buttonLabel: string;
  onAdd: () => void;
  children:
    React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      <div className="flex flex-col gap-4 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">

        <div>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
            {eyebrow}
          </p>

          <h2 className="mt-2 text-lg font-semibold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {description}
          </p>

        </div>


        <button
          type="button"
          onClick={onAdd}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a503d]"
        >
          <Plus
            size={17}
          />

          {buttonLabel}
        </button>

      </div>


      <div className="p-6 lg:p-8">
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;

  onChange:
    (value: string) => void;

  placeholder?: string;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />

    </div>
  );
}


/* =========================================================
   TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;

  onChange:
    (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        rows={5}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />

    </div>
  );
}


/* =========================================================
   VISIBILITY
========================================================= */

function VisibilityButton({
  active,
  onClick,
  activeLabel = "Visible",
  inactiveLabel = "Hidden",
}: {
  active: boolean;
  onClick: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >

      {active ? (
        <Eye size={17} />
      ) : (
        <EyeOff size={17} />
      )}

      {active
        ? activeLabel
        : inactiveLabel}

    </button>
  );
}


/* =========================================================
   EDITOR ACTIONS
========================================================= */

function EditorActions({
  pending,
  saveLabel,
  onCancel,
  onSave,
}: {
  pending: boolean;
  saveLabel: string;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">

      <button
        type="button"
        disabled={pending}
        onClick={onCancel}
        className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Cancel
      </button>


      <button
        type="button"
        disabled={pending}
        onClick={onSave}
        className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-50"
      >

        {pending ? (
          <Loader2
            size={17}
            className="animate-spin"
          />
        ) : (
          <Save
            size={17}
          />
        )}

        {saveLabel}

      </button>

    </div>
  );
}


/* =========================================================
   CARD ACTIONS
========================================================= */

function CardActions({
  index,
  total,
  active,
  pending,
  onUp,
  onDown,
  onToggle,
  onEdit,
  onDelete,
}: {
  index: number;
  total: number;
  active: boolean;
  pending: boolean;

  onUp: () => void;
  onDown: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">

      <ActionButton
        title="Move up"
        disabled={
          index === 0 ||
          pending
        }
        onClick={onUp}
      >
        <ChevronUp
          size={15}
        />
      </ActionButton>


      <ActionButton
        title="Move down"
        disabled={
          index ===
            total - 1 ||
          pending
        }
        onClick={onDown}
      >
        <ChevronDown
          size={15}
        />
      </ActionButton>


      <ActionButton
        title={
          active
            ? "Hide"
            : "Show"
        }
        disabled={pending}
        onClick={onToggle}
      >
        {active ? (
          <Eye size={15} />
        ) : (
          <EyeOff size={15} />
        )}
      </ActionButton>


      <ActionButton
        title="Edit"
        disabled={pending}
        onClick={onEdit}
      >
        <Pencil
          size={15}
        />
      </ActionButton>


      <button
        type="button"
        disabled={pending}
        onClick={onDelete}
        title="Delete"
        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-30"
      >
        <Trash2
          size={15}
        />
      </button>

    </div>
  );
}


/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  children,
  title,
  disabled,
  onClick,
}: {
  children:
    React.ReactNode;

  title: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:opacity-30"
    >
      {children}
    </button>
  );
}


/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {active
        ? "Visible"
        : "Hidden"}
    </span>
  );
}


/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="py-12 text-center">

      <ShieldCheck
        size={30}
        className="mx-auto text-gray-300"
      />

      <p className="mt-3 text-sm text-gray-500">
        {message}
      </p>

    </div>
  );
}


/* =========================================================
   CLOSE
========================================================= */

function CloseButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
    >
      <X size={18} />
    </button>
  );
}


/* =========================================================
   DELETE CONFIRMATION
========================================================= */

function DeleteConfirmation({
  title,
  name,
  pending,
  onCancel,
  onDelete,
}: {
  title: string;
  name: string;
  pending: boolean;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">

      <h3 className="font-semibold text-gray-900">
        {title}
      </h3>


      <p className="mt-2 text-sm leading-6 text-gray-500">
        <strong className="text-gray-700">
          {name}
        </strong>{" "}
        will be permanently
        removed.
      </p>


      <p className="mt-2 text-xs text-red-600">
        This action cannot be undone.
      </p>


      <div className="mt-5 flex gap-3">

        <button
          type="button"
          disabled={pending}
          onClick={onCancel}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-700"
        >
          Cancel
        </button>


        <button
          type="button"
          disabled={pending}
          onClick={onDelete}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >

          {pending ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Trash2
              size={16}
            />
          )}

          Delete

        </button>

      </div>

    </div>
  );
}


/* =========================================================
   FEEDBACK
========================================================= */

function SuccessNotice({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">

      <Check
        size={17}
      />

      {message}

    </div>
  );
}


function ErrorNotice({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  );
}