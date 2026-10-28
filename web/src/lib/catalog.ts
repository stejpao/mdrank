const WRIST_OR_OPTICAL = /\bwrist\b|\boptical\b/i;
const UPPER_ARM = /\bupper-arm\b|\bupper arm\b/i;

export type UpperArmCatalogIdentity = {
  name: string;
  model: string;
  category: string;
};

export function isPublicUpperArmDossier(dossier: UpperArmCatalogIdentity): boolean {
  const identity = `${dossier.category} ${dossier.name} ${dossier.model}`;
  if (WRIST_OR_OPTICAL.test(identity)) return false;
  return UPPER_ARM.test(identity);
}
