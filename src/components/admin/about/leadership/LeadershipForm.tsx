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
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import {
  createLeadershipMember,
  deleteLeadershipMember,
  reorderLeadershipMembers,
  toggleLeadershipMember,
  updateLeadershipMember,
  updateLeadershipSettings,
} from "@/app/admin/(dashboard)/about/leadership/actions";

import LeadershipImageUpload from "./LeadershipImageUpload";


/* =========================================================
   TYPES
========================================================= */

type Leadership = {
  id: string;

  eyebrow: string | null;
  heading: string;
  highlight: string | null;
  description: string | null;

  chairman_image_url: string | null;
  chairman_image_alt: string | null;
  chairman_label: string | null;
  chairman_position: string | null;
  chairman_name: string | null;
  chairman_description: string | null;

  executives_eyebrow: string | null;
  executives_heading: string | null;

  team_description: string | null;
  team_label: string | null;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
};


type LeadershipMember = {
  id: string;
  section_id: string;

  name: string;
  role: string;

  description: string | null;

  image_url: string | null;
  image_alt: string | null;

  profile_url: string | null;

  sort_order: number;

  is_active: boolean;

  created_at?: string;
  updated_at?: string;
};


type LeadershipFormProps = {
  leadership: Leadership;
  members: LeadershipMember[];
};


/* =========================================================
   COMPONENT
========================================================= */

