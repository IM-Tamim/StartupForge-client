const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async rewrites() {
    return [
      { source: "/api/my-startup", destination: `${API_URL}/api/my-startup` },
      { source: "/api/startups/:path*", destination: `${API_URL}/api/startups/:path*` },
      { source: "/api/opportunities/:path*", destination: `${API_URL}/api/opportunities/:path*` },
      { source: "/api/applications/:path*", destination: `${API_URL}/api/applications/:path*` },
      { source: "/api/users/:path*", destination: `${API_URL}/api/users/:path*` },
      { source: "/api/admin/:path*", destination: `${API_URL}/api/admin/:path*` },
      { source: "/api/payments", destination: `${API_URL}/api/payments` },
      { source: "/api/payments/:path*", destination: `${API_URL}/api/payments/:path*` },
      { source: "/api/stats", destination: `${API_URL}/api/stats` },
    ];
  },
};

export default nextConfig;