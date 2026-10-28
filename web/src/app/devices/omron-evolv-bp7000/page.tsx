import type { Metadata } from "next";

import { DossierSeo } from "@/components/DossierSeo";
import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";
import { approvedShareImage, socialMetadata } from "@/lib/pageMetadata";

const dossier = requirePublishedDossier("omron-evolv-bp7000");
const description = "Exact US identity, FDA clearance K162092, family-level validation caveat, and withheld MDRank Score and category rank for OMRON Evolv BP7000. Evidence Confidence stays Moderate and separate.";

export const metadata: Metadata = {
  title: "OMRON Evolv BP7000 Evidence Dossier",
  description,
  alternates: { canonical: "/devices/omron-evolv-bp7000" },
  robots: { index: true, follow: true },
  ...socialMetadata({
    title: "OMRON Evolv BP7000 Evidence Dossier",
    description,
    path: "/devices/omron-evolv-bp7000",
    ogType: "article",
    image: approvedShareImage(dossier.illustrativePhoto),
  }),
};

export default function OmronEvolvDossierPage() {
  return (
    <>
      <EvidenceDossier dossier={dossier} />
      <DossierSeo dossier={dossier} />
    </>
  );
}
