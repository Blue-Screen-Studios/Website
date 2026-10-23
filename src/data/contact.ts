export const CONTACT_EMAIL = "contact@bluescreenstudios.net";

export function contactMailto(subject?: string) {
  return `mailto:${CONTACT_EMAIL}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
}
