"use client";

import {
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  ServiceContentItem,
} from "@/types/service";

type ServiceContentListProps = {
  title: string;
  description: string;
  itemLabel?: string;
  items: ServiceContentItem[];
  onChange: (
    items: ServiceContentItem[]
  ) => void;
};

export default function ServiceContentList({
  title,
  description,
  itemLabel = "Item",
  items,
  onChange,
}: ServiceContentListProps) {
  function addItem() {
    onChange([
      ...items,
      {
        title: "",
        description: "",
      },
    ]);
  }

  function updateItem(
    index: number,
    field: keyof ServiceContentItem,
    value: string
  ) {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    onChange(updated);
  }

  function removeItem(
    index: number
  ) {
    onChange(
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            {description}
          </p>
        </div>

        <button
          type="button"
          onClick={addItem}
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-50 px-4 py-2.5 text-sm font-semibold text-[#073f30] transition hover:bg-green-100"
        >
          <Plus size={16} />

          Add {itemLabel}
        </button>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
          <p className="text-sm font-medium text-gray-600">
            No {title.toLowerCase()} added yet.
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Click Add {itemLabel} to create the first one.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map(
            (item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-gray-50/50 p-4"
              >
                <div className="flex gap-3">
                  <div className="pt-3 text-gray-300">
                    <GripVertical
                      size={18}
                    />
                  </div>

                  <div className="min-w-0 flex-1 space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Title
                      </label>

                      <input
                        type="text"
                        value={
                          item.title
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "title",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder={`${itemLabel} title`}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#073f30] focus:ring-2 focus:ring-green-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Description
                      </label>

                      <textarea
                        rows={3}
                        value={
                          item.description
                        }
                        onChange={(
                          event
                        ) =>
                          updateItem(
                            index,
                            "description",
                            event
                              .target
                              .value
                          )
                        }
                        placeholder={`Describe this ${itemLabel.toLowerCase()}...`}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-[#073f30] focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        index
                      )
                    }
                    title={`Delete ${itemLabel}`}
                    className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2
                      size={17}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}