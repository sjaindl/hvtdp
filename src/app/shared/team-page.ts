/** Single type `team-page` in Strapi: "as of" dates (ISO, e.g. "2025-12-01") of the squad and member lists. */
export interface TeamPage {
  squadAsOf: string | null;
  activeMembersAsOf: string | null;
  supportingMembersAsOf: string | null;
  kidsMembersAsOf: string | null;
}
