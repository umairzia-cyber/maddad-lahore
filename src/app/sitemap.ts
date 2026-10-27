import { MetadataRoute } from "next";
import { categoriesAndAreas, browsePublicJobs } from "@/lib/jobs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://maddadgaar.vercel.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/?view=browse`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/?view=marketplace`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/?view=hire`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  try {
    const [{ categories }, publicJobs] = await Promise.all([
      categoriesAndAreas().catch(() => ({ categories: [] })),
      browsePublicJobs().catch(() => []),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/?category=${c.id}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const jobRoutes: MetadataRoute.Sitemap = publicJobs.slice(0, 50).map((j) => ({
      url: `${baseUrl}/jobs/${j.id}`,
      lastModified: new Date(j.created_at),
      changeFrequency: "daily",
      priority: 0.7,
    }));

    return [...staticRoutes, ...categoryRoutes, ...jobRoutes];
  } catch {
    return staticRoutes;
  }
}
