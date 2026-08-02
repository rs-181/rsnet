export default function BlockRenderer({ block }) {
  const { type, props } = block;

  switch (type) {
    case "heading": {
      const Tag = props.level || "h2";
      const sizes = { h1: "text-4xl", h2: "text-2xl", h3: "text-xl" };
      return (
        <Tag className={`font-display font-bold ${sizes[Tag] || "text-2xl"}`}>
          {props.text}
        </Tag>
      );
    }
    case "text":
      return <p className="leading-relaxed text-charcoal-600">{props.text}</p>;
    case "image":
      return props.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.src}
          alt={props.alt || ""}
          className="max-h-96 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-charcoal-700 text-sm text-charcoal-600">
          No image set — add one in the panel on the right
        </div>
      );
    case "button":
      return (
        <a href={props.href} className="btn-primary inline-flex">
          {props.label}
        </a>
      );
    case "divider":
      return <hr className="border-charcoal-700" />;
    default:
      return null;
  }
}
