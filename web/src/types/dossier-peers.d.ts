declare module "@/lib/dossierPeers.mjs" {
  export const DOSSIER_PEER_MIN: number;
  export const DOSSIER_PEER_MAX: number;

  export type DossierPeerIdentity = {
    slug: string;
    name: string;
    model: string;
    manufacturer: string;
    category: string;
  };

  export function brandKey(manufacturer: string): string;
  export function isUpperArmCatalogDossier(dossier: DossierPeerIdentity): boolean;
  export function catalogPeerOrder<T extends DossierPeerIdentity>(catalog: readonly T[]): T[];
  export function selectDossierPeers<T extends DossierPeerIdentity>(catalog: readonly T[], slug: string): T[];
}
