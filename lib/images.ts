import blurData from "@/lib/blur-data.json";

export type ImageCategory = "beach" | "bungalow" | "interior" | "kitchen" | "bathroom";

export interface SiteImage {
  slug: string;
  src: string;
  alt: string;
  blurDataURL: string;
  category: ImageCategory;
  /** CSS object-position, tuned per photo to crop out clutter (cables, drying racks, plastic chairs) */
  objectPosition: string;
  /** matches an AccommodationUnit.slug — set only on photos of a specific unit */
  unitSlug?: string;
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
    unitSlug: "bungalo-chetvorka-ednostaen",
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
    unitSlug: "bungalo-dvoika",
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

  // Бунгало за трима — реални снимки
  {
    slug: "troika-terrace-kitchenette",
    alt: "Сенчеста дървена тераса на Бунгало за трима с барбекю и маса",
    category: "bungalow",
    objectPosition: "45% 55%",
    unitSlug: "bungalo-troika",
  },
  {
    slug: "troika-outdoor-kitchen",
    alt: "Кухненски бокс на терасата на Бунгало за трима",
    category: "kitchen",
    objectPosition: "60% 55%",
    unitSlug: "bungalo-troika",
  },
  {
    slug: "troika-bedroom-cave-mural",
    alt: "Спалня в Бунгало за трима с фототапет на морска пещера",
    category: "interior",
    objectPosition: "50% 55%",
    unitSlug: "bungalo-troika",
  },
  {
    slug: "troika-bathroom",
    alt: "Баня с душ кабина в Бунгало за трима",
    category: "bathroom",
    objectPosition: "50% 45%",
    unitSlug: "bungalo-troika",
  },

  // Бунгало „Лятна пауза" — двустайно, за четирима
  {
    slug: "pauza-exterior",
    alt: "Двустайно бунгало за четирима „Лятна пауза“ сред дървета",
    category: "bungalow",
    objectPosition: "50% 45%",
    unitSlug: "bungalo-dvustaen-lyatna-pauza",
  },
  {
    slug: "pauza-kitchen-dining",
    alt: "Кухня и трапезария на терасата на бунгало „Лятна пауза“",
    category: "kitchen",
    objectPosition: "35% 55%",
    unitSlug: "bungalo-dvustaen-lyatna-pauza",
  },
  {
    slug: "pauza-bathroom",
    alt: "Баня с душ кабина в бунгало „Лятна пауза“",
    category: "bathroom",
    objectPosition: "60% 45%",
    unitSlug: "bungalo-dvustaen-lyatna-pauza",
  },
  {
    slug: "pauza-bedroom-double",
    alt: "Спалня с двойно легло и климатик в бунгало „Лятна пауза“",
    category: "interior",
    objectPosition: "50% 60%",
    unitSlug: "bungalo-dvustaen-lyatna-pauza",
  },
  {
    slug: "pauza-bedroom-twin",
    alt: "Спалня с единични легла в бунгало „Лятна пауза“",
    category: "interior",
    objectPosition: "50% 60%",
    unitSlug: "bungalo-dvustaen-lyatna-pauza",
  },

  // Каравана морска гледка
  {
    slug: "caravan-seaview-hero",
    alt: "Каравана с покрита сенчеста тераса в Каравана морска гледка",
    category: "bungalow",
    objectPosition: "50% 55%",
    unitSlug: "karavana-morska-gledka",
  },
  {
    slug: "caravan-seaview-terrace-view",
    alt: "Изглед към морето през терасата на Каравана морска гледка",
    category: "bungalow",
    objectPosition: "55% 50%",
    unitSlug: "karavana-morska-gledka",
  },
  {
    slug: "caravan-seaview-lounge",
    alt: "Трапезария и дневна зона в Каравана морска гледка",
    category: "interior",
    objectPosition: "50% 45%",
    unitSlug: "karavana-morska-gledka",
  },
  {
    slug: "caravan-seaview-kitchen",
    alt: "Напълно оборудвана кухня в Каравана морска гледка",
    category: "kitchen",
    objectPosition: "50% 45%",
    unitSlug: "karavana-morska-gledka",
  },
  {
    slug: "caravan-seaview-bedroom",
    alt: "Спалня с двойно легло в Каравана морска гледка",
    category: "interior",
    objectPosition: "50% 60%",
    unitSlug: "karavana-morska-gledka",
  },

  // Вила за седем човека — реални снимки
  {
    slug: "villa7-porch-swing",
    alt: "Покрита веранда на Вилата с градинска люлка и барбекю",
    category: "bungalow",
    objectPosition: "35% 55%",
    unitSlug: "vila",
  },
  {
    slug: "villa7-bedroom-boardwalk-mural",
    alt: "Спалня във Вилата с фототапет на плажна алея",
    category: "interior",
    objectPosition: "50% 45%",
    unitSlug: "vila",
  },
  {
    slug: "villa7-bedroom-amalfi-mural",
    alt: "Спалня във Вилата с фототапет на балкон с морски изглед",
    category: "interior",
    objectPosition: "50% 45%",
    unitSlug: "vila",
  },
  {
    slug: "villa7-bedroom-palm-mural",
    alt: "Спалня във Вилата с фототапет на палми и плаж",
    category: "interior",
    objectPosition: "50% 45%",
    unitSlug: "vila",
  },
  {
    slug: "villa7-kitchen",
    alt: "Кухня във Вилата с хладилник и печка",
    category: "kitchen",
    objectPosition: "50% 45%",
    unitSlug: "vila",
  },
  {
    slug: "villa7-bathroom",
    alt: "Баня във Вилата с плочки в тъмен тон",
    category: "bathroom",
    objectPosition: "60% 50%",
    unitSlug: "vila",
  },

  // Бунгало „Морски бриз" — двустайно, за четирима
  {
    slug: "briz-exterior",
    alt: "Двустайно бунгало за четирима „Морски бриз“ сред дървета",
    category: "bungalow",
    objectPosition: "50% 45%",
    unitSlug: "bungalo-dvustaen-morski-briz",
  },
  {
    slug: "briz-terrace-lounge",
    alt: "Закрита тераса за отдих на бунгало „Морски бриз“",
    category: "bungalow",
    objectPosition: "50% 55%",
    unitSlug: "bungalo-dvustaen-morski-briz",
  },
  {
    slug: "briz-kitchen-dining",
    alt: "Кухня и трапезария на бунгало „Морски бриз“",
    category: "kitchen",
    objectPosition: "35% 50%",
    unitSlug: "bungalo-dvustaen-morski-briz",
  },
  {
    slug: "briz-bedroom-1",
    alt: "Спалня с двойно легло в бунгало „Морски бриз“",
    category: "interior",
    objectPosition: "50% 55%",
    unitSlug: "bungalo-dvustaen-morski-briz",
  },
  {
    slug: "briz-bedroom-2",
    alt: "Втора спалня с двойно легло в бунгало „Морски бриз“",
    category: "interior",
    objectPosition: "50% 60%",
    unitSlug: "bungalo-dvustaen-morski-briz",
  },
  {
    slug: "briz-bathroom",
    alt: "Баня с душ кабина в бунгало „Морски бриз“",
    category: "bathroom",
    objectPosition: "50% 55%",
    unitSlug: "bungalo-dvustaen-morski-briz",
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
  { label: "Баня", value: "bathroom" },
];

export function getUnitGallery(unitSlug: string): SiteImage[] {
  return SITE_IMAGES.filter((img) => img.unitSlug === unitSlug);
}
