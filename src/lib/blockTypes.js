// Central registry of block types the visual builder supports.
// Phase 3 will add "image" and "imageUrl" block types here.

export const BLOCK_TYPES = {
  heading: {
    label: "Heading",
    icon: "H",
    defaultProps: { text: "Your heading here", level: "h2" },
  },
  text: {
    label: "Text",
    icon: "¶",
    defaultProps: { text: "Write something about your site…" },
  },
  image: {
    label: "Image",
    icon: "◱",
    defaultProps: { src: "", alt: "" },
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

export const PALETTE_ORDER = ["heading", "text", "image", "button", "divider"];

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
