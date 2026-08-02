export function parseVideoUrl(url) {
  if (!url) return null;

  try {
    const u = new URL(url);

    // youtube.com/watch?v=ID, youtube.com/shorts/ID, or youtu.be/ID
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let videoId = u.searchParams.get("v");
      if (!videoId && u.hostname.includes("youtu.be")) {
        videoId = u.pathname.slice(1);
      }
      if (!videoId && u.pathname.includes("/shorts/")) {
        videoId = u.pathname.split("/shorts/")[1];
      }
      if (videoId) {
        return { kind: "iframe", src: `https://www.youtube.com/embed/${videoId}` };
      }
    }

    // vimeo.com/ID
    if (u.hostname.includes("vimeo.com")) {
      const videoId = u.pathname.split("/").filter(Boolean).pop();
      if (videoId) {
        return { kind: "iframe", src: `https://player.vimeo.com/video/${videoId}` };
      }
    }

    // Anything else is assumed to be a direct video file (.mp4, .webm, etc).
    return { kind: "file", src: url };
  } catch {
    return null;
  }
}
