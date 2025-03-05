import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [],
  },
  output: 'export', // 关键配置，必须有
  trailingSlash: true, // 避免路由解析错误
};

export default nextConfig;
