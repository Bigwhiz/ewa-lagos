import { site } from "@/content/site";

const SCHEMA_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** schema.org Restaurant, generated from the same hours and address the pages show. */
export function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    alternateName: site.nameAscii,
    description: site.description,
    url: site.url,
    telephone: `+${site.whatsapp}`,
    email: site.email,
    servesCuisine: ["Nigerian", "West African", "International"],
    priceRange: "₦₦₦₦",
    acceptsReservations: true,
    hasMenu: `${site.url}/menu`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.area,
      addressRegion: site.address.city,
      addressCountry: site.address.country,
    },
    openingHoursSpecification: site.hours.flatMap((services, day) =>
      services.map((s) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SCHEMA_DAYS[day],
        opens: s.open,
        closes: s.close,
      })),
    ),
  };
}
