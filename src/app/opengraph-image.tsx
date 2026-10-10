import { ImageResponse } from "next/og";
import { photos } from "@/content/photos";
import { site } from "@/content/site";

export const alt = `${site.name}, a restaurant in Ikoyi, Lagos`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Fetch only the glyphs we draw, as TTF (the OG renderer can't read woff2). Runs once, at build time. */
async function loadFont(weight: number, text: string): Promise<ArrayBuffer> {
  "use cache";
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@${weight}&text=${encodeURIComponent(text)}`,
  ).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Could not load OG font");
  return fetch(url).then((r) => r.arrayBuffer());
}

export default async function OpengraphImage() {
  const headline = site.name;
  const sub = `${site.tagline} · Ikoyi`;
  const font = await loadFont(400, headline + sub);

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#12100e", color: "#f3ede3" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560, padding: 72 }}>
          <div style={{ display: "flex", fontSize: 18, letterSpacing: 6, color: "#c39c5e", fontFamily: "Cormorant" }}>
            {sub.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 220, lineHeight: 0.9, fontFamily: "Cormorant", color: "#c39c5e" }}>
            {headline}
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered to PNG, not to the page */}
        <img
          src={photos.heroPlate.src.replace("w=2400", "w=1280")}
          alt=""
          width={640}
          height={630}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    { ...size, fonts: [{ name: "Cormorant", data: font, style: "normal", weight: 400 }] },
  );
}
