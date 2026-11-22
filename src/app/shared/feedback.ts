export interface Feedback {
  firstname: string;
  lastname: string;
  email: string;
  agreeContact: boolean;
  agreeGDPR: boolean;
  message: string;
}

/** Sign-up form of the tournaments (Bigdarts, Boccia, Kleinfeldturnier). */
export interface TeamRegistration {
  name: string;
  email: string;
  teamname: string;
  phone?: string;
}

/** Sign-up form of the duck race. */
export interface DuckrunRegistration {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  duckcount: number;
}
