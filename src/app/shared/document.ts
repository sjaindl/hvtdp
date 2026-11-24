export type DocumentCategory = 'Allgemein' | 'Turnierergebnisse' | 'Protokolle';

export interface HvtdpDocument {
  /** Strapi documentId, used for the download endpoint. */
  id: string;
  /** Stable key linking fixed documents to the website, e.g. "beitrittserklaerung". */
  slug: string | null;
  title: string;
  /** ISO date ("2024-08-21"); general documents have none. */
  date: string | null;
  category: DocumentCategory;
  /** URL of the PDF; null for protected documents, which are only available via the download endpoint. */
  url: string | null;
  /** Opened only with the members' password. */
  protected: boolean;
}
