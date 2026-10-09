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
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

import MemberCompanyImageUpload from "./MemberCompanyImageUpload";

import {
  createMemberCompanyItem,
  deleteMemberCompanyItem,
  reorderMemberCompanyItems,
  toggleMemberCompanyItem,
  updateMemberCompanyItem,
  updateMemberCompanySettings,
} from "@/app/admin/(dashboard)/homepage/member-company/actions";

/* =========================================================
   TYPES
========================================================= */

type Settings = {
  id: string;

  eyebrow: string | null;
  heading: string;
  highlight: string | null;

  description: string | null;

  secondary_description:
    | string
    | null;

  statement_eyebrow:
    | string
    | null;

  statement_heading:
    | string
    | null;

  statement_highlight:
    | string
    | null;

  statement_description:
    | string
    | null;

  cta_label: string | null;
  cta_url: string | null;

  is_active: boolean;
};

type Company = {
  id: string;

  section_id: string;

  name: string;

  image_url: string;

  link_url: string | null;

  sort_order: number;

  is_active: boolean;
};

type Props = {
  settings: Settings;
  companies: Company[];
};

type CompanyForm = {
  name: string;
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
};

const emptyCompany: CompanyForm = {
  name: "",
  imageUrl: "",
  linkUrl: "",
  isActive: true,
};

/* =========================================================
   COMPONENT
========================================================= */

