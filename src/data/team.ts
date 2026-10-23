export interface TeamMember {
  name: string;
  role: string;
  /** Path in /public, e.g. "/team/nathan.jpg". Falls back to initials when omitted. */
  photo?: string;
}

export const team: TeamMember[] = [
  { name: "Tony Donahue", role: "Studio Director" },
  { name: "Nathan Schmitt", role: "Technical Director / Software Engineer", photo: "/nathan_pfp.jpg" },
];

export const openRoles: string[] = ["Accountant", "Community Manager"];
