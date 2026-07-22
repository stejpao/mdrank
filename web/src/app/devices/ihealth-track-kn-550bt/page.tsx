import type { Metadata } from "next";

import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";

const dossier = requirePublishedDossier("ihealth-track-kn-550bt");

export const metadata: Metadata = {
  title: "iHealth Track KN-550BT Evidence Dossier",
  description: "Exact-model identity, FDA clearance, clinical validation, cuff packages, HSA/FSA evidence, limitations, and withheld score status for iHealth Track KN-550BT.",
  alternates: { canonical: "/devices/ihealth-track-kn-550bt" },
  robots: { index: true, follow: true },
};

export default function IHealthTrackDossierPage() {
  return <EvidenceDossier dossier={dossier} />;
}
