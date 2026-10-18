
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  UsersRound,
  UserRound,
} from "lucide-react";

import LeadershipProfileModal from "./LeadershipProfileModal";

export interface ExecutiveMember {
  id: string;
  name: string;
  role: string;
  image_url?: string | null;
  image_alt?: string | null;
  description?: string | null;
  biography?: string | null;
  profile_url?: string | null;
}

export interface ExecutiveLeadershipSettings {
  executives_eyebrow?: string | null;
  executives_heading?: string | null;
  team_description?: string | null;
  team_label?: string | null;
}

interface ExecutiveLeadershipProps {
  leadership: ExecutiveLeadershipSettings;
  leadershipMembers: ExecutiveMember[];
}

export default function ExecutiveLeadership({
  leadership,
  leadershipMembers,
}: ExecutiveLeadershipProps) {
  const [selectedMember, setSelectedMember] =
    useState<ExecutiveMember | null>(null);

  return (
    <>
      <section className="flex items-center justify-center px-6 pb-12 pt-10 sm:px-8 lg:px-10 lg:pb-14 lg:pt-12">
        <div className="mx-auto w-full max-w-7xl">

          {/* SECTION HEADING */}
          <div className="text-center">
            {leadership.executives_eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
                {leadership.executives_eyebrow}
              </p>
            )}

            {leadership.executives_heading && (
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
                {leadership.executives_heading}
              </h3>
            )}
          </div>

          {/* EXECUTIVE CARDS */}
          {leadershipMembers.length > 0 && (
            <div className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 justify-center gap-8 md:grid-cols-2 xl:grid-cols-3">
              {leadershipMembers.map((member) => (
                <article
                  key={member.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                >
                  {/* CLICKABLE IMAGE */}
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    aria-label={`View ${member.name} profile`}
                    className="relative block h-[300px] w-full cursor-pointer overflow-hidden bg-gray-100"
                  >
                    {member.image_url ? (
                      <img
                        src={member.image_url}
                        alt={
                          member.image_alt ||
                          member.name
                        }
                        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gray-100">
                        <UserRound
                          size={72}
                          strokeWidth={1}
                          className="text-gray-300"
                        />
                      </div>
                    )}
                  </button>

                  {/* NAME + ROLE */}
                  <div className="relative z-10 mx-4 -mt-9 rounded-md bg-[#063d2b] px-4 py-4 text-center shadow-lg">
                    <h4 className="text-lg font-semibold uppercase tracking-wide text-white">
                      {member.name}
                    </h4>

                    <p className="mt-1 text-xs font-medium text-white/85">
                      {member.role}
                    </p>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="px-5 pb-5 pt-7 text-center">
                    {member.description && (
                    <p className="line-clamp-3 min-h-[84px] text-sm leading-7 text-gray-600">
                        {member.description}
                    </p>
                    )}

                    {/* PROFILE POPUP BUTTON */}
                  <button
  type="button"
  onClick={() => setSelectedMember(member)}
  aria-label={`Read full profile of ${member.name}`}
  className="group/icon mx-auto mt-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-green-700 transition-all duration-300 hover:-translate-y-1 hover:border-[#063d2b] hover:bg-[#063d2b] hover:text-white hover:shadow-md"
>
  <ArrowUpRight size={20} />
</button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* WIDER EXECUTIVE TEAM */}
          {(leadership.team_description ||
            leadership.team_label) && (
            <div className="mx-auto mt-8 flex max-w-5xl flex-col gap-5 rounded-xl bg-[#ecfdf5] px-6 py-6 md:flex-row md:items-center md:justify-between lg:px-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-green-700 shadow-sm">
                  <UsersRound size={22} />
                </div>

                {leadership.team_description && (
                  <p className="max-w-3xl text-sm leading-7 text-gray-600">
                    {leadership.team_description}
                  </p>
                )}
              </div>

              {leadership.team_label && (
                <div className="shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                    {leadership.team_label}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* EXECUTIVE PROFILE MODAL */}
      <LeadershipProfileModal
        leader={
          selectedMember
            ? {
                id: selectedMember.id,
                name: selectedMember.name,
                position: selectedMember.role,
                image_url: selectedMember.image_url,
                biography:
                  selectedMember.biography ||
                  selectedMember.description,
              }
            : null
        }
        onClose={() => setSelectedMember(null)}
      />
    </>
  );
}
