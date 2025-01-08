/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "localhost",
            "bashable.art",
            "bashableart.s3.us-east-1.amazonaws.com",
            "avatars.charhub.io",
        ],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    swcMinify: false,
};

module.exports = nextConfig;
