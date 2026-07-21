import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-21T00:00:00Z");
  return [
    { url: "https://mdrank.org/", lastModified, changeFrequency: "weekly", priority: 1 },
    { url: "https://mdrank.org/methodology", lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://mdrank.org/evidence-status", lastModified, changeFrequency: "weekly", priority: 0.8 },
  ];
}
