import Link from "next/link";

import {
  Package,
  Plus,
  Star,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", {
      ascending: true,
    });

    console.log("PRODUCTS RESULT:", products);
    console.log("PRODUCTS ERROR:", error);

    const {
    data: { user },
    error: userError,
    } = await supabase.auth.getUser();

console.log("PRODUCT PAGE USER:", user?.email);
console.log("PRODUCT PAGE USER ERROR:", userError);


  if (error) {
    console.error("Unable to load products:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Products
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage products displayed on the Green Lunar website.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="
            inline-flex items-center justify-center gap-2
            rounded-xl bg-[#073f30]
            px-5 py-2.5
            text-sm font-semibold text-white
            shadow-sm transition
            hover:bg-[#09543f]
          "
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* PRODUCT TABLE */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="border-b border-gray-200 bg-gray-50">

              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Featured
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Action
                </th>
              </tr>

            </thead>

            <tbody className="divide-y divide-gray-100">

              {products?.map((product) => (
                <tr
                  key={product.id}
                  className="transition hover:bg-gray-50"
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-4">

                      <div className="
                        flex h-12 w-12 shrink-0
                        items-center justify-center
                        overflow-hidden rounded-xl
                        bg-green-50
                      ">

                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package
                            size={21}
                            className="text-[#073f30]"
                          />
                        )}

                      </div>

                      <div className="min-w-0">

                        <p className="font-semibold text-gray-900">
                          {product.name}
                        </p>

                        <p className="mt-1 max-w-[350px] truncate text-sm text-gray-500">
                          {product.short_description ||
                            "No description"}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.category || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <ProductStatusBadge
                      status={product.status}
                    />
                  </td>

                  <td className="px-6 py-4">

                    {product.featured ? (
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600">
                        <Star
                          size={16}
                          fill="currentColor"
                        />
                        Featured
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">
                        —
                      </span>
                    )}

                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.sort_order}
                  </td>

                  <td className="px-6 py-4 text-right">

                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-sm font-semibold text-[#073f30] hover:underline"
                    >
                      Edit
                    </Link>

                  </td>

                </tr>
              ))}

              {!error && !products?.length && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <Package
                      size={38}
                      className="mx-auto text-gray-300"
                    />

                    <p className="mt-4 font-semibold text-gray-700">
                      No products yet
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Add your first Green Lunar product.
                    </p>
                  </td>
                </tr>
              )}

              {error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm font-medium text-red-600"
                  >
                    Unable to load products.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function ProductStatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<string, string> = {
    draft:
      "bg-amber-50 text-amber-700",
    published:
      "bg-green-50 text-green-700",
    archived:
      "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`
        inline-flex rounded-full
        px-3 py-1
        text-xs font-semibold capitalize
        ${
          styles[status] ??
          "bg-gray-100 text-gray-600"
        }
      `}
    >
      {status}
    </span>
  );
}