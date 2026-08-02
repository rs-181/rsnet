export const SOCIAL_PLATFORMS = {
  instagram: { label: "Instagram", icon: "📷" },
  x: { label: "X / Twitter", icon: "✕" },
  facebook: { label: "Facebook", icon: "📘" },
  youtube: { label: "YouTube", icon: "▶" },
  tiktok: { label: "TikTok", icon: "🎵" },
  linkedin: { label: "LinkedIn", icon: "in" },
  website: { label: "Website / Other", icon: "🔗" },
};

export const SOCIAL_PLATFORM_ORDER = [
  "instagram",
  "x",
  "facebook",
  "youtube",
  "tiktok",
  "linkedin",
  "website",
];

let counter = 0;
export function createSocialLink(platform = "website") {
  counter += 1;
  return { id: `soc_${Date.now()}_${counter}`, platform, url: "" };
}
