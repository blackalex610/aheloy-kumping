import blurData from "@/lib/blur-data.json";

export type ImageCategory = "beach" | "bungalow" | "interior" | "kitchen";

export interface SiteImage {
  slug: string;
  src: string;
  alt: string;
  blurDataURL: string;
  category: ImageCategory;
  /** CSS object-position, tuned per photo to crop out clutter (cables, drying racks, plastic chairs) */
  objectPosition: string;
}

const raw: Omit<SiteImage, "blurDataURL" | "src">[] = [
  {
    slug: "beach-01",
    alt: "Пясъчен плаж и вълни на Черно море близо до къмпинга",
    category: "beach",
    objectPosition: "50% 55%",
  },
  {
    slug: "terrace-dappled-shade",
    alt: "Сенчеста тераса на бунгало под клоните на орехово дърво",
    category: "bungalow",
    objectPosition: "60% 50%",
  },
  {
    slug: "hammock-golden-hour",
    alt: "Хамак и градинска люлка в двора на къмпинга по залез",
    category: "bungalow",
    objectPosition: "40% 55%",
  },
  {
    slug: "terrace-blue-curtains",
    alt: "Дървена тераса със сини завеси и маса за хранене",
    category: "bungalow",
    objectPosition: "50% 60%",
  },
  {
    slug: "villa-porch-bbq",
    alt: "Покрита веранда на вилата с маса, столове и барбекю",
    category: "bungalow",
    objectPosition: "30% 55%",
  },
  {
    slug: "bungalow-tree-deck",
    alt: "Дървена тераса на бунгало, изградена около растящо дърво",
    category: "bungalow",
    objectPosition: "45% 55%",
  },
  {
    slug: "bungalow-mint-curtains",
    alt: "Тераса на бунгало с прозрачни завеси сред зеленина",
    category: "bungalow",
    objectPosition: "50% 45%",
  },
  {
    slug: "terrace-kitchenette-combo",
    alt: "Полуоткрита тераса с кухненски бокс и мивка",
    category: "bungalow",
    objectPosition: "25% 55%",
  },
  {
    slug: "terrace-gazebo-bbq",
    alt: "Дървена беседка с маса, столове и барбекю сред дървета",
    category: "bungalow",
    objectPosition: "50% 60%",
  },
  {
    slug: "kitchen-sink-01",
    alt: "Кухненски бокс с мивка и съдове за хранене",
    category: "kitchen",
    objectPosition: "50% 45%",
  },
  {
    slug: "kitchen-hotplate-oven",
    alt: "Компактна печка с котлони в кухненския бокс",
    category: "kitchen",
    objectPosition: "50% 40%",
  },
  {
    slug: "kitchen-outdoor-nook",
    alt: "Обзаведена кухня на открито с мивка, печка и скара",
    category: "kitchen",
    objectPosition: "50% 45%",
  },
  {
    slug: "kitchen-drawer-detail",
    alt: "Прибори и кухненски аксесоари в чекмедже",
    category: "kitchen",
    objectPosition: "50% 45%",
  },
  {
    slug: "kitchen-fridge-stove",
    alt: "Кухня с хладилник, микровълнова печка и котлони",
    category: "kitchen",
    objectPosition: "35% 50%",
  },
  {
    slug: "bedroom-beach-mural",
    alt: "Спалня с фототапет на плаж и бебешко легло",
    category: "interior",
    objectPosition: "50% 45%",
  },
  {
    slug: "bedroom-amalfi-mural",
    alt: "Спалня с фототапет на морски балкон",
    category: "interior",
    objectPosition: "50% 40%",
  },
  {
    slug: "bedroom-palm-mural",
    alt: "Спалня с фототапет на палми и плаж",
    category: "interior",
    objectPosition: "35% 45%",
  },
  {
    slug: "bedroom-tv-nook",
    alt: "Спалня с телевизор и бебешко легло",
    category: "interior",
    objectPosition: "50% 40%",
  },
  {
    slug: "bedroom-floral-01",
    alt: "Спалня с цветна спална конфекция",
    category: "interior",
    objectPosition: "50% 55%",
  },
  {
    slug: "bedroom-floral-twin",
    alt: "Две легла с лилава цветна спална конфекция",
    category: "interior",
    objectPosition: "50% 55%",
  },
  {
    slug: "bedroom-eiffel-print",
    alt: "Единични легла с десен на Айфеловата кула",
    category: "interior",
    objectPosition: "50% 55%",
  },
  {
    slug: "bedroom-geometric-wallpaper",
    alt: "Спалня с геометрични тапети и телевизор",
    category: "interior",
    objectPosition: "50% 55%",
  },
];

const blurMap = blurData as Record<string, string>;

export const SITE_IMAGES: SiteImage[] = raw.map((img) => ({
  ...img,
  src: `/images/${img.slug}.jpg`,
  blurDataURL: blurMap[img.slug],
}));

const bySlug = new Map(SITE_IMAGES.map((img) => [img.slug, img]));

export function getImage(slug: string): SiteImage {
  const img = bySlug.get(slug);
  if (!img) throw new Error(`Unknown image slug: ${slug}`);
  return img;
}

export function getGalleryImages(category?: ImageCategory): SiteImage[] {
  if (!category) return SITE_IMAGES;
  return SITE_IMAGES.filter((img) => img.category === category);
}

export const GALLERY_CATEGORIES: { label: string; value: ImageCategory | "all" }[] = [
  { label: "Всички", value: "all" },
  { label: "Бунгала", value: "bungalow" },
  { label: "Плаж", value: "beach" },
  { label: "Интериор", value: "interior" },
  { label: "Кухня", value: "kitchen" },
];
