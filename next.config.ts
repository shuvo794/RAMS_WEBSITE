/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.ramsint.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "**",
      },

      {
        protocol: "http",
        hostname: "192.168.68.129",
        port: "8006",
      },

      {
        protocol: "http",
        hostname: "92.204.172.226",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default nextConfig;
