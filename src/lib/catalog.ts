export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image?: string;
};

export const categories: Category[] = [
  { slug: "aprons", name: "Aprons", blurb: "Durable aprons for kitchen, service & industry.", image: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?auto=format&fit=crop&w=600&q=80" },
  { slug: "chef-wear", name: "Chef Wear", blurb: "Professional chef jackets, pants & accessories.", image: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=600&q=80" },
  { slug: "golfers", name: "Golfers", blurb: "Corporate polo shirts in premium fabrics.", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80" },
  { slug: "jackets", name: "Jackets", blurb: "Workwear & corporate jackets built to last.", image: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=600&q=80" },
  { slug: "safety-footwear", name: "Safety Footwear", blurb: "SABS-approved safety shoes & boots.", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=600&q=80" },
  { slug: "corporate-wear", name: "Corporate Wear", blurb: "Smart, branded corporate uniforms.", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80" },
  { slug: "shirts", name: "Shirts", blurb: "Long & short-sleeve work and corporate shirts.", image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80" },
  { slug: "shorts", name: "Shorts", blurb: "Hard-wearing work shorts.", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=80" },
  { slug: "trousers", name: "Trousers", blurb: "Cargo, chino and conti-style trousers.", image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80" },
  { slug: "hi-vis", name: "Hi-Visibility", blurb: "EN ISO 20471 reflective workwear.", image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=600&q=80" },
  { slug: "headwear", name: "Headwear", blurb: "Caps, beanies, hard hats & bump caps.", image: "https://images.unsplash.com/photo-1534215754734-18e55d13ce35?auto=format&fit=crop&w=600&q=80" },
  { slug: "rain-suits", name: "Rain Suits", blurb: "Waterproof PVC & PU rain protection.", image: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=600&q=80" },
  { slug: "conti-suits", name: "Conti Suits", blurb: "Two-piece work suits in poly-cotton.", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=600&q=80" },
  { slug: "security-wear", name: "Security Wear", blurb: "Tactical & guard uniforms.", image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80" },
  { slug: "service-beauty", name: "Service & Beauty", blurb: "Salon, spa & hospitality uniforms.", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
  { slug: "gumboots", name: "Gumboots", blurb: "PVC & nitrile rubber boots.", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=600&q=80" },
  { slug: "ladies-footwear", name: "Ladies Footwear", blurb: "Safety & corporate shoes for women.", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=80" },
  { slug: "mens-footwear", name: "Men's Footwear", blurb: "Safety & corporate shoes for men.", image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=600&q=80" },
  { slug: "gloves", name: "Protective Gloves", blurb: "Cut, chemical, heat & general gloves.", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
  { slug: "face-protection", name: "Face Protection", blurb: "Masks, shields & respirators.", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80" },
  { slug: "coveralls", name: "Coveralls", blurb: "Disposable & reusable full-body suits.", image: "https://images.unsplash.com/photo-1618090584126-129cd1f3fbaa?auto=format&fit=crop&w=600&q=80" },
  { slug: "sneakers", name: "Sneakers", blurb: "Safety sneakers with composite toes.", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80" },
  { slug: "body-warmers", name: "Body Warmers", blurb: "Insulated sleeveless jackets.", image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80" },
  { slug: "fleece-jackets", name: "Fleece Jackets", blurb: "Soft, warm fleece for layering.", image: "https://images.unsplash.com/photo-1508445861827-7711f397115a?auto=format&fit=crop&w=600&q=80" },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number; // ZAR
  description: string;
  features: string[];
  sizes: string[];
  colors: string[];
  badge?: string;
  featured?: boolean;
};

const STD_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12", "13"];

export const products: Product[] = [
  { id: "p1", slug: "navy-poly-cotton-conti-suit", name: "Navy Poly-Cotton Conti Suit", category: "conti-suits", price: 649, description: "Heavy-duty two-piece conti suit in 65/35 poly-cotton. Reinforced stitching, multiple utility pockets, and a fade-resistant finish ideal for daily site wear.", features: ["240gsm poly-cotton", "Triple-needle stitching", "Branded chest pocket", "SABS compliant"], sizes: STD_SIZES, colors: ["Navy", "Royal", "Khaki"], badge: "Bestseller", featured: true },
  { id: "p2", slug: "hi-vis-orange-bomber-jacket", name: "Hi-Vis Orange Bomber Jacket", category: "hi-vis", price: 899, description: "EN ISO 20471 certified hi-vis bomber with reflective tape, fleece lining and storm cuffs.", features: ["EN ISO 20471 Class 3", "Reflective tape", "Fleece-lined body", "Waterproof outer shell"], sizes: STD_SIZES, colors: ["Hi-Vis Orange", "Hi-Vis Yellow"], featured: true },
  { id: "p3", slug: "steel-toe-safety-boot", name: "Steel Toe Safety Boot", category: "safety-footwear", price: 1199, description: "Full-grain leather safety boot with steel toe-cap, oil-resistant sole and padded ankle collar.", features: ["200J steel toe", "Anti-slip sole", "Heat-resistant up to 300°C", "SABS approved"], sizes: SHOE_SIZES, colors: ["Black", "Brown"], badge: "Top Rated", featured: true },
  { id: "p4", slug: "premium-chef-jacket", name: "Premium Chef Jacket", category: "chef-wear", price: 459, description: "Crisp white chef jacket with knotted cloth buttons and a vented back panel.", features: ["220gsm cotton blend", "Vented back", "Thermometer pocket"], sizes: STD_SIZES, colors: ["White", "Black"], featured: true },
  { id: "p5", slug: "executive-corporate-shirt", name: "Executive Corporate Shirt", category: "shirts", price: 329, description: "Easy-care long-sleeve corporate shirt with a tailored fit.", features: ["Easy-iron poly-cotton", "Tailored fit", "Reinforced collar"], sizes: STD_SIZES, colors: ["White", "Sky Blue", "Charcoal"] },
  { id: "p6", slug: "cargo-work-trouser", name: "Cargo Work Trouser", category: "trousers", price: 389, description: "Hard-wearing cargo trouser with knee-pad pockets and gusseted crotch.", features: ["260gsm fabric", "Knee-pad pockets", "Bartack reinforcement"], sizes: STD_SIZES, colors: ["Navy", "Khaki", "Black"] },
  { id: "p7", slug: "performance-golfer-shirt", name: "Performance Golfer Shirt", category: "golfers", price: 279, description: "Moisture-wicking golfer in premium pique knit.", features: ["180gsm dri-fit", "UPF 30+", "Three-button placket"], sizes: STD_SIZES, colors: ["Navy", "White", "Charcoal", "Red"], featured: true },
  { id: "p8", slug: "heavy-duty-pvc-rain-suit", name: "Heavy Duty PVC Rain Suit", category: "rain-suits", price: 369, description: "Two-piece PVC rain suit with welded seams and storm flap.", features: ["100% waterproof", "Welded seams", "Hooded jacket"], sizes: STD_SIZES, colors: ["Yellow", "Navy"] },
  { id: "p9", slug: "nitrile-coated-gloves", name: "Nitrile Coated Gloves", category: "gloves", price: 49, description: "Seamless knit glove with nitrile palm for grip in oily conditions.", features: ["EN 388 4.1.2.1", "Breathable back", "Snug fit"], sizes: ["7", "8", "9", "10", "11"], colors: ["Grey/Black"] },
  { id: "p10", slug: "ffp2-face-mask-20pk", name: "FFP2 Face Mask (20pk)", category: "face-protection", price: 219, description: "Filtering half-mask offering ≥94% filtration efficiency.", features: ["FFP2 / N95 grade", "Adjustable nose clip", "20 per box"], sizes: ["One Size"], colors: ["White"] },
  { id: "p11", slug: "disposable-coverall-type-5-6", name: "Disposable Coverall Type 5/6", category: "coveralls", price: 159, description: "Lightweight non-woven coverall offering protection against dust and light liquid splash.", features: ["Type 5/6 certified", "Elastic cuffs & hood", "Anti-static"], sizes: ["M", "L", "XL", "2XL"], colors: ["White"] },
  { id: "p12", slug: "security-tactical-shirt", name: "Security Tactical Shirt", category: "security-wear", price: 349, description: "Short-sleeve tactical shirt with epaulettes and pen pockets.", features: ["Ripstop fabric", "Epaulettes", "Hidden side vents"], sizes: STD_SIZES, colors: ["Black", "Navy"] },
  { id: "p13", slug: "black-pvc-gumboot", name: "Black PVC Gumboot", category: "gumboots", price: 289, description: "Waterproof PVC gumboot with anti-slip tread.", features: ["100% waterproof", "Steel toe option", "Oil resistant sole"], sizes: SHOE_SIZES, colors: ["Black"] },
  { id: "p14", slug: "ladies-safety-trainer", name: "Ladies Safety Trainer", category: "ladies-footwear", price: 999, description: "Lightweight safety trainer with composite toe, sized for women.", features: ["Composite toe-cap", "Memory foam insole", "ASTM F2413"], sizes: ["4", "5", "6", "7", "8", "9"], colors: ["Black", "Grey"] },
  { id: "p15", slug: "industrial-fleece-jacket", name: "Industrial Fleece Jacket", category: "fleece-jackets", price: 449, description: "320gsm anti-pill fleece with zip pockets.", features: ["320gsm anti-pill", "YKK zip", "Side pockets"], sizes: STD_SIZES, colors: ["Black", "Navy", "Charcoal"] },
  { id: "p16", slug: "padded-body-warmer", name: "Padded Body Warmer", category: "body-warmers", price: 549, description: "Quilted body warmer with high collar.", features: ["Quilted polyester", "High collar", "Two-way zip"], sizes: STD_SIZES, colors: ["Black", "Navy"] },
  { id: "p17", slug: "premium-leather-apron", name: "Premium Leather Apron", category: "aprons", price: 599, description: "Full-grain leather apron with adjustable straps.", features: ["Full-grain leather", "Cross-back straps", "Tool pockets"], sizes: ["One Size"], colors: ["Brown", "Black"] },
  { id: "p18", slug: "hi-vis-bump-cap", name: "Hi-Vis Bump Cap", category: "headwear", price: 189, description: "Baseball-style cap with impact-absorbing ABS shell insert.", features: ["EN 812 certified", "Reflective trim", "Adjustable strap"], sizes: ["One Size"], colors: ["Hi-Vis Yellow", "Navy"] },
  { id: "p19", slug: "salon-tunic-dress", name: "Salon Tunic Dress", category: "service-beauty", price: 379, description: "Stretch tunic dress for salon and spa professionals.", features: ["4-way stretch", "Side pockets", "Easy care"], sizes: STD_SIZES, colors: ["Black", "White", "Navy"] },
  { id: "p20", slug: "all-weather-work-shorts", name: "All-Weather Work Shorts", category: "shorts", price: 259, description: "Knee-length work shorts with cargo pockets.", features: ["230gsm fabric", "Cargo pockets", "Triple stitched"], sizes: STD_SIZES, colors: ["Khaki", "Navy", "Black"] },
];

export const formatZAR = (cents: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(cents);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProductsByCategory = (slug: string) => products.filter((p) => p.category === slug);
export const searchProducts = (q: string) => {
  const s = q.toLowerCase().trim();
  if (!s) return [] as Product[];
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      p.category.toLowerCase().includes(s),
  );
};
