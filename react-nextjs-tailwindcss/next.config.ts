import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // For Static Export
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    // Additional Sass options can go here
  },
};

export default nextConfig;