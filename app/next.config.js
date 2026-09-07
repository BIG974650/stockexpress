/** @type {import('next').NextConfig} */
const nextConfig = {
  // Autorise les connexions via des tunnels externes (comme Serveo ou Ngrok)
  allowedDevOrigins: ['*.serveousercontent.com', '*.loca.lt', '*.pinggy.link'],
};

module.exports = nextConfig;