// Licensed under the Unsplash License (free commercial use, no attribution required).
// Swap these for the restaurant's own photography before launch.
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

export const photos = {
  heroPlate: {
    src: unsplash("1414235077428-338989a2e8c0"),
    alt: "A plated dish on a candlelit table, set with wine glasses",
  },
  diningRoom: {
    src: unsplash("1590846406792-0adc7f938f1d"),
    alt: "The dining room at night under low brass pendant lights",
  },
  pass: {
    src: unsplash("1581349485608-9469926a8e5e"),
    alt: "A chef finishing a row of plates at the pass",
  },
  chef: {
    src: unsplash("1577219491135-ce391730fb2c"),
    alt: "A chef plating under copper lamps in the open kitchen",
  },
  bar: {
    src: unsplash("1514362545857-3bc16c4c7d1b"),
    alt: "An amber drink garnished with rosemary on the bar",
  },
  carpaccio: {
    src: unsplash("1504674900247-0877df9cc836"),
    alt: "Thinly sliced seared beef with chilli, herbs and nuts",
  },
  prawnsRice: {
    src: unsplash("1559847844-5315695dadae"),
    alt: "Tiger prawns in a red pepper sauce beside a mound of rice",
  },
  salmon: {
    src: unsplash("1467003909585-2f8a72700288"),
    alt: "Glazed salmon topped with a bright salsa on a white plate",
  },
  ribeye: {
    src: unsplash("1615937657715-bc7b4b7962c1"),
    alt: "A seared ribeye with rosemary and chips in a cast-iron pan",
  },
  linguine: {
    src: unsplash("1563379926898-05f4575a45d8"),
    alt: "Linguine with tiger prawns, cherry tomatoes and parsley",
  },
  caramel: {
    src: unsplash("1551024506-0bccd828d307"),
    alt: "Salted caramel poured over a scoop of ice cream with a cocoa tuile",
  },
} as const;
