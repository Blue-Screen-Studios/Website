export const DISCORD_GUILD_ID = "888875214459535360";

// Used when the server widget has no invite channel set (instant_invite is null).
// Paste a permanent invite like "https://discord.gg/abc123" here. With an invite set,
// the page also shows the total member count.
export const DISCORD_INVITE_URL = "";

export interface WidgetMember {
  id: string;
  username: string;
  status: "online" | "idle" | "dnd";
  avatar_url: string;
  channel_id?: string;
}

export interface WidgetChannel {
  id: string;
  name: string;
  position: number;
}

export interface Widget {
  id: string;
  name: string;
  instant_invite: string | null;
  channels: WidgetChannel[];
  members: WidgetMember[];
  presence_count: number;
}

export async function fetchWidget(signal?: AbortSignal): Promise<Widget> {
  const res = await fetch(`https://discord.com/api/guilds/${DISCORD_GUILD_ID}/widget.json`, { signal });
  if (!res.ok) throw new Error(`Discord widget request failed (${res.status})`);
  return res.json();
}

/** Total member count via the invite endpoint; the widget only reports online members. */
export async function fetchMemberCount(inviteUrl: string, signal?: AbortSignal): Promise<number | null> {
  const code = inviteUrl.split("/").filter(Boolean).pop();
  if (!code) return null;
  const res = await fetch(`https://discord.com/api/v10/invites/${code}?with_counts=true`, { signal });
  if (!res.ok) return null;
  const data: { approximate_member_count?: number } = await res.json();
  return data.approximate_member_count ?? null;
}