export default function LeadershipForm({
  leadership,
  members,
}: LeadershipFormProps) {
  /* =======================================================
     SECTION INTRODUCTION
  ======================================================= */

  const [eyebrow, setEyebrow] =
    useState(
      leadership.eyebrow ?? ""
    );

  const [heading, setHeading] =
    useState(
      leadership.heading ?? ""
    );

  const [highlight, setHighlight] =
    useState(
      leadership.highlight ?? ""
    );

  const [
    description,
    setDescription,
  ] = useState(
    leadership.description ?? ""
  );

  const [
    sectionActive,
    setSectionActive,
  ] = useState(
    leadership.is_active
  );


  /* =======================================================
     CHAIRMAN
  ======================================================= */

  const [
    chairmanImageUrl,
    setChairmanImageUrl,
  ] = useState(
    leadership.chairman_image_url ??
      ""
  );

  const [
    chairmanImageAlt,
    setChairmanImageAlt,
  ] = useState(
    leadership.chairman_image_alt ??
      ""
  );

  const [
    chairmanLabel,
    setChairmanLabel,
  ] = useState(
    leadership.chairman_label ??
      ""
  );

  const [
    chairmanPosition,
    setChairmanPosition,
  ] = useState(
    leadership.chairman_position ??
      ""
  );

  const [
    chairmanName,
    setChairmanName,
  ] = useState(
    leadership.chairman_name ??
      ""
  );

  const [
    chairmanDescription,
    setChairmanDescription,
  ] = useState(
    leadership.chairman_description ??
      ""
  );


  /* =======================================================
     EXECUTIVE SECTION
  ======================================================= */

  const [
    executivesEyebrow,
    setExecutivesEyebrow,
  ] = useState(
    leadership.executives_eyebrow ??
      ""
  );

  const [
    executivesHeading,
    setExecutivesHeading,
  ] = useState(
    leadership.executives_heading ??
      ""
  );


  /* =======================================================
     WIDER LEADERSHIP PANEL
  ======================================================= */

  const [
    teamDescription,
    setTeamDescription,
  ] = useState(
    leadership.team_description ??
      ""
  );

  const [
    teamLabel,
    setTeamLabel,
  ] = useState(
    leadership.team_label ?? ""
  );


  /* =======================================================
     EXECUTIVE MEMBERS
  ======================================================= */

  const [
    memberList,
    setMemberList,
  ] = useState<LeadershipMember[]>(
    [...members].sort(
      (a, b) =>
        a.sort_order -
        b.sort_order
    )
  );


  /* =======================================================
     MEMBER EDITOR
  ======================================================= */

  const [
    memberEditorOpen,
    setMemberEditorOpen,
  ] = useState(false);

  const [
    editingMember,
    setEditingMember,
  ] =
    useState<LeadershipMember | null>(
      null
    );

  const [
    deletingMember,
    setDeletingMember,
  ] =
    useState<LeadershipMember | null>(
      null
    );

  const [
    memberName,
    setMemberName,
  ] = useState("");

  const [
    memberRole,
    setMemberRole,
  ] = useState("");

  const [
    memberDescription,
    setMemberDescription,
  ] = useState("");

  const [
    memberImageUrl,
    setMemberImageUrl,
  ] = useState("");

  const [
    memberImageAlt,
    setMemberImageAlt,
  ] = useState("");

  const [
    memberProfileUrl,
    setMemberProfileUrl,
  ] = useState("");

  const [
    memberActive,
    setMemberActive,
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
     SAVE MAIN LEADERSHIP SETTINGS
  ======================================================= */

  function saveLeadershipSettings() {
    setSuccess("");
    setError("");

    if (!heading.trim()) {
      setError(
        "Leadership heading is required."
      );

      return;
    }

    if (!chairmanName.trim()) {
      setError(
        "Chairman name is required."
      );

      return;
    }

    if (!chairmanPosition.trim()) {
      setError(
        "Chairman position is required."
      );

      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          await updateLeadershipSettings(
            leadership.id,
            {
              eyebrow,
              heading,
              highlight,
              description,

              chairmanImageUrl,
              chairmanImageAlt,
              chairmanLabel,
              chairmanPosition,
              chairmanName,
              chairmanDescription,

              executivesEyebrow,
              executivesHeading,

              teamDescription,
              teamLabel,

              isActive:
                sectionActive,
            }
          );

          setSuccess(
            "Leadership section updated successfully."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to update Leadership section."
            )
          );
        }
      })();
    });
  }


  /* =======================================================
     OPEN NEW MEMBER
  ======================================================= */

  function openNewMember() {
    setError("");
    setSuccess("");

    setEditingMember(null);

    setMemberName("");
    setMemberRole("");
    setMemberDescription("");
    setMemberImageUrl("");
    setMemberImageAlt("");
    setMemberProfileUrl("");
    setMemberActive(true);

    setMemberEditorOpen(true);
  }


  /* =======================================================
     EDIT MEMBER
  ======================================================= */

  function openEditMember(
    member: LeadershipMember
  ) {
    setError("");
    setSuccess("");

    setEditingMember(member);

    setMemberName(
      member.name
    );

    setMemberRole(
      member.role
    );

    setMemberDescription(
      member.description ?? ""
    );

    setMemberImageUrl(
      member.image_url ?? ""
    );

    setMemberImageAlt(
      member.image_alt ?? ""
    );

    setMemberProfileUrl(
      member.profile_url ?? ""
    );

    setMemberActive(
      member.is_active
    );

    setMemberEditorOpen(true);
  }


  /* =======================================================
     RESET MEMBER EDITOR
  ======================================================= */

  function resetMemberEditor() {
    setMemberEditorOpen(false);

    setEditingMember(null);

    setMemberName("");
    setMemberRole("");
    setMemberDescription("");
    setMemberImageUrl("");
    setMemberImageAlt("");
    setMemberProfileUrl("");
    setMemberActive(true);
  }


  /* =======================================================
     SAVE MEMBER
  ======================================================= */

  function saveMember() {
    setSuccess("");
    setError("");

    if (!memberName.trim()) {
      setError(
        "Executive name is required."
      );

      return;
    }

    if (!memberRole.trim()) {
      setError(
        "Executive role is required."
      );

      return;
    }

    startTransition(() => {
      void (async () => {
        try {
          if (editingMember) {
            await updateLeadershipMember(
              editingMember.id,
              {
                sectionId:
                  leadership.id,

                name:
                  memberName,

                role:
                  memberRole,

                description:
                  memberDescription,

                imageUrl:
                  memberImageUrl,

                imageAlt:
                  memberImageAlt,

                profileUrl:
                  memberProfileUrl,

                sortOrder:
                  editingMember.sort_order,

                isActive:
                  memberActive,
              }
            );

            setMemberList(
              (current) =>
                current.map(
                  (member) =>
                    member.id ===
                    editingMember.id
                      ? {
                          ...member,

                          name:
                            memberName.trim(),

                          role:
                            memberRole.trim(),

                          description:
                            memberDescription.trim() ||
                            null,

                          image_url:
                            memberImageUrl.trim() ||
                            null,

                          image_alt:
                            memberImageAlt.trim() ||
                            memberName.trim(),

                          profile_url:
                            memberProfileUrl.trim() ||
                            null,

                          is_active:
                            memberActive,
                        }
                      : member
                )
            );

            setSuccess(
              "Executive member updated successfully."
            );
          } else {
            const result =
              await createLeadershipMember(
                {
                  sectionId:
                    leadership.id,

                  name:
                    memberName,

                  role:
                    memberRole,

                  description:
                    memberDescription,

                  imageUrl:
                    memberImageUrl,

                  imageAlt:
                    memberImageAlt,

                  profileUrl:
                    memberProfileUrl,

                  sortOrder:
                    memberList.length +
                    1,

                  isActive:
                    memberActive,
                }
              );

            setMemberList(
              (current) => [
                ...current,

                result.member as LeadershipMember,
              ]
            );

            setSuccess(
              "Executive member added successfully."
            );
          }

          resetMemberEditor();
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to save executive member."
            )
          );
        }
      })();
    });
  }


  /* =======================================================
     TOGGLE MEMBER
  ======================================================= */

  function toggleMember(
    member: LeadershipMember
  ) {
    const nextActive =
      !member.is_active;

    setSuccess("");
    setError("");

    startTransition(() => {
      void (async () => {
        try {
          await toggleLeadershipMember(
            member.id,
            nextActive
          );

          setMemberList(
            (current) =>
              current.map(
                (currentMember) =>
                  currentMember.id ===
                  member.id
                    ? {
                        ...currentMember,

                        is_active:
                          nextActive,
                      }
                    : currentMember
              )
          );

          setSuccess(
            nextActive
              ? `${member.name} is now visible.`
              : `${member.name} is now hidden.`
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to change executive visibility."
            )
          );
        }
      })();
    });
  }


  /* =======================================================
     DELETE MEMBER
  ======================================================= */

  function confirmDeleteMember(
    member: LeadershipMember
  ) {
    setSuccess("");
    setError("");

    startTransition(() => {
      void (async () => {
        try {
          await deleteLeadershipMember(
            member.id
          );

          const remaining =
            memberList.filter(
              (current) =>
                current.id !==
                member.id
            );

          const normalized =
            normalizeMemberOrder(
              remaining
            );

          if (
            normalized.length >
            0
          ) {
            await reorderLeadershipMembers(
              normalized.map(
                (current) =>
                  current.id
              )
            );
          }

          setMemberList(
            normalized
          );

          setDeletingMember(
            null
          );

          setSuccess(
            "Executive member deleted successfully."
          );
        } catch (err) {
          setError(
            getErrorMessage(
              err,
              "Unable to delete executive member."
            )
          );
        }
      })();
    });
  }


  /* =======================================================
     MOVE MEMBER
  ======================================================= */

  function moveMember(
    index: number,
    direction:
      | "up"
      | "down"
  ) {
    const targetIndex =
      direction === "up"
        ? index - 1
        : index + 1;

    if (
      targetIndex < 0 ||
      targetIndex >=
        memberList.length
    ) {
      return;
    }

    const previousList =
      [...memberList];

    const reordered =
      [...memberList];

    [
      reordered[index],
      reordered[targetIndex],
    ] = [
      reordered[targetIndex],
      reordered[index],
    ];

    const normalized =
      normalizeMemberOrder(
        reordered
      );

    /*
     * Update UI immediately.
     */
    setMemberList(
      normalized
    );

    setSuccess("");
    setError("");

    startTransition(() => {
      void (async () => {
        try {
          await reorderLeadershipMembers(
            normalized.map(
              (member) =>
                member.id
            )
          );

          setSuccess(
            "Executive order updated successfully."
          );
        } catch (err) {
          /*
           * Restore previous state if the
           * database update fails.
           */
          setMemberList(
            previousList
          );

          setError(
            getErrorMessage(
              err,
              "Unable to reorder executive members."
            )
          );
        }
      })();
    });
  }


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="space-y-8">

      {/* ===================================================
          FEEDBACK
      =================================================== */}

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
          1. LEADERSHIP INTRODUCTION
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Leadership"
          title="Section Introduction"
          description="Manage the heading and introductory content displayed at the beginning of the Leadership section."
        />


        <div className="grid gap-6 lg:grid-cols-2">

          <Field
            label="Eyebrow"
            value={eyebrow}
            onChange={
              setEyebrow
            }
            placeholder="Our Leadership"
          />


          <Field
            label="Heading"
            value={heading}
            onChange={
              setHeading
            }
            placeholder="Experienced leadership."
          />


          <div className="lg:col-span-2">

            <Field
              label="Green Highlight"
              value={highlight}
              onChange={
                setHighlight
              }
              placeholder="A stronger tomorrow."
            />

          </div>


          <div className="lg:col-span-2">

            <TextArea
              label="Description"
              value={description}
              onChange={
                setDescription
              }
              rows={5}
            />

          </div>


          <div className="lg:col-span-2">

            <VisibilityButton
              active={
                sectionActive
              }
              activeLabel="Leadership Section Visible"
              inactiveLabel="Leadership Section Hidden"
              onClick={() =>
                setSectionActive(
                  (current) =>
                    !current
                )
              }
            />

          </div>

        </div>

      </SectionCard>


      {/* ===================================================
          2. GROUP CHAIRMAN
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Group Leadership"
          title="Group Chairman"
          description="Manage the Chairman spotlight displayed prominently within the Leadership section."
        />


        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

          {/* IMAGE */}

          <LeadershipImageUpload
            value={
              chairmanImageUrl
            }
            onChange={
              setChairmanImageUrl
            }
            label="Chairman Image"
            previewAlt={
              chairmanImageAlt ||
              chairmanName ||
              "Group Chairman"
            }
            description="Upload the Group Chairman image. It will automatically be resized, compressed and converted to WebP before upload."
          />


          {/* CONTENT */}

          <div className="space-y-6">

            <div className="grid gap-6 sm:grid-cols-2">

              <Field
                label="Name"
                value={
                  chairmanName
                }
                onChange={
                  setChairmanName
                }
                placeholder="Mr Fisayo Ishola"
              />


              <Field
                label="Position"
                value={
                  chairmanPosition
                }
                onChange={
                  setChairmanPosition
                }
                placeholder="Group Chairman"
              />


              <Field
                label="Label"
                value={
                  chairmanLabel
                }
                onChange={
                  setChairmanLabel
                }
                placeholder="Group Leadership"
              />


              <Field
                label="Image Alt Text"
                value={
                  chairmanImageAlt
                }
                onChange={
                  setChairmanImageAlt
                }
                placeholder="Group Chairman"
              />

            </div>


            <TextArea
              label="Chairman Description"
              value={
                chairmanDescription
              }
              onChange={
                setChairmanDescription
              }
              rows={7}
            />

          </div>

        </div>

      </SectionCard>


      {/* ===================================================
          3. EXECUTIVE SECTION HEADING
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Executive Leadership"
          title="Executive Section"
          description="Manage the heading displayed above the executive leadership cards."
        />


        <div className="grid gap-6 lg:grid-cols-2">

          <Field
            label="Eyebrow"
            value={
              executivesEyebrow
            }
            onChange={
              setExecutivesEyebrow
            }
            placeholder="Executive Leadership"
          />


          <Field
            label="Heading"
            value={
              executivesHeading
            }
            onChange={
              setExecutivesHeading
            }
            placeholder="Meet our executive team"
          />

        </div>

      </SectionCard>


      {/* ===================================================
          4. MEMBER EDITOR
      =================================================== */}

      {memberEditorOpen && (
        <SectionCard>

          <div className="flex items-start justify-between gap-4">

            <SectionHeader
              eyebrow="Executive Member"
              title={
                editingMember
                  ? "Edit Executive"
                  : "Add Executive"
              }
              description={
                editingMember
                  ? `Update ${editingMember.name}'s information.`
                  : "Add a new member to the executive leadership team."
              }
            />


            <button
              type="button"
              disabled={
                isPending
              }
              onClick={
                resetMemberEditor
              }
              className="shrink-0 rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:opacity-50"
              aria-label="Close executive editor"
            >
              <X size={18} />
            </button>

          </div>


          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">

            {/* MEMBER IMAGE */}

            <LeadershipImageUpload
              value={
                memberImageUrl
              }
              onChange={
                setMemberImageUrl
              }
              label="Executive Image"
              previewAlt={
                memberImageAlt ||
                memberName ||
                "Executive member"
              }
              description="Upload the executive's photograph. The image will be optimized and converted to WebP automatically."
            />


            {/* MEMBER CONTENT */}

            <div className="space-y-6">

              <div className="grid gap-6 sm:grid-cols-2">

                <Field
                  label="Name"
                  value={
                    memberName
                  }
                  onChange={
                    setMemberName
                  }
                  placeholder="Executive name"
                />


                <Field
                  label="Role / Position"
                  value={
                    memberRole
                  }
                  onChange={
                    setMemberRole
                  }
                  placeholder="Group Managing Director"
                />


                <Field
                  label="Image Alt Text"
                  value={
                    memberImageAlt
                  }
                  onChange={
                    setMemberImageAlt
                  }
                  placeholder="Group Managing Director"
                />


                <Field
                  label="Profile Link"
                  value={
                    memberProfileUrl
                  }
                  onChange={
                    setMemberProfileUrl
                  }
                  placeholder="/about/leadership/managing-director"
                />

              </div>


              <TextArea
                label="Executive Description"
                value={
                  memberDescription
                }
                onChange={
                  setMemberDescription
                }
                rows={6}
              />


              <VisibilityButton
                active={
                  memberActive
                }
                activeLabel="Executive Visible"
                inactiveLabel="Executive Hidden"
                onClick={() =>
                  setMemberActive(
                    (current) =>
                      !current
                  )
                }
              />

            </div>

          </div>


          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={
                isPending
              }
              onClick={
                resetMemberEditor
              }
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="button"
              disabled={
                isPending
              }
              onClick={
                saveMember
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#073f30] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a503d] disabled:cursor-not-allowed disabled:opacity-50"
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

              {editingMember
                ? "Save Executive"
                : "Add Executive"}

            </button>

          </div>

        </SectionCard>
      )}


      {/* ===================================================
          5. EXECUTIVE MEMBERS
      =================================================== */}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* COLLECTION HEADER */}

        <div className="flex flex-col gap-5 border-b border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
              Executive Leadership
            </p>


            <h2 className="mt-2 text-lg font-semibold text-gray-900">
              Executive Members
            </h2>


            <p className="mt-1 text-sm text-gray-500">
              {memberList.length}{" "}
              executive
              {memberList.length ===
              1
                ? ""
                : "s"}{" "}
              configured
            </p>

          </div>


          <button
            type="button"
            disabled={
              isPending
            }
            onClick={
              openNewMember
            }
            className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0a503d] disabled:opacity-50"
          >
            <Plus size={17} />

            Add Executive
          </button>

        </div>


        {/* EXECUTIVES */}

        <div className="p-6 lg:p-8">

          {memberList.length ===
          0 ? (

            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">

              <UsersRound
                size={36}
                className="mx-auto text-gray-300"
              />


              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No executive members
              </h3>


              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Add members of the
                executive leadership
                team. Their order here
                will determine their
                order on the public
                About page.
              </p>


              <button
                type="button"
                onClick={
                  openNewMember
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} />

                Add Executive
              </button>

            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {memberList.map(
                (
                  member,
                  index
                ) => (

                  <ExecutiveCard
                    key={
                      member.id
                    }
                    member={
                      member
                    }
                    index={
                      index
                    }
                    total={
                      memberList.length
                    }
                    pending={
                      isPending
                    }
                    onEdit={() =>
                      openEditMember(
                        member
                      )
                    }
                    onToggle={() =>
                      toggleMember(
                        member
                      )
                    }
                    onDelete={() =>
                      setDeletingMember(
                        member
                      )
                    }
                    onMoveUp={() =>
                      moveMember(
                        index,
                        "up"
                      )
                    }
                    onMoveDown={() =>
                      moveMember(
                        index,
                        "down"
                      )
                    }
                  />

                )
              )}

            </div>

          )}

        </div>

      </section>


      {/* ===================================================
          6. WIDER LEADERSHIP TEAM
      =================================================== */}

      <SectionCard>

        <SectionHeader
          eyebrow="Leadership Team"
          title="Wider Leadership Panel"
          description="Manage the supporting message displayed below the executive leadership cards."
        />


        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.4fr)]">

          <TextArea
            label="Description"
            value={
              teamDescription
            }
            onChange={
              setTeamDescription
            }
            rows={5}
          />


          <Field
            label="Panel Label"
            value={
              teamLabel
            }
            onChange={
              setTeamLabel
            }
            placeholder="One Leadership Team"
          />

        </div>

      </SectionCard>


      {/* ===================================================
          SAVE MAIN SETTINGS
      =================================================== */}

      <div className="sticky bottom-4 z-20 flex justify-end">

        <button
          type="button"
          disabled={
            isPending
          }
          onClick={
            saveLeadershipSettings
          }
          className="inline-flex items-center gap-2 rounded-xl bg-[#073f30] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0a503d] disabled:cursor-not-allowed disabled:opacity-60"
        >

          {isPending ? (
            <Loader2
              size={18}
              className="animate-spin"
            />
          ) : (
            <Save size={18} />
          )}

          Save Leadership Settings

        </button>

      </div>


      {/* ===================================================
          DELETE CONFIRMATION
      =================================================== */}

      {deletingMember && (
        <DeleteConfirmation
          name={
            deletingMember.name
          }
          pending={
            isPending
          }
          onCancel={() =>
            setDeletingMember(
              null
            )
          }
          onDelete={() =>
            confirmDeleteMember(
              deletingMember
            )
          }
        />
      )}

    </div>
  );
}


