import type { Metadata } from "next";

import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";

const dossier = requirePublishedDossier("ihealth-track-kn-550bt");

export const metadata: Metadata = {
  title: "iHealth Track KN-550BT Evidence Dossier",
  description: "Exact-model identity, FDA clearance K160014, validation, cuff packages, and the MDRank Score and category rank for iHealth Track KN-550BT under rubric upper-arm-home-bp-v1.0.0. Evidence Confidence stays separate.",
  alternates: { canonical: "/devices/ihealth-track-kn-550bt" },
  robots: { index: true, follow: true },
};

export default function IHealthTrackDossierPage() {
  return <EvidenceDossier dossier={dossier} />;
}
