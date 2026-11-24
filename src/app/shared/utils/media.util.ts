import { environment } from '../../../environments/environment';

/** Responsive sizes Strapi creates for uploaded images (see config/plugins.js in the Strapi repo). */
export type MediaSize = 'thumbnail' | 'small' | 'medium' | 'large';

interface StrapiFormat {
  url: string;
  width: number;
  height: number;
}

/** A file from the Strapi media library, as returned with `populate`. */
export interface StrapiMedia {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: Partial<Record<MediaSize, StrapiFormat>> | null;
}

const SIZES: MediaSize[] = ['thumbnail', 'small', 'medium', 'large'];

/** Resolves CMS-relative paths (e.g. /uploads/x.jpg) against the CMS host. */
export function resolveCmsUrl(url: string): string {
  return url.startsWith('/') ? environment.cmsUrl + url : url;
}

/**
 * URL of a media file in the requested size: the requested format, else the next larger one Strapi
 * created (small images have no large formats), else the original. Without `size` the original is used.
 */
export function mediaUrl(media: StrapiMedia | null | undefined, size?: MediaSize): string | null {
  if (!media?.url) {
    return null;
  }
  if (size && media.formats) {
    const format = SIZES.slice(SIZES.indexOf(size))
      .map((name) => media.formats?.[name])
      .find((candidate) => candidate?.url);
    if (format) {
      return resolveCmsUrl(format.url);
    }
  }
  return resolveCmsUrl(media.url);
}
