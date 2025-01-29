/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["www.pngplay.com", "https://randomuser.me"], 
        remotePatterns: [
            {
              protocol: "https",
              hostname: "randomuser.me",
            },
          ],
    },
};

export default nextConfig;
