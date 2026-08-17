/**
 * Single source of truth for every string, price, link and fact on the site.
 * Nothing here is invented: prices, amenities, distances and the "8 years"
 * claim come directly from the business brief. Anything not supplied
 * (check-in times, deposit policy, real reviews, a Google Business URL)
 * is marked isPlaceholder and rendered visibly as such — never faked.
 */

export const BUSINESS = {
  name: "Къмпинг Ахелойска Битка",
  category: "Къмпинг • Бунгала • Семейна почивка край морето",
  locality: "Ахелой",
  region: "Бургас",
  country: "България",
  phoneDisplay: "+359 88 999 6156",
  phoneHref: "tel:+359889996156",
  facebookUrl: "https://www.facebook.com/CampingAheloyskaBitka/?locale=bg_BG",
  externalBookingUrl: "https://pochivka.bg/bungala-aheloyska-bitka-o49671",
  shortDescription:
    "Спокоен семеен къмпинг на 50 метра от морето. Уютни бунгала под сянката на дърветата, място за каравани и палатки, детски кът и всичко необходимо за спокойна почивка край брега.",
} as const;

export const NAV_LINKS = [
  { label: "Начало", href: "/#hero" },
  { label: "За нас", href: "/#about" },
  { label: "Настаняване", href: "/#accommodation" },
  { label: "Къмпинг", href: "/#camping" },
  { label: "Удобства", href: "/#amenities" },
  { label: "Галерия", href: "/#gallery" },
  { label: "Контакти", href: "/#contact" },
] as const;

export const CTA = {
  primary: "Провери свободни дати",
  secondary: "Свържи се с нас",
  phone: "Обади се сега",
  bookingFormHref: "/#booking",
  contactHref: "/#contact",
} as const;

export const HERO = {
  headline: "Вашата спокойна почивка край морето",
  subtitle:
    "Къмпинг Ахелойска Битка предлага уютни бунгала, места за каравани и палатки само на 50 метра от плажа. Перфектното място за семейства, приятели и хора, търсещи спокойствие.",
  trustBadges: [
    { icon: "Waves", label: "50 м от плажа" },
    { icon: "TreePine", label: "Сред зеленина и сянка" },
    { icon: "Users", label: "Семейна атмосфера" },
    { icon: "Car", label: "Безплатен паркинг" },
  ],
  imageSlugs: ["beach-01", "terrace-dappled-shade", "hammock-golden-hour", "terrace-blue-curtains"],
} as const;

export const QUICK_FACTS = {
  title: "Всичко необходимо за една истинска морска почивка",
  items: [
    { icon: "Waves", title: "50 м от плажа", text: "Само няколко минути пеша до морето." },
    { icon: "TreePine", title: "Спокойна природа", text: "Бунгалата са разположени сред зеленина и естествена сянка." },
    { icon: "Car", title: "Удобен паркинг", text: "Паркинг за автомобили включен в цената." },
    { icon: "Users", title: "Семейна атмосфера", text: "Подходящо място за почивка с деца." },
  ],
} as const;

export const WHY_CHOOSE_US = {
  title: "Защо гостите избират Ахелойска Битка?",
  cards: [
    {
      icon: "Waves",
      title: "Близо до морето",
      headline: "Само 50 метра до плажа",
      text: "Гостите могат лесно да достигнат морето само за няколко минути.",
    },
    {
      icon: "TreePine",
      title: "Спокойствие сред природата",
      headline: "Сянка от дървета и зеленина",
      text: "Спокойна обстановка, далеч от шума на препълнените курорти.",
    },
    {
      icon: "Users",
      title: "Перфектно за семейства",
      headline: "Безопасна и спокойна среда",
      text: "Комфортно място за почивка със семейства и деца.",
    },
    {
      icon: "Tent",
      title: "Истинско къмпинг преживяване",
      headline: "Каравани, палатки и уютни бунгала",
      text: "Съчетание от традиционен къмпинг и комфортно настаняване.",
    },
  ],
} as const;

