import type { Metadata } from "next";

import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";

const dossier = requirePublishedDossier("omron-evolv-bp7000");

export const metadata: Metadata = {
  title: "OMRON Evolv BP7000 Evidence Dossier",
  description: "Exact US identity, FDA clearance K162092, family-level validation caveat, and withheld MDRank Score and category rank for OMRON Evolv BP7000. Evidence Confidence stays Moderate and separate.",
  alternates: { canonical: "/devices/omron-evolv-bp7000" },
  robots: { index: true, follow: true },
};

export default function OmronEvolvDossierPage() {
  return <EvidenceDossier dossier={dossier} />;
}
