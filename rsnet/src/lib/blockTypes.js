// Central registry of block types the visual builder supports.

export const BLOCK_TYPES = {
  heading: {
    label: "Heading",
    icon: "H",
    defaultProps: { text: "Your heading here", level: "h2", color: "#ffffff" },
  },
  text: {
    label: "Text",
    icon: "¶",
    // color defaults to a bright, fully-opaque near-white — the previous
    // dim gray default was the source of the "blurry / low opacity" text
    // complaint on live sites.
    defaultProps: { text: "Write something about your site…", color: "#f2f2f5", size: "base" },
  },
  image: {
    label: "Image",
    icon: "◱",
    defaultProps: { src: "", alt: "" },
  },
  video: {
    label: "Video",
    icon: "▶",
    defaultProps: { url: "" },
  },
  carousel: {
    label: "Image slider",
    icon: "▤",
    defaultProps: { images: [] }, // [{ id, src, alt }]
  },
  iframe: {
    label: "Embed",
    icon: "◫",
    defaultProps: { url: "", height: 480 },
  },
  button: {
    label: "Button",
    icon: "▭",
    defaultProps: { label: "Click me", href: "#" },
  },
  divider: {
    label: "Divider",
    icon: "—",
    defaultProps: {},
  },
};

export const PALETTE_ORDER = [
  "heading",
  "text",
  "image",
  "video",
  "carousel",
  "iframe",
  "button",
  "divider",
];

let counter = 0;
export function createBlock(type) {
  counter += 1;
  const def = BLOCK_TYPES[type];
  return {
    id: `blk_${Date.now()}_${counter}`,
    type,
    props: { ...def.defaultProps },
  };
}

export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 30);
}
