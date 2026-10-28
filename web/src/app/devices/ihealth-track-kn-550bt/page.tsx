import type { Metadata } from "next";

import { DossierSeo } from "@/components/DossierSeo";
import { EvidenceDossier } from "@/components/EvidenceDossier";
import { requirePublishedDossier } from "@/data/publishedDossiers";
import { approvedShareImage, socialMetadata } from "@/lib/pageMetadata";

const dossier = requirePublishedDossier("ihealth-track-kn-550bt");
const description = "Exact-model identity, FDA clearance K160014, validation, cuff packages, and the MDRank Score and category rank for iHealth Track KN-550BT under rubric upper-arm-home-bp-v1.0.0. Evidence Confidence stays separate.";

export const metadata: Metadata = {
  title: "iHealth Track KN-550BT Evidence Dossier",
  description,
  alternates: { canonical: "/devices/ihealth-track-kn-550bt" },
  robots: { index: true, follow: true },
  ...socialMetadata({
    title: "iHealth Track KN-550BT Evidence Dossier",
    description,
    path: "/devices/ihealth-track-kn-550bt",
    ogType: "article",
    image: approvedShareImage(dossier.illustrativePhoto),
  }),
};

export default function IHealthTrackDossierPage() {
  return (
    <>
      <EvidenceDossier dossier={dossier} />
      <DossierSeo dossier={dossier} />
    </>
  );
}
