"use client";

import {
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/Navbar";

export type ProductContentItem = {
  title: string;
  description: string;
};

type ProductContentListProps = {
  title: string;
  description?: string;
  items: ProductContentItem[];
  onChange: (
    items: ProductContentItem[]
  ) => void;
};

export default function ProductContentList({
  title,
  description,
  items,
  onChange,
}: ProductContentListProps) {
  /* ------------------------------------------------------------------------
     Add Item
     ------------------------------------------------------------------------ */

  function addItem() {
    onChange([
      ...items,
      {
        title: "",
        description: "",
      },
    ]);
  }

  /* ------------------------------------------------------------------------
     Update Item
     ------------------------------------------------------------------------ */

  function updateItem(
    index: number,
    field: keyof ProductContentItem,
    value: string
  ) {
    const updatedItems =
      items.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        return {
          ...item,
          [field]: value,
        };
      });

    onChange(updatedItems);
  }

  /* ------------------------------------------------------------------------
     Delete Item
     ------------------------------------------------------------------------ */

  function deleteItem(
    index: number
  ) {
    const updatedItems =
      items.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    onChange(updatedItems);
  }

  /* ------------------------------------------------------------------------
     Render
     ------------------------------------------------------------------------ */

  return (
    
    <section

      className="
        rounded-2xl
        border border-gray-200
        bg-white
        p-6
        shadow-sm
      "
    >
      
      {/* Header */}

      <div
        className="
          flex flex-col
          gap-4
          sm:flex-row
          sm:items-start
          sm:justify-between
        "
      >
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-gray-900
            "
          >
            {title}
          </h2>

          {description && (
            <p
              className="
                mt-1
                max-w-2xl
                text-sm
                leading-6
                text-gray-500
              "
            >
              {description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={addItem}
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
            hover:bg-[#09543f]
          "
        >
          <Plus size={17} />

          Add Item
        </button>
      </div>

      {/* Empty State */}

      {items.length === 0 ? (
        <div
          className="
            mt-6
            rounded-xl
            border
            border-dashed
            border-gray-300
            bg-gray-50
            px-6
            py-10
            text-center
          "
        >
          <p
            className="
              text-sm
              font-medium
              text-gray-600
            "
          >
            No items added yet.
          </p>

          <p
            className="
              mt-1
              text-xs
              text-gray-400
            "
          >
            Click Add Item to create
            the first entry.
          </p>
        </div>
      ) : (
        <div
          className="
            mt-6
            space-y-4
          "
        >
          {items.map(
            (item, index) => (
              <div
                key={index}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50/60
                  p-4
                "
              >
                {/* Item Header */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    justify-between
                    gap-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <GripVertical
                      size={18}
                      className="
                        text-gray-300
                      "
                    />

                    <span
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-gray-400
                      "
                    >
                      Item {index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      deleteItem(index)
                    }
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      px-3
                      py-2
                      text-xs
                      font-semibold
                      text-red-600
                      transition
                      hover:bg-red-50
                    "
                  >
                    <Trash2
                      size={15}
                    />

                    Delete
                  </button>
                </div>

                <div
                  className="
                    grid
                    gap-4
                  "
                >
                  {/* Title */}

                  <div>
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
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
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter title..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        text-gray-900
                        outline-none
                        transition
                        focus:border-[#073f30]
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>

                  {/* Description */}

                  <div>
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        text-gray-700
                      "
                    >
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
                          event.target
                            .value
                        )
                      }
                      placeholder="Enter description..."
                      className="
                        w-full
                        resize-y
                        rounded-xl
                        border
                        border-gray-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        leading-6
                        text-gray-900
                        outline-none
                        transition
                        focus:border-[#073f30]
                        focus:ring-2
                        focus:ring-green-100
                      "
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}