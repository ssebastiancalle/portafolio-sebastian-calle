export interface PhotoMeta {
  title: string;
  publication: string;
  description: string;
  credits: {
    magazine?: string;
    model?: string;
    photographer: string;
    studio?: string;
  };
}

export interface Photo {
  id: string;
  url: string;
  alt: string;
  meta: PhotoMeta;
}

export interface Category {
  id: string;
  label: string;
  photos: Photo[];
}

export const categories: Category[] = [];

const _unused: Category[] = [
  {
    id: "portraits",
    label: "PORTRAITS",
    photos: [
      {
        id: "p1",
        url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 1",
        meta: {
          title: "SILHOUETTE – COVER FEATURE",
          publication: "SELIN MAGAZINE | Issue 65 Vol. 8",
          description: "A minimalist studio portrait focusing on clean lines, classic basics, and soft contrast.",
          credits: { magazine: "@selin.magazine", model: "@lucia_agenjo", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "p2",
        url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 2",
        meta: {
          title: "GOLDEN HOUR – EDITORIAL",
          publication: "VOGUE ES | Issue 12 Vol. 3",
          description: "Natural light portrait series exploring the tension between shadow and warmth.",
          credits: { magazine: "@voguees", model: "@marcos.rl", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "p3",
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 3",
        meta: {
          title: "PURE FORM – BEAUTY STORY",
          publication: "I-D MAGAZINE | Issue 88 Vol. 2",
          description: "High contrast beauty portrait. Stripped back, raw, and unapologetically direct.",
          credits: { magazine: "@i_d_magazine", model: "@nadia.photo", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "p4",
        url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 4",
        meta: {
          title: "MONOCHROME – STREET PORTRAIT",
          publication: "DAZED | Issue 41 Vol. 5",
          description: "Candid urban portrait. The city as backdrop, the face as the story.",
          credits: { magazine: "@dazed", model: "@carlos.mv", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "p5",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 5",
        meta: {
          title: "ANALOG SOUL – FILM PORTRAIT",
          publication: "ANOTHER MAN | Issue 29 Vol. 1",
          description: "Shot on 35mm. Grain, warmth, and the quiet presence of a face in stillness.",
          credits: { magazine: "@anothermanmag", model: "@daniel.ph", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "p6",
        url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&q=80",
        alt: "Portrait 6",
        meta: {
          title: "SOFTNESS – EDITORIAL PORTRAIT",
          publication: "NUMÉRO | Issue 77 Vol. 4",
          description: "A study in softness. Diffused light, neutral tones, and the power of restraint.",
          credits: { magazine: "@numero_magazine", model: "@sofia.ag", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
    ],
  },
  {
    id: "weddings",
    label: "WEDDINGS",
    photos: [
      {
        id: "w1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 1",
        meta: {
          title: "FOREVER – TUSCAN WEDDING",
          publication: "BRIDES MAGAZINE | Issue 14 Vol. 2",
          description: "A golden afternoon in the Tuscan hills. Love documented with honesty and light.",
          credits: { model: "@laura & @marcos", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "w2",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 2",
        meta: {
          title: "VOWS – INTIMATE CEREMONY",
          publication: "MARTHA STEWART WEDDINGS | Issue 8",
          description: "An intimate moment between two people. Nothing else in the frame matters.",
          credits: { model: "@ana & @roberto", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "w3",
        url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 3",
        meta: {
          title: "LIGHT AND LACE",
          publication: "ELLE BRIDE | Issue 33 Vol. 6",
          description: "Soft window light and a handmade gown. Details that tell the whole story.",
          credits: { model: "@carmen.rf", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "w4",
        url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 4",
        meta: {
          title: "THE FIRST DANCE",
          publication: "JUNEBUG WEDDINGS | Issue 22",
          description: "Movement, joy, and the blur of a first dance. Some moments aren't meant to be still.",
          credits: { model: "@diana & @pablo", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "w5",
        url: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 5",
        meta: {
          title: "GOLDEN RECEPTION",
          publication: "STYLE ME PRETTY | Issue 19 Vol. 3",
          description: "Candlelit reception. Warm tones, laughter, and the end of a perfect day.",
          credits: { model: "@elena & @miguel", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "w6",
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=600&fit=crop&q=80",
        alt: "Wedding 6",
        meta: {
          title: "JUST US – ELOPEMENT",
          publication: "ROCK MY WEDDING | Issue 45",
          description: "Two people, one mountain, no audience. An elopement stripped to its essence.",
          credits: { model: "@marta & @tom", photographer: "@ssebastiancalle" },
        },
      },
    ],
  },
  {
    id: "fashion",
    label: "FASHION",
    photos: [
      {
        id: "f1",
        url: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 1",
        meta: {
          title: "MOVEMENT – SS25 EDITORIAL",
          publication: "VOGUE ES | Issue 44 Vol. 7",
          description: "Spring/Summer 2025. Motion blur as intention. Fashion in its purest kinetic form.",
          credits: { magazine: "@voguees", model: "@ines.fashion", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "f2",
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 2",
        meta: {
          title: "STRUCTURE – FW24 CAMPAIGN",
          publication: "HARPER'S BAZAAR | Issue 31 Vol. 9",
          description: "Fall/Winter 24 campaign. Architecture and fabric. Sharp lines, softer silhouettes.",
          credits: { magazine: "@harpersbazaar", model: "@valeria.m", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "f3",
        url: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 3",
        meta: {
          title: "NUDE PALETTE – BEAUTY FASHION",
          publication: "SELIN MAGAZINE | Issue 70 Vol. 2",
          description: "Tones drawn from skin, sand, and stone. A collection built on subtlety.",
          credits: { magazine: "@selin.magazine", model: "@alba.rf", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
      {
        id: "f4",
        url: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 4",
        meta: {
          title: "LAYERS – CONCEPT EDITORIAL",
          publication: "DAZED & CONFUSED | Issue 55",
          description: "Textures stacked and deconstructed. Fashion as architecture, worn and lived in.",
          credits: { magazine: "@dazedconfused", model: "@noa.style", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "f5",
        url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 5",
        meta: {
          title: "RUSH HOUR – STREET FASHION",
          publication: "STREET OFFICIAL | Issue 12",
          description: "The city as runway. Real people, real clothes, real light — no studio needed.",
          credits: { magazine: "@streetofficial", model: "@mia.urban", photographer: "@ssebastiancalle" },
        },
      },
      {
        id: "f6",
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=600&fit=crop&q=80",
        alt: "Fashion 6",
        meta: {
          title: "WHITE NOISE – MINIMAL FASHION",
          publication: "NUMÉRO | Issue 81 Vol. 3",
          description: "All white. All silence. The absence of color as the loudest statement.",
          credits: { magazine: "@numero_magazine", model: "@clara.wh", photographer: "@ssebastiancalle", studio: "@dimgray.studio" },
        },
      },
    ],
  },
  {
    id: "commercial",
    label: "COMMERCIAL",
    photos: [
      {
        id: "c1", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=600&fit=crop&q=80", alt: "Commercial 1",
        meta: { title: "WORKSPACE – BRAND CAMPAIGN", publication: "WIRED SPAIN | Issue 9", description: "Brand identity shoot for a modern workspace collective. Clean, functional, human.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "c2", url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=600&fit=crop&q=80", alt: "Commercial 2",
        meta: { title: "FOCUS – CORPORATE PORTRAIT", publication: "FORBES ES | Issue 24", description: "Executive portrait series. Authority and approachability in equal measure.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "c3", url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop&q=80", alt: "Commercial 3",
        meta: { title: "TEAMWORK – CULTURE SHOOT", publication: "FAST COMPANY | Issue 18", description: "Documenting the energy of a startup culture. Real moments, not staged ones.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "c4", url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&h=600&fit=crop&q=80", alt: "Commercial 4",
        meta: { title: "LIGHT WORK – OFFICE SERIES", publication: "INC. MAGAZINE | Issue 33", description: "Natural light flooding a modern office. Architecture that enables rather than constrains.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "c5", url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=600&fit=crop&q=80", alt: "Commercial 5",
        meta: { title: "DIGITAL LIFE – TECH CAMPAIGN", publication: "MIT TECH REVIEW | Issue 7", description: "Technology as an extension of the human hand. A campaign built around connection.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "c6", url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=600&fit=crop&q=80", alt: "Commercial 6",
        meta: { title: "STRATEGY – BUSINESS PORTRAIT", publication: "ENTREPRENEUR | Issue 41", description: "Portraits for a leadership team. Confidence without performance. Real, grounded, direct.", credits: { photographer: "@ssebastiancalle" } },
      },
    ],
  },
  {
    id: "street",
    label: "STREET",
    photos: [
      {
        id: "s1", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=600&fit=crop&q=80", alt: "Street 1",
        meta: { title: "CITY AT DUSK", publication: "NATIONAL GEOGRAPHIC | Issue 88", description: "The moment a city transitions from day to night. Everything is briefly golden.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "s2", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&h=600&fit=crop&q=80", alt: "Street 2",
        meta: { title: "RUSH – URBAN DOCUMENTARY", publication: "TIME MAGAZINE | Issue 22", description: "Five million people moving at once. One frame that holds them all.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "s3", url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=600&fit=crop&q=80", alt: "Street 3",
        meta: { title: "NEON NIGHTS – TOKYO SERIES", publication: "METROPOLIS JP | Issue 14", description: "Late-night Tokyo. Neon, rain, and the hum of a city that never fully sleeps.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "s4", url: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&h=600&fit=crop&q=80", alt: "Street 4",
        meta: { title: "GEOMETRY – ARCHITECTURAL STREET", publication: "DEZEEN | Issue 55", description: "The city as a study in geometry. Lines, shadows, and the human figure as punctuation.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "s5", url: "https://images.unsplash.com/photo-1519608425089-7f3bfa6f6bb8?w=600&h=600&fit=crop&q=80", alt: "Street 5",
        meta: { title: "QUIET CORNER", publication: "MONOCLE | Issue 67", description: "A small café, an empty chair, a moment that won't be repeated. Street photography at rest.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "s6", url: "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?w=600&h=600&fit=crop&q=80", alt: "Street 6",
        meta: { title: "CROWD – BARCELONA SERIES", publication: "LA VANGUARDIA | Issue 31", description: "A Sunday market in Barcelona's Raval. Color, noise, and the texture of everyday life.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
    ],
  },
  {
    id: "events",
    label: "EVENTS",
    photos: [
      {
        id: "e1", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=600&fit=crop&q=80", alt: "Events 1",
        meta: { title: "OPENING NIGHT – CONCERT SERIES", publication: "ROLLING STONE ES | Issue 19", description: "The energy of a sold-out night. Shot from the pit, no flash, pure available light.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "e2", url: "https://images.unsplash.com/photo-1540575467063-ba5e3d5ee9a7?w=600&h=600&fit=crop&q=80", alt: "Events 2",
        meta: { title: "CONFERENCE – KEYNOTE SERIES", publication: "WIRED | Issue 44", description: "Documenting ideas in motion. The stage, the speaker, the moment of connection with a room.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "e3", url: "https://images.unsplash.com/photo-1501281668745-f7f57925c2b1?w=600&h=600&fit=crop&q=80", alt: "Events 3",
        meta: { title: "DANCE FLOOR – NIGHTLIFE DOCS", publication: "RA MAGAZINE | Issue 8", description: "Resident Advisor commission. The space between the music and the body that receives it.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "e4", url: "https://images.unsplash.com/photo-1429514513361-8a632ff5e31d?w=600&h=600&fit=crop&q=80", alt: "Events 4",
        meta: { title: "GALLERY OPENING – ART SERIES", publication: "EL PAÍS SMODA | Issue 12", description: "Art and its audience. The moment before someone decides if they feel something.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "e5", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=600&fit=crop&q=80", alt: "Events 5",
        meta: { title: "CEREMONY – CORPORATE EVENT", publication: "BRAND SPAIN | Issue 6", description: "Annual awards ceremony. Formal, precise, lit to honor the people being recognized.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "e6", url: "https://images.unsplash.com/photo-1496337589254-7e19d01cec44?w=600&h=600&fit=crop&q=80", alt: "Events 6",
        meta: { title: "ROOFTOP – LAUNCH PARTY", publication: "TIMEOUT MADRID | Issue 33", description: "Product launch at sunset on a Madrid rooftop. The city below, the sky above, champagne everywhere.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
    ],
  },
  {
    id: "travel",
    label: "TRAVEL",
    photos: [
      {
        id: "t1", url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=600&fit=crop&q=80", alt: "Travel 1",
        meta: { title: "TOKYO – CITY JOURNAL", publication: "CONDÉ NAST TRAVELER | Issue 77", description: "Tokyo through a foreign lens. Familiar chaos, beautiful order, and constant surprise.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "t2", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop&q=80", alt: "Travel 2",
        meta: { title: "PATAGONIA – END OF THE WORLD", publication: "NATIONAL GEOGRAPHIC | Issue 99", description: "Wind, granite, and a sky so big it feels personal. Patagonia doesn't care about your plans.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "t3", url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=600&fit=crop&q=80", alt: "Travel 3",
        meta: { title: "PACIFIC – COASTAL SERIES", publication: "SURF EUROPE | Issue 22", description: "The Pacific coast at its most honest. Salt, fog, and the rhythm of water against stone.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "t4", url: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&h=600&fit=crop&q=80", alt: "Travel 4",
        meta: { title: "DEPARTURE – AIRPORT PORTRAITS", publication: "MONOCLE | Issue 71", description: "Everyone leaving somewhere. A series on the specific solitude of airports.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "t5", url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&h=600&fit=crop&q=80", alt: "Travel 5",
        meta: { title: "ALPINE – MOUNTAIN LIGHT", publication: "WALLPAPER* | Issue 48", description: "The Alps in early spring. Snow that's almost gone, light that's just arriving.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "t6", url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600&h=600&fit=crop&q=80", alt: "Travel 6",
        meta: { title: "MARKET DAY – MARRAKECH", publication: "CONDÉ NAST TRAVELER | Issue 84", description: "Marrakech medina at noon. Color, spice, sound, and the feeling of being genuinely lost.", credits: { photographer: "@ssebastiancalle" } },
      },
    ],
  },
  {
    id: "editorial",
    label: "EDITORIAL",
    photos: [
      {
        id: "ed1", url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&h=600&fit=crop&q=80", alt: "Editorial 1",
        meta: { title: "CONTRAST – SPRING EDITORIAL", publication: "SELIN MAGAZINE | Issue 68 Vol. 4", description: "A study in contrast. Light against dark, soft against sharp, expected against surprising.", credits: { magazine: "@selin.magazine", model: "@raquel.ed", photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "ed2", url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80", alt: "Editorial 2",
        meta: { title: "CHROMATIC – COLOR THEORY", publication: "NUMÉRO | Issue 79 Vol. 1", description: "Color as narrative. Each frame a conversation between pigment, light, and intention.", credits: { magazine: "@numero_magazine", model: "@vera.col", photographer: "@ssebastiancalle" } },
      },
      {
        id: "ed3", url: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop&q=80", alt: "Editorial 3",
        meta: { title: "CAFE STORY – INTIMATE EDITORIAL", publication: "KINFOLK | Issue 33", description: "Morning ritual. Coffee, light through a curtain, and the private life of a table.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "ed4", url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&q=80", alt: "Editorial 4",
        meta: { title: "STILL LIFE – OBJECTS SERIES", publication: "APARTAMENTO | Issue 25", description: "Objects arranged without arrangement. The still life as accidental autobiography.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "ed5", url: "https://images.unsplash.com/photo-1497366754035-f200968a333a?w=600&h=600&fit=crop&q=80", alt: "Editorial 5",
        meta: { title: "INTERIOR – SPACE EDITORIAL", publication: "WALLPAPER* | Issue 51", description: "A designed interior photographed as if it were discovered. The space speaks first.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "ed6", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=600&fit=crop&q=80", alt: "Editorial 6",
        meta: { title: "AFTER HOURS – NIGHT EDITORIAL", publication: "DAZED | Issue 49 Vol. 3", description: "After the shoot ends. The set dismantled, the light still lingering. An accidental editorial.", credits: { magazine: "@dazed", model: "@leo.ed", photographer: "@ssebastiancalle" } },
      },
    ],
  },
  {
    id: "product",
    label: "PRODUCT",
    photos: [
      {
        id: "pr1", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80", alt: "Product 1",
        meta: { title: "PRECISION – WATCH CAMPAIGN", publication: "HODINKEE | Issue 17", description: "A timepiece photographed with the same patience it was built with. Detail as devotion.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "pr2", url: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=600&h=600&fit=crop&q=80", alt: "Product 2",
        meta: { title: "ESSENCE – FRAGRANCE CAMPAIGN", publication: "VOGUE ES | Issue 49 Vol. 5", description: "The impossible task: photographing a scent. Light through glass as a stand-in for sensation.", credits: { magazine: "@voguees", photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "pr3", url: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=600&fit=crop&q=80", alt: "Product 3",
        meta: { title: "SOLE – FOOTWEAR CAMPAIGN", publication: "SNEAKER FREAKER | Issue 44", description: "The shoe as object, as statement, as the most personal architecture we wear.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "pr4", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80", alt: "Product 4",
        meta: { title: "SOUND – AUDIO PRODUCT SERIES", publication: "WIRED | Issue 38", description: "Headphones against silence. Product photography as a meditation on listening.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "pr5", url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop&q=80", alt: "Product 5",
        meta: { title: "CAPTURE – CAMERA SERIES", publication: "BJORN PETERSEN STUDIO | Campaign", description: "A camera photographed by a camera. Meta, precise, and oddly tender.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "pr6", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80", alt: "Product 6",
        meta: { title: "MINIMAL – LIFESTYLE PRODUCT", publication: "MONOCLE | Issue 74", description: "The product in its natural context. Not staged, not forced. Simply present.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
    ],
  },
  {
    id: "architecture",
    label: "ARCHITECTURE",
    photos: [
      {
        id: "a1", url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=600&fit=crop&q=80", alt: "Architecture 1",
        meta: { title: "FACADE – BRUTALIST SERIES", publication: "DEZEEN | Issue 61", description: "Brutalism photographed without apology. Weight, repetition, and the beauty of concrete logic.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "a2", url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=600&fit=crop&q=80", alt: "Architecture 2",
        meta: { title: "GLASS AND LIGHT", publication: "WALLPAPER* | Issue 53", description: "Modern glass towers at the hour when sky and building become indistinguishable.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "a3", url: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?w=600&h=600&fit=crop&q=80", alt: "Architecture 3",
        meta: { title: "DOME – SACRED SPACES", publication: "ARCHITECTURAL DIGEST | Issue 88", description: "Religious architecture at the moment of maximum stillness. Light entering as if invited.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "a4", url: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?w=600&h=600&fit=crop&q=80", alt: "Architecture 4",
        meta: { title: "SPAN – BRIDGE SERIES", publication: "DEZEEN | Issue 66", description: "Engineering photographed as poetry. A bridge is just a question a city asks of itself.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "a5", url: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?w=600&h=600&fit=crop&q=80", alt: "Architecture 5",
        meta: { title: "STAIRCASE – INTERIOR FORMS", publication: "FRAME MAGAZINE | Issue 29", description: "A staircase as sculpture. The space between floors as the most interesting room.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "a6", url: "https://images.unsplash.com/photo-1448630360428-65456885c650?w=600&h=600&fit=crop&q=80", alt: "Architecture 6",
        meta: { title: "SKYLINE – CITY PORTRAIT", publication: "TIME OUT | Issue 71", description: "A city photographed as a single organism. The skyline as collective autobiography.", credits: { photographer: "@ssebastiancalle" } },
      },
    ],
  },
  {
    id: "night",
    label: "NIGHT",
    photos: [
      {
        id: "n1", url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&h=600&fit=crop&q=80", alt: "Night 1",
        meta: { title: "AFTER MIDNIGHT – CITY LIGHTS", publication: "MONOCLE | Issue 68", description: "The city at 2am. Emptied of people, full of light. A version of the city only insomniacs know.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "n2", url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&h=600&fit=crop&q=80", alt: "Night 2",
        meta: { title: "MILKY WAY – LONG EXPOSURE", publication: "NATIONAL GEOGRAPHIC | Issue 101", description: "A 30-second exposure in the Atacama. The sky as it actually appears to no human eye.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "n3", url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=600&fit=crop&q=80", alt: "Night 3",
        meta: { title: "RAIN NIGHT – WET STREETS", publication: "DAZED | Issue 52", description: "A wet street at night doubles everything. The city reflected in its own puddles.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "n4", url: "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=600&h=600&fit=crop&q=80", alt: "Night 4",
        meta: { title: "COSMOS – ASTROPHOTOGRAPHY", publication: "SCIENTIFIC AMERICAN | Issue 17", description: "Deep sky imaging from a dark site in Andalucía. 47 frames stacked into one.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "n5", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&q=80", alt: "Night 5",
        meta: { title: "WINDOW LIGHT – NIGHT PORTRAIT", publication: "ELEPHANT MAGAZINE | Issue 24", description: "A face lit only by the city outside the window. No studio, no setup — just available darkness.", credits: { model: "@nicolas.nk", photographer: "@ssebastiancalle" } },
      },
      {
        id: "n6", url: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?w=600&h=600&fit=crop&q=80", alt: "Night 6",
        meta: { title: "NEON JUNGLE – URBAN NIGHT", publication: "VICE | Issue 39", description: "Chinatown, 3am. Every color at maximum saturation. The night shift in full swing.", credits: { photographer: "@ssebastiancalle" } },
      },
    ],
  },
  {
    id: "film",
    label: "FILM",
    photos: [
      {
        id: "fi1", url: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=600&h=600&fit=crop&q=80", alt: "Film 1",
        meta: { title: "GRAIN – 35MM SERIES", publication: "LOMOGRAPHY | Issue 14", description: "Shot on Kodak Portra 400. The grain is not a flaw. The grain is the point.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "fi2", url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=600&fit=crop&q=80", alt: "Film 2",
        meta: { title: "REEL – FILM PROCESS STORY", publication: "ANALOG MAGAZINE | Issue 8", description: "The physical act of film photography. Loading, shooting, developing — a ritual of patience.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "fi3", url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&h=600&fit=crop&q=80", alt: "Film 3",
        meta: { title: "CINEMA – FILM PORTRAIT", publication: "SIGHT & SOUND | Issue 19", description: "Portraits inspired by cinema's golden age. Film grain as aesthetic intention.", credits: { model: "@emma.film", photographer: "@ssebastiancalle" } },
      },
      {
        id: "fi4", url: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&h=600&fit=crop&q=80", alt: "Film 4",
        meta: { title: "VINTAGE – CLASSIC CAR SERIES", publication: "OCTANE | Issue 32", description: "Vintage cars on Ilford HP5. Speed as memory. Motion as nostalgia.", credits: { photographer: "@ssebastiancalle" } },
      },
      {
        id: "fi5", url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=600&fit=crop&q=80", alt: "Film 5",
        meta: { title: "PROJECTION – CINEMA SPACES", publication: "KINFOLK | Issue 37", description: "The cinema as sacred space. The moment before the film begins and the room holds its breath.", credits: { photographer: "@ssebastiancalle", studio: "@dimgray.studio" } },
      },
      {
        id: "fi6", url: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=600&h=600&fit=crop&q=80", alt: "Film 6",
        meta: { title: "KODACHROME – COLOR FILM", publication: "ANALOG FOREVER | Issue 5", description: "The last rolls of Kodachrome, treated with the reverence they deserve. Some things can't be replicated.", credits: { photographer: "@ssebastiancalle" } },
      },
    ],
  },
];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
void _unused;
