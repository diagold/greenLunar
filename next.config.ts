import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudinary images
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/diobpauw/image/upload/**",
      },

      // Supabase Storage images
      {
        protocol: "https",
        hostname: "zcdotrsfgvyyglavkrmb.supabase.co",
        pathname: "/storage/v1/object/public/news-images/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;