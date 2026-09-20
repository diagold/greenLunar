import Link from "next/link";

import {
  ArrowLeft,
  PackagePlus,
} from "lucide-react";

import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">

      <div className="mb-8">

        <Link
          href="/admin/products"
          className="
            mb-5 inline-flex
            items-center gap-2
            text-sm font-medium
            text-gray-500
            transition
            hover:text-[#073f30]
          "
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="flex items-start gap-4">

          <div className="
            flex h-12 w-12
            shrink-0 items-center
            justify-center
            rounded-xl bg-green-50
            text-[#073f30]
          ">
            <PackagePlus size={22} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add Product
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create and publish a new Green Lunar
              product.
            </p>
          </div>

        </div>

      </div>

      <ProductForm />

    </div>
  );
}