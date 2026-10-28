import type { Metadata } from "next";

const SITE_NAME = "MDRank";
const SITE_ORIGIN = "https://mdrank.org";
const APPROVED_PHOTO_CAPTION = "*Photo edited for clarity.";

export function canonicalUrl(path: string): string {
  if (path === "/") return SITE_ORIGIN;
  return `${SITE_ORIGIN}${path}`;
}

export type ShareImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

/** Real-use dossier photo already approved for publication. No invented artwork. */
export function approvedShareImage(
  photo:
    | {
        src: string;
        alt: string;
        width: number;
        height: number;
        caption: string;
      }
    | undefined,
): ShareImage | undefined {
  if (!photo || photo.caption !== APPROVED_PHOTO_CAPTION) return undefined;
  return {
    url: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
  };
}

/**
 * Open Graph and Twitter card tags. `title` is the page title before the
 * layout template; the social title matches the rendered `<title>`.
 * `path` "/" stays on the bare origin so og:url matches the home canonical.
 */
export function socialMetadata(input: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  image?: ShareImage;
}): Pick<Metadata, "openGraph" | "twitter"> {
  const socialTitle = input.path === "/" ? input.title : `${input.title} | ${SITE_NAME}`;
  const image = input.image
    ? [
        {
          url: input.image.url,
          alt: input.image.alt,
          width: input.image.width,
          height: input.image.height,
        },
      ]
    : undefined;

  return {
    openGraph: {
      title: { absolute: socialTitle },
      description: input.description,
      url: canonicalUrl(input.path),
      type: input.ogType ?? "website",
      siteName: SITE_NAME,
      ...(image ? { images: image } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: { absolute: socialTitle },
      description: input.description,
      ...(image ? { images: image } : {}),
    },
  };
}
