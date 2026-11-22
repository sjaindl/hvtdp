export type MemberType = 'Aktiv' | 'Fördernd' | 'Kids';

export interface Member {
  firstName: string;
  lastName: string;
  type: MemberType;
  /** ISO date ("2024-07-01"); the latest date of a group is shown as the list's "Stand". */
  since: string | null;
}