export default function MemberCompanyForm({
  settings,
  companies,
}: Props) {
  /* =========================================================
     SECTION STATE
  ========================================================= */

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

  const [
    secondaryDescription,
    setSecondaryDescription,
  ] = useState(
    settings.secondary_description ??
      ""
  );

  /* =========================================================
     STATEMENT STATE
  ========================================================= */

  const [
    statementEyebrow,
    setStatementEyebrow,
  ] = useState(
    settings.statement_eyebrow ?? ""
  );

  const [
    statementHeading,
    setStatementHeading,
  ] = useState(
    settings.statement_heading ?? ""
  );

  const [
    statementHighlight,
    setStatementHighlight,
  ] = useState(
    settings.statement_highlight ?? ""
  );

  const [
    statementDescription,
    setStatementDescription,
  ] = useState(
    settings.statement_description ??
      ""
  );

  const [
    ctaLabel,
    setCtaLabel,
  ] = useState(
    settings.cta_label ?? ""
  );

  const [ctaUrl, setCtaUrl] =
    useState(
      settings.cta_url ?? ""
    );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(
    settings.is_active
  );

  /* =========================================================
     COMPANY STATE
  ========================================================= */

  const [
    companyItems,
    setCompanyItems,
  ] = useState<Company[]>(
    [...companies].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );

  const [
    editorOpen,
    setEditorOpen,
  ] = useState(false);

  const [
    editingCompany,
    setEditingCompany,
  ] = useState<Company | null>(
    null
  );

  const [
    deletingCompany,
    setDeletingCompany,
  ] = useState<Company | null>(
    null
  );

  const [
    companyForm,
    setCompanyForm,
  ] = useState<CompanyForm>({
    ...emptyCompany,
  });

  /* =========================================================
     MESSAGE STATE
  ========================================================= */

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();

  function clearMessages() {
    setSuccessMessage("");
    setErrorMessage("");
  }

  /* =========================================================
     EDITOR
  ========================================================= */

  function closeEditor() {
    setEditorOpen(false);

    setEditingCompany(null);

    setCompanyForm({
      ...emptyCompany,
    });
  }

  function openNewCompany() {
    clearMessages();

    setDeletingCompany(null);

    setEditingCompany(null);

    setCompanyForm({
      ...emptyCompany,
    });

    setEditorOpen(true);
  }

  function openEditCompany(
    company: Company
  ) {
    clearMessages();

    setDeletingCompany(null);

    setEditingCompany(company);

    setCompanyForm({
      name: company.name,

      imageUrl:
        company.image_url,

      linkUrl:
        company.link_url ?? "",

      isActive:
        company.is_active,
    });

    setEditorOpen(true);
  }

  /* =========================================================
     SAVE SECTION
  ========================================================= */

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
        await updateMemberCompanySettings(
          settings.id,
          {
            eyebrow,
            heading,
            highlight,
            description,
            secondaryDescription,

            statementEyebrow,
            statementHeading,
            statementHighlight,
            statementDescription,

            ctaLabel,
            ctaUrl,

            isActive:
              sectionActive,
          }
        );

        setSuccessMessage(
          "Member Company section updated successfully."
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update section."
        );
      }
    });
  }

  /* =========================================================
     CREATE COMPANY
  ========================================================= */

  function createCompany() {
    clearMessages();

    if (
      !companyForm.name.trim()
    ) {
      setErrorMessage(
        "Company name is required."
      );

      return;
    }

    if (
      !companyForm.imageUrl.trim()
    ) {
      setErrorMessage(
        "Please upload a company image or logo."
      );

      return;
    }

    startTransition(async () => {
      try {
        const result =
          await createMemberCompanyItem(
            {
              sectionId:
                settings.id,

              name:
                companyForm.name,

              imageUrl:
                companyForm.imageUrl,

              linkUrl:
                companyForm.linkUrl,

              sortOrder:
                companyItems.length +
                1,

              isActive:
                companyForm.isActive,
            }
          );

        const item =
          result.item as Company;

        setCompanyItems(
          (current) => [
            ...current,
            item,
          ]
        );

        const name =
          companyForm.name.trim();

        closeEditor();

        setSuccessMessage(
          `"${name}" was added successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to add company."
        );
      }
    });
  }

  /* =========================================================
     UPDATE COMPANY
  ========================================================= */

  function updateCompany() {
    if (!editingCompany) {
      return;
    }

    clearMessages();

    if (
      !companyForm.name.trim()
    ) {
      setErrorMessage(
        "Company name is required."
      );

      return;
    }

    if (
      !companyForm.imageUrl.trim()
    ) {
      setErrorMessage(
        "Company image is required."
      );

      return;
    }

    startTransition(async () => {
      try {
        await updateMemberCompanyItem(
          editingCompany.id,
          {
            sectionId:
              settings.id,

            name:
              companyForm.name,

            imageUrl:
              companyForm.imageUrl,

            linkUrl:
              companyForm.linkUrl,

            sortOrder:
              editingCompany.sort_order,

            isActive:
              companyForm.isActive,
          }
        );

        const updated: Company = {
          ...editingCompany,

          name:
            companyForm.name.trim(),

          image_url:
            companyForm.imageUrl.trim(),

          link_url:
            companyForm.linkUrl.trim() ||
            null,

          is_active:
            companyForm.isActive,
        };

        setCompanyItems(
          (current) =>
            current.map(
              (company) =>
                company.id ===
                editingCompany.id
                  ? updated
                  : company
            )
        );

        closeEditor();

        setSuccessMessage(
          `"${updated.name}" was updated successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to update company."
        );
      }
    });
  }

  /* =========================================================
     TOGGLE COMPANY
  ========================================================= */

  function toggleCompany(
    company: Company
  ) {
    clearMessages();

    const nextValue =
      !company.is_active;

    startTransition(async () => {
      try {
        await toggleMemberCompanyItem(
          company.id,
          nextValue
        );

        setCompanyItems(
          (current) =>
            current.map(
              (item) =>
                item.id ===
                company.id
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
            ? `"${company.name}" is now visible.`
            : `"${company.name}" is now hidden.`
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

  /* =========================================================
     DELETE COMPANY
  ========================================================= */

  function removeCompany(
    company: Company
  ) {
    clearMessages();

    startTransition(async () => {
      try {
        await deleteMemberCompanyItem(
          company.id
        );

        const remaining =
          companyItems.filter(
            (item) =>
              item.id !==
              company.id
          );

        const normalized =
          remaining.map(
            (item, index) => ({
              ...item,

              sort_order:
                index + 1,
            })
          );

        if (
          normalized.length > 0
        ) {
          await reorderMemberCompanyItems(
            normalized.map(
              (item) => item.id
            )
          );
        }

        setCompanyItems(
          normalized
        );

        if (
          editingCompany?.id ===
          company.id
        ) {
          closeEditor();
        }

        setDeletingCompany(
          null
        );

        setSuccessMessage(
          `"${company.name}" was deleted successfully.`
        );
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to delete company."
        );
      }
    });
  }

  /* =========================================================
     REORDER
  ========================================================= */

  function moveCompany(
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
        companyItems.length
    ) {
      return;
    }

    clearMessages();

    const previous = [
      ...companyItems,
    ];

    const reordered = [
      ...companyItems,
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

    setCompanyItems(normalized);

    startTransition(async () => {
      try {
        await reorderMemberCompanyItems(
          normalized.map(
            (item) => item.id
          )
        );

        setSuccessMessage(
          "Member company order updated successfully."
        );
      } catch (error) {
        setCompanyItems(
          previous
        );

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to reorder companies."
        );
      }
    });
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-8">

      {/* SUCCESS */}

      {successMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <Check size={18} />

          {successMessage}
        </div>
      )}

      {/* ERROR */}

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {/* =====================================================
          SECTION CONTENT
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Section Content
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the introduction
              shown above the member
              company logos.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSectionActive(
                (current) =>
                  !current
              )
            }
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
              sectionActive
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
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
            label="Heading Highlight"
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

          <TextArea
            label="Secondary Description"
            value={
              secondaryDescription
            }
            onChange={
              setSecondaryDescription
            }
          />
        </div>
      </section>

      {/* =====================================================
          COMPANY EDITOR
      ====================================================== */}

      {editorOpen && (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {editingCompany
                  ? `Edit ${editingCompany.name}`
                  : "Add Member Company"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure the company
                name, image and
                destination page.
              </p>
            </div>

            <button
              type="button"
              onClick={
                closeEditor
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-6">
              <Field
                label="Company Name"
                value={
                  companyForm.name
                }
                onChange={(value) =>
                  setCompanyForm(
                    (current) => ({
                      ...current,
                      name: value,
                    })
                  )
                }
              />

              <Field
                label="Destination URL"
                value={
                  companyForm.linkUrl
                }
                placeholder="/services/real-estate"
                onChange={(value) =>
                  setCompanyForm(
                    (current) => ({
                      ...current,
                      linkUrl: value,
                    })
                  )
                }
              />

              <Field
                label="Image URL"
                value={
                  companyForm.imageUrl
                }
                placeholder="https://..."
                onChange={(value) =>
                  setCompanyForm(
                    (current) => ({
                      ...current,
                      imageUrl: value,
                    })
                  )
                }
              />

              <button
                type="button"
                onClick={() =>
                  setCompanyForm(
                    (current) => ({
                      ...current,

                      isActive:
                        !current.isActive,
                    })
                  )
                }
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
                  companyForm.isActive
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {companyForm.isActive ? (
                  <Eye size={17} />
                ) : (
                  <EyeOff
                    size={17}
                  />
                )}

                {companyForm.isActive
                  ? "Visible"
                  : "Hidden"}
              </button>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Company Image / Logo
              </p>

              <MemberCompanyImageUpload
                value={
                  companyForm.imageUrl
                }
                onChange={(url) =>
                  setCompanyForm(
                    (current) => ({
                      ...current,

                      imageUrl:
                        url,
                    })
                  )
                }
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={
                closeEditor
              }
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isPending}
              onClick={
                editingCompany
                  ? updateCompany
                  : createCompany
              }
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
            >
              {isPending ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={17}
                />
              )}

              {editingCompany
                ? "Save Changes"
                : "Add Company"}
            </button>
          </div>
        </section>
      )}

      {/* =====================================================
          COMPANY LIST
      ====================================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-6 lg:px-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Member Companies
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {companyItems.length}{" "}
              company record(s)
            </p>
          </div>

          <button
            type="button"
            onClick={
              openNewCompany
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={17} />
            Add Company
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {companyItems.map(
            (company, index) => (
              <div
                key={company.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
              >
                <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-100 bg-gray-50 p-2">
                  <img
                    src={
                      company.image_url
                    }
                    alt={
                      company.name
                    }
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {
                        company.name
                      }
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        company.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {company.is_active
                        ? "Visible"
                        : "Hidden"}
                    </span>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-500">
                      Position{" "}
                      {index + 1}
                    </span>
                  </div>

                  {company.link_url && (
                    <p className="mt-1 truncate text-xs text-gray-400">
                      {
                        company.link_url
                      }
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={
                      index === 0 ||
                      isPending
                    }
                    onClick={() =>
                      moveCompany(
                        index,
                        "up"
                      )
                    }
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ChevronUp
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      index ===
                        companyItems.length -
                          1 ||
                      isPending
                    }
                    onClick={() =>
                      moveCompany(
                        index,
                        "down"
                      )
                    }
                    className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ChevronDown
                      size={17}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toggleCompany(
                        company
                      )
                    }
                    disabled={isPending}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      company.is_active
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {company.is_active
                      ? "Visible"
                      : "Hidden"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openEditCompany(
                        company
                      )
                    }
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <Pencil
                      size={14}
                    />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeletingCompany(
                        company
                      )
                    }
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2
                      size={14}
                    />
                    Delete
                  </button>
                </div>
              </div>
            )
          )}

          {companyItems.length ===
            0 && (
            <div className="p-10 text-center text-sm text-gray-500">
              No member companies have
              been added.
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {deletingCompany && (
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                Delete{" "}
                {
                  deletingCompany.name
                }
                ?
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                This will permanently
                remove this company from
                the Member Companies
                section.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeletingCompany(
                    null
                  )
                }
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  removeCompany(
                    deletingCompany
                  )
                }
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2
                  size={16}
                />
                Delete
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          GROUP STATEMENT
      ====================================================== */}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900">
            Group Statement
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the dark GreenLunar
            Group call-to-action panel
            displayed below the company
            logos.
          </p>
        </div>

        <div className="grid gap-6">
          <Field
            label="Eyebrow"
            value={
              statementEyebrow
            }
            onChange={
              setStatementEyebrow
            }
          />

          <Field
            label="Heading"
            value={
              statementHeading
            }
            onChange={
              setStatementHeading
            }
          />

          <Field
            label="Heading Highlight"
            value={
              statementHighlight
            }
            onChange={
              setStatementHighlight
            }
          />

          <TextArea
            label="Description"
            value={
              statementDescription
            }
            onChange={
              setStatementDescription
            }
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="CTA Label"
              value={ctaLabel}
              onChange={
                setCtaLabel
              }
            />

            <Field
              label="CTA URL"
              value={ctaUrl}
              placeholder="/about"
              onChange={
                setCtaUrl
              }
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
          <button
            type="button"
            onClick={saveSection}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0a503d] disabled:opacity-60"
          >
            {isPending ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            Save Section
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   REUSABLE FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}

/* =========================================================
   REUSABLE TEXTAREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <textarea
        value={value}
        rows={4}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />
    </div>
  );
}