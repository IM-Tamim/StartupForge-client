/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/my-startup", destination: "http://localhost:5000/api/my-startup" },
      { source: "/api/startups/:path*", destination: "http://localhost:5000/api/startups/:path*" },
      { source: "/api/opportunities/:path*", destination: "http://localhost:5000/api/opportunities/:path*" },
      { source: "/api/applications/:path*", destination: "http://localhost:5000/api/applications/:path*" },
      { source: "/api/users/:path*", destination: "http://localhost:5000/api/users/:path*" },
      { source: "/api/admin/:path*", destination: "http://localhost:5000/api/admin/:path*" },
      { source: "/api/payments", destination: "http://localhost:5000/api/payments" },
      { source: "/api/payments/:path*", destination: "http://localhost:5000/api/payments/:path*" },
    ];
  },
};

export default nextConfig;