/* =========================================================
   EXECUTIVE CARD
========================================================= */

function ExecutiveCard({
  member,
  index,
  total,
  pending,
  onEdit,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  member: LeadershipMember;

  index: number;

  total: number;

  pending: boolean;

  onEdit: () => void;

  onToggle: () => void;

  onDelete: () => void;

  onMoveUp: () => void;

  onMoveDown: () => void;
}) {
  return (
    <article
      className={`overflow-hidden rounded-2xl border transition ${
        member.is_active
          ? "border-gray-200 bg-white"
          : "border-gray-200 bg-gray-50 opacity-70"
      }`}
    >

      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {member.image_url ? (
          <img
            src={
              member.image_url
            }
            alt={
              member.image_alt ||
              member.name
            }
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">

            <UserRound
              size={46}
              className="text-gray-300"
            />

          </div>
        )}


        <div className="absolute right-3 top-3">

          <StatusBadge
            active={
              member.is_active
            }
          />

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-5">

        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green-700">
          {member.role}
        </p>


        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {member.name}
        </h3>


        {member.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
            {
              member.description
            }
          </p>
        )}


        {member.profile_url && (
          <div className="mt-3">

            <span className="break-all text-xs text-gray-400">
              {
                member.profile_url
              }
            </span>

          </div>
        )}


        <div className="mt-5 border-t border-gray-100 pt-4">

          <p className="mb-3 text-xs uppercase tracking-wide text-gray-400">
            Position{" "}
            {index + 1}
          </p>


          <div className="flex flex-wrap gap-2">

            <ActionButton
              title="Move up"
              disabled={
                index === 0 ||
                pending
              }
              onClick={
                onMoveUp
              }
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
              onClick={
                onMoveDown
              }
            >
              <ChevronDown
                size={15}
              />
            </ActionButton>


            <ActionButton
              title={
                member.is_active
                  ? "Hide executive"
                  : "Show executive"
              }
              disabled={
                pending
              }
              onClick={
                onToggle
              }
            >

              {member.is_active ? (
                <Eye
                  size={15}
                />
              ) : (
                <EyeOff
                  size={15}
                />
              )}

            </ActionButton>


            <ActionButton
              title="Edit executive"
              disabled={
                pending
              }
              onClick={
                onEdit
              }
            >
              <Pencil
                size={15}
              />
            </ActionButton>


            <button
              type="button"
              title="Delete executive"
              aria-label="Delete executive"
              disabled={
                pending
              }
              onClick={
                onDelete
              }
              className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Trash2
                size={15}
              />
            </button>

          </div>

        </div>

      </div>

    </article>
  );
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


      <p className="mt-1 max-w-3xl text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>
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
        placeholder={
          placeholder
        }
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />

    </div>
  );
}


