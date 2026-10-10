import type { MetadataRoute } from "next";
import { NAV, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ href: "/" }, ...NAV].map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    changeFrequency: href === "/menu" ? "weekly" : "monthly",
    priority: href === "/" ? 1 : href === "/menu" ? 0.9 : 0.6,
  }));
}
