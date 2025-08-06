import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "7ringsstore.com",
        port: "",
        pathname: "/store/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;