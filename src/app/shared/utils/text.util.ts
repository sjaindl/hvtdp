export class TextUtil {
  /** Plain-text teaser from a Markdown news body (drops headings, images, links and formatting). */
  static excerpt(markdown: string, maxLength = 150): string {
    const text = (markdown ?? '')
      .replace(/^#{1,6}\s.*$/gm, ' ')
      .replace(/!\[[^\]]*]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]*)]\([^)]*\)/g, '$1')
      .replace(/[*_`>~]/g, '')
      .replace(/^\s*(\d+\.|[-+])\s+/gm, '')
      .replace(/\\([.\-!#])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length <= maxLength) {
      return text;
    }
    const cut = text.slice(0, maxLength);
    return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.\-–]$/, '') + ' …';
  }

  /** "STRAUSS" -> "Strauss", keeps already mixed-case words (e.g. "GmbH", "Di") untouched. */
  static titleCase(value: string): string {
    return (value ?? '').replace(/\p{Lu}{2,}/gu, (word) =>
      word
        .split('-')
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join('-')
    );
  }

  static initials(firstName: string, lastName: string): string {
    return `${(firstName ?? '').charAt(0)}${(lastName ?? '').charAt(0)}`.toUpperCase();
  }

  /** Estimated reading time in minutes (200 words per minute). */
  static readingMinutes(markdown: string): number {
    const words = (markdown ?? '').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }
}
