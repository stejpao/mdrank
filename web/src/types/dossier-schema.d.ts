declare module "@/lib/dossierSchema.mjs" {
  export type DossierFaq = {
    question: string;
    answer: string;
  };

  export type DossierSchemaInput = {
    slug: string;
    name: string;
    model: string;
    manufacturer: string;
    brand: string;
    category: string;
    description: string;
    faqs: DossierFaq[];
    asin?: string | null;
    offerUrl?: string | null;
    offerNote?: string | null;
    image?: string | null;
  };

  export function scoreStatusFaq(score: {
    scoreStatus: string;
    rankStatus: string;
    scoreLabel: string;
    rankLabel: string;
    rankDetail: string;
    rubricVersion: string;
    evidenceConfidence: string;
  }): DossierFaq;

  export function buildDossierStructuredData(
    input: DossierSchemaInput,
  ): Array<Record<string, unknown>>;
}
