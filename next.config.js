/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow complaint images stored on Cloudinary to be displayed
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
};

module.exports = nextConfig;
