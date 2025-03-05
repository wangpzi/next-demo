import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [], // 如果你需要允许的图像域名，可以在这里填入
  },
  output: 'export', // 关键配置
  trailingSlash: true, // 强制路由末尾加斜杠
};

export default nextConfig;
