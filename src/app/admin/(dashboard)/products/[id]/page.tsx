import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import ProductForm from "@/components/admin/products/ProductForm";
import ProductActions from "@/components/admin/products/ProductActions";

import type { ProductStatus } from "@/types/product";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getProductStatus(status: unknown): ProductStatus {
  if (
    status === "draft" ||
    status === "published" ||
    status === "archived"
  ) {
    return status;
  }

  return "draft";
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  /* ====================================================================== */
  /* GET PRODUCT ID                                                         */
  /* ====================================================================== */

  const { id } = await params;

  /* ====================================================================== */
  /* SUPABASE                                                               */
  /* ====================================================================== */

  const supabase = await createClient();

  /* ====================================================================== */
  /* LOAD PRODUCT                                                           */
  /* ====================================================================== */

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  /* ====================================================================== */
  /* HANDLE ERROR / NOT FOUND                                               */
  /* ====================================================================== */

  if (error) {
    console.error("Unable to load product:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  if (error || !product) {
    notFound();
  }

  const productStatus = getProductStatus(product.status);

  /* ====================================================================== */
  /* PAGE                                                                   */
  /* ====================================================================== */

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">

        {/* ================================================================ */}
        {/* BACK LINK                                                        */}
        {/* ================================================================ */}

        <Link
          href="/admin/products"
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            text-green-700
            transition
            hover:text-green-800
          "
        >
          ← Back to products
        </Link>

        {/* ================================================================ */}
        {/* PAGE HEADER                                                      */}
        {/* ================================================================ */}

        <div className="mb-8 mt-6">
          <p
            className="
              text-sm
              font-semibold
              uppercase
              tracking-wide
              text-green-700
            "
          >
            Product Management
          </p>

          <h1
            className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-gray-900
            "
          >
            Edit Product
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-500
            "
          >
            Update product information, media, features,
            benefits, buttons, SEO and publishing settings.
          </p>
        </div>

        {/* ================================================================ */}
        {/* PRODUCT FORM                                                     */}
        {/* ================================================================ */}

        <ProductForm
          mode="edit"
          productId={product.id}
          initialData={{
            /* ------------------------------------------------------------ */
            /* BASIC INFORMATION                                            */
            /* ------------------------------------------------------------ */

            name: product.name ?? "",

            slug: product.slug ?? "",

            category:
              product.category ?? "Software",

            shortDescription:
              product.short_description ?? "",

            description:
              product.description ?? "",

            /* ------------------------------------------------------------ */
            /* MEDIA                                                        */
            /* ------------------------------------------------------------ */

            imageUrl:
              product.image_url ?? "",

            gallery:
              Array.isArray(product.gallery)
                ? product.gallery
                : [],

            /* ------------------------------------------------------------ */
            /* PRODUCT CONTENT                                              */
            /* ------------------------------------------------------------ */

            features:
              Array.isArray(product.features)
                ? product.features
                : [],

            benefits:
              Array.isArray(product.benefits)
                ? product.benefits
                : [],

            /* ------------------------------------------------------------ */
            /* SEO                                                          */
            /* ------------------------------------------------------------ */

            seoTitle:
              product.seo_title ?? "",

            seoDescription:
              product.seo_description ?? "",

            seoKeywords:
              product.seo_keywords ?? "",

            seoImageUrl:
              product.seo_image_url ?? "",

            /* ------------------------------------------------------------ */
            /* PRODUCT BUTTONS                                              */
            /* ------------------------------------------------------------ */

            primaryButtonText:
              product.primary_button_text ??
              "Request a Demo",

            primaryButtonUrl:
              product.primary_button_url ??
              "/contact",

            secondaryButtonText:
              product.secondary_button_text ??
              "Learn More",

            secondaryButtonUrl:
              product.secondary_button_url ??
              "#overview",

            /* ------------------------------------------------------------ */
            /* PUBLISHING                                                   */
            /* ------------------------------------------------------------ */

            status: productStatus,

            featured:
              product.featured ?? false,

            sortOrder:
              product.sort_order ?? 0,
          }}
        />

        {/* ================================================================ */}
        {/* PRODUCT ACTIONS                                                  */}
        {/* ================================================================ */}

        <div className="mt-8 pb-10">
          <ProductActions
            productId={product.id}
            productName={product.name ?? "Product"}
            status={productStatus}
          />
        </div>
      </div>
    </main>
  );
}