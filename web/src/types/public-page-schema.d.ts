declare module "@/lib/publicPageSchema.mjs" {
  export function canonicalUrl(path: string): string;
  export function buildPublicPageSchema(path: string): Array<Record<string, unknown>>;
  export const publicIndexPaths: string[];
}
