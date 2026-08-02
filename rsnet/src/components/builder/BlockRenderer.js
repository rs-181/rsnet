import { parseVideoUrl } from "@/lib/videoEmbed";
import CarouselBlock from "./CarouselBlock";

const TEXT_SIZES = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" };

export default function BlockRenderer({ block }) {
  const { type, props } = block;

  switch (type) {
    case "heading": {
      const Tag = props.level || "h2";
      const sizes = { h1: "text-4xl", h2: "text-2xl", h3: "text-xl" };
      return (
        <Tag
          className={`font-display font-bold ${sizes[Tag] || "text-2xl"}`}
          style={{ color: props.color || "#ffffff", opacity: 1 }}
        >
          {props.text}
        </Tag>
      );
    }

    case "text":
      // Fixed: text used to render dim and low-contrast (text-charcoal-600
      // on a dark background). It now renders at full opacity in a
      // user-chosen (or bright-default) color, with no opacity utility
      // classes applied anywhere in this chain.
      return (
        <p
          className={`${TEXT_SIZES[props.size] || TEXT_SIZES.base} leading-relaxed`}
          style={{ color: props.color || "#f2f2f5", opacity: 1 }}
        >
          {props.text}
        </p>
      );

    case "image":
      return props.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={props.src}
          alt={props.alt || ""}
          className="max-h-96 w-full rounded-xl object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-charcoal-700 text-sm text-charcoal-300">
          No image set — add one in the panel on the right
        </div>
      );

    case "video": {
      const parsed = parseVideoUrl(props.url);
      if (!parsed) {
        return (
          <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-charcoal-700 text-sm text-charcoal-300">
            Paste a YouTube, Vimeo, or direct video URL in the panel on the right
          </div>
        );
      }
      if (parsed.kind === "iframe") {
        return (
          <div className="aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              src={parsed.src}
              title="Embedded video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video controls className="w-full rounded-xl">
          <source src={parsed.src} />
        </video>
      );
    }

    case "carousel":
      return <CarouselBlock images={props.images} />;

    case "iframe":
      return props.url ? (
        <iframe
          src={props.url}
          title="Embedded content"
          style={{ height: `${props.height || 480}px` }}
          className="w-full rounded-xl border border-charcoal-700"
          // A reasonably permissive but non-default sandbox — blocks the
          // embedded page from doing things like top-level navigation or
          // reading this site's storage, while still letting typical
          // widgets (forms, scripts) function.
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-charcoal-700 text-sm text-charcoal-300">
          Paste an embed URL in the panel on the right
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