export const ABOUT = {
  title: "Място за истинска почивка",
  paragraphs: [
    "Къмпинг Ахелойска Битка е спокойно семейно място на Южното Черноморие. Разположен само на няколко крачки от морето, къмпингът предлага уютни бунгала, зелени площи и атмосфера далеч от шума на големите курорти.",
    "Благодарение на близостта до плажа, естествената сянка и спокойната атмосфера, мястото е предпочитано от семейства и гости, които искат да избягат от шума на големите курорти.",
  ],
  imageSlug: "terrace-dappled-shade",
} as const;

export const FAMILY_STORY = {
  title: "Повече от 8 години създаваме летни спомени",
  paragraphs: [
    "Къмпингът не е просто място за спане. Той е място, където семействата се връщат всяко лято, раждат се приятелства и се създават летни спомени, които остават за цял живот.",
  ],
  imageSlug: "hammock-golden-hour",
} as const;

export const SEASON = {
  title: "Сезон",
  working: { label: "Работим:", value: "Май – Септември" },
  peak: { label: "Летен сезон:", value: "Юни – Август" },
} as const;

export interface AccommodationUnit {
  slug: string;
  name: string;
  capacity: string;
  priceLabel: string;
  imageSlug: string;
  features: string[];
}

export const ACCOMMODATION: AccommodationUnit[] = [
  {
    slug: "vila",
    name: "Вила",
    capacity: "До 7 човека",
    priceLabel: "160–180 лв./вечер",
    imageSlug: "villa-porch-bbq",
    features: [
      "3 спални",
      "Кухня с печка и хладилник",
      "Климатик",
      "Баня и тоалетна",
      "Кабелна телевизия",
      "Голяма тераса",
      "Барбекю",
    ],
  },
  {
    slug: "bungalo-dvoika",
    name: "Бунгало Двойка",
    capacity: "До 2 човека",
    priceLabel: "70 лв./вечер",
    imageSlug: "bungalow-tree-deck",
    features: ["Две единични легла", "Баня и тоалетна", "Кухненски кът", "Навес с маса", "Барбекю"],
  },
  {
    slug: "bungalo-troika",
    name: "Бунгало Тройка",
    capacity: "До 3 човека",
    priceLabel: "90 лв./вечер",
    imageSlug: "bungalow-mint-curtains",
    features: ["Три единични легла", "Кухня", "Баня", "Навес", "Барбекю"],
  },
  {
    slug: "bungalo-chetvorka",
    name: "Бунгало Четворка",
    capacity: "До 4 човека",
    priceLabel: "110 лв./вечер",
    imageSlug: "terrace-blue-curtains",
    features: ["Четири единични легла", "Кухня", "Баня и тоалетна", "Тераса", "Люлка", "Барбекю"],
  },
];

export const CAMPING = {
  title: "Къмпинг сред природата",
  description:
    "За любителите на къмпингуването предлагаме спокойни места сред природата с удобен достъп до морето.",
  features: ["Палатки", "Каравани", "Кемпери", "Електричество", "Санитарни помещения", "Зелени площи"],
  imageSlugs: ["terrace-gazebo-bbq"],
  placeholder: "Очакваме снимки от къмпинг зоната",
} as const;

export interface Amenity {
  icon: string;
  label: string;
}

export const AMENITIES: Amenity[] = [
  { icon: "Car", label: "Паркинг" },
  { icon: "Wifi", label: "Wi-Fi" },
  { icon: "Snowflake", label: "Климатик" },
  { icon: "Tv", label: "Телевизор" },
  { icon: "ChefHat", label: "Кухня" },
  { icon: "Refrigerator", label: "Хладилник" },
  { icon: "Microwave", label: "Микровълнова" },
  { icon: "Coffee", label: "Кафе машина" },
  { icon: "Flame", label: "Барбекю" },
  { icon: "Baby", label: "Детски кът" },
  { icon: "CircleDot", label: "Тенис на маса" },
  { icon: "WashingMachine", label: "Пералня" },
  { icon: "PawPrint", label: "Домашни любимци" },
];

