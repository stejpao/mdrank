import { buildPublicPageSchema } from "@/lib/publicPageSchema.mjs";

function jsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function PublicPageJsonLd({ path }: { path: string }) {
  const nodes = buildPublicPageSchema(path);
  return (
    <>
      {nodes.map((node) => (
        <script
          key={String(node["@type"])}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(node) }}
        />
      ))}
    </>
  );
}