/* =========================================================
   TEXT AREA
========================================================= */

function TextArea({
  label,
  value,
  onChange,
  rows = 5,
}: {
  label: string;

  value: string;

  onChange:
    (value: string) => void;

  rows?: number;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>


      <textarea
        rows={rows}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />

    </div>
  );
}


/* =========================================================
   VISIBILITY BUTTON
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
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-green-50 text-green-700 hover:bg-green-100"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >

      {active ? (
        <Eye size={17} />
      ) : (
        <EyeOff
          size={17}
        />
      )}

      {active
        ? activeLabel
        : inactiveLabel}

    </button>
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
      className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
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
   DELETE CONFIRMATION
========================================================= */

function DeleteConfirmation({
  name,
  pending,
  onCancel,
  onDelete,
}: {
  name: string;

  pending: boolean;

  onCancel: () => void;

  onDelete: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">

          <Trash2
            size={21}
          />

        </div>


        <h3 className="mt-5 text-lg font-semibold text-gray-900">
          Delete executive member?
        </h3>


        <p className="mt-2 text-sm leading-6 text-gray-500">
          <strong className="font-semibold text-gray-700">
            {name}
          </strong>{" "}
          will be permanently removed
          from the Leadership section.
        </p>


        <p className="mt-2 text-xs font-medium text-red-600">
          This action cannot be undone.
        </p>


        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            disabled={
              pending
            }
            onClick={
              onCancel
            }
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="button"
            disabled={
              pending
            }
            onClick={
              onDelete
            }
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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

            Delete Executive

          </button>

        </div>

      </div>

    </div>
  );
}


/* =========================================================
   SUCCESS NOTICE
========================================================= */

function SuccessNotice({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">

      <Check
        size={17}
        className="shrink-0"
      />

      {message}

    </div>
  );
}


/* =========================================================
   ERROR NOTICE
========================================================= */

function ErrorNotice({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}


/* =========================================================
   NORMALIZE MEMBER ORDER
========================================================= */

function normalizeMemberOrder(
  members: LeadershipMember[]
): LeadershipMember[] {
  return members.map(
    (member, index) => ({
      ...member,

      sort_order:
        index + 1,
    })
  );
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  return fallback;
}