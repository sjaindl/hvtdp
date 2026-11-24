export type MemberType = 'Aktiv' | 'Fördernd' | 'Kids';

export interface Member {
  firstName: string;
  lastName: string;
  type: MemberType;
}
