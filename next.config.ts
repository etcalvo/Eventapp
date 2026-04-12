import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/Eventapp",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