export const REVIEWS = {
  rating: 4.3,
  reviewCount: 205,
  countLabel: "205+ мнения",
  ctaLabel: "Виж всички мнения",
  emptyStateTitle: "Отзиви от нашите гости",
  emptyStateText:
    "Тук предстои да добавим реални отзиви от гости. Не публикуваме измислени мнения — очаквайте истински впечатления скоро.",
  /** TODO: replace with the real Google Business profile URL once available */
  googleMapsSearchQuery: "Къмпинг Ахелойска Битка, Ахелой",
} as const;

export const NEARBY = {
  title: "Перфектна локация",
  text: "Къмпинг Ахелойска Битка се намира на Южното Черноморие, близо до град Ахелой.",
  distances: [
    { icon: "Waves", label: "Плаж", distance: 50, unit: "м" },
    { icon: "MapPin", label: "Ахелой", distance: 900, unit: "м" },
    { icon: "Landmark", label: "Несебър", distance: 6, unit: "км" },
    { icon: "Waves", label: "Поморие", distance: 8, unit: "км" },
    { icon: "Sun", label: "Слънчев бряг", distance: 8, unit: "км" },
    { icon: "Building2", label: "Бургас", distance: 25, unit: "км" },
  ],
} as const;

export interface FaqItem {
  question: string;
  answer: string;
  isPlaceholder?: boolean;
}

export const FAQ: FaqItem[] = [
  {
    question: "Кога работи къмпингът?",
    answer: "Работим от май до септември, като летният сезон е от юни до август.",
  },
  {
    question: "На колко метра от плажа се намира къмпингът?",
    answer: "Плажът е само на 50 метра от къмпинга — на няколко минути пеша.",
  },
  {
    question: "Какви типове настаняване предлагате?",
    answer:
      "Предлагаме Вила, три вида бунгала (Двойка, Тройка, Четворка), както и места за палатки и каравани.",
  },
  {
    question: "Има ли паркинг?",
    answer: "Да, къмпингът разполага с безплатен паркинг за гости.",
  },
  {
    question: "Приемате ли домашни любимци?",
    answer: "Да, къмпингът е сред природа и приема домашни любимци.",
  },
  {
    question: "Какви са часовете за настаняване и напускане?",
    answer:
      "Точните часове за настаняване и напускане предстои да бъдат публикувани — свържете се с нас за актуална информация.",
    isPlaceholder: true,
  },
  {
    question: "Изисква ли се капаро за резервация?",
    answer:
      "Условията за капаро и анулиране предстои да бъдат публикувани — свържете се с нас за актуална информация.",
    isPlaceholder: true,
  },
  {
    question: "Как мога да проверя свободни дати?",
    answer: `Изпратете запитване през формата на сайта или се обадете на ${BUSINESS.phoneDisplay}.`,
  },
];

export const BOOKING_CTA = {
  headline: "Готови ли сте за вашата морска почивка?",
  imageSlug: "beach-01",
} as const;

export const FOOTER = {
  tagline: "Спокойна почивка край морето",
} as const;

export const ACCOMMODATION_TYPES_FOR_FORM = [
  "Вила",
  "Бунгало Двойка",
  "Бунгало Тройка",
  "Бунгало Четворка",
  "Място за палатка",
  "Място за каравана / кемпер",
] as const;

export const SEO = {
  title: "Къмпинг Ахелойска Битка | Бунгала край морето в Ахелой",
  description:
    "Къмпинг Ахелойска Битка предлага уютни бунгала, места за каравани и палатки само на 50 м от плажа. Спокойна семейна почивка край Ахелой.",
  keywords: [
    "къмпинг ахелой",
    "бунгала ахелой",
    "почивка ахелой",
    "къмпинг южно черноморие",
    "бунгала край морето",
    "каравани ахелой",
    "палатки ахелой",
  ],
} as const;
