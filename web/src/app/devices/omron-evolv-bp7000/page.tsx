import type { Metadata } from "next";

import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";

const dossier = requirePublishedDossier("omron-evolv-bp7000");

export const metadata: Metadata = {
  title: "OMRON Evolv BP7000 Evidence Dossier",
  description: "Exact US identity, regulatory evidence, family-level validation caveat, cuff fit, limitations, and withheld score status for OMRON Evolv BP7000.",
  alternates: { canonical: "/devices/omron-evolv-bp7000" },
  robots: { index: true, follow: true },
};

export default function OmronEvolvDossierPage() {
  return <EvidenceDossier dossier={dossier} />;
}
