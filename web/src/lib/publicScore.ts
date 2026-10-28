import scores from "@/data/publicScores.json";

export type PublicScoreDevice = (typeof scores.devices)[number];

export function listPublicScores(): PublicScoreDevice[] {
  return scores.devices;
}

export function getPublicScore(slug: string): PublicScoreDevice {
  const row = scores.devices.find((device) => device.slug === slug);
  if (!row) throw new Error(`No scorer projection for ${slug}.`);
  return row;
}

export const publicRubricVersion = scores.rubricVersion;
