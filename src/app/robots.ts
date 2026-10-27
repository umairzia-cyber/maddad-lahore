import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://maddadgaar.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/files/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
