import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DossierSeo } from "@/components/DossierSeo";
import { EvidenceDossier } from "@/components/EvidenceDossier";
import { getPublishedDossier, publishedDossiers } from "@/data/publishedDossiers";
import { approvedShareImage, socialMetadata } from "@/lib/pageMetadata";

const DEDICATED_ROUTES = new Set(["ihealth-track-kn-550bt", "omron-evolv-bp7000"]);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return publishedDossiers
    .filter((dossier) => !DEDICATED_ROUTES.has(dossier.slug))
    .map((dossier) => ({ slug: dossier.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dossier = getPublishedDossier(slug);
  if (!dossier) return {};
  const title = `${dossier.name} Evidence Dossier`;
  const description = dossier.directAnswer;
  return {
    title,
    description,
    alternates: { canonical: `/devices/${slug}` },
    robots: { index: true, follow: true },
    ...socialMetadata({
      title,
      description,
      path: `/devices/${slug}`,
      ogType: "article",
      image: approvedShareImage(dossier.illustrativePhoto),
    }),
  };
}

export default async function PublishedDossierPage({ params }: PageProps) {
  const { slug } = await params;
  const dossier = getPublishedDossier(slug);
  if (!dossier) notFound();
  return (
    <>
      <EvidenceDossier dossier={dossier} />
      <DossierSeo dossier={dossier} />
    </>
  );
}
