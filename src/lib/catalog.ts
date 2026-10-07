export type Category = 'Laptops' | 'Smartphones' | 'Wireless Earbuds' | 'Smartwatches';
export type UseCase = 'Gaming' | 'Office Work' | 'Content Creation' | 'Casual';
export type Priority =
  | 'High Battery Life'
  | 'Display Quality'
  | 'Portability'
  | 'Camera Performance'
  | 'Audio Quality'
  | 'Performance';

export interface Device {
  name: string;
  price: number;
  image_url: string;
  specs: Record<string, string>;
  why_fits_you: string;
  matchScore: number;
  highlights: string[];
}

export interface BudgetValidationResult {
  isValid: boolean;
  floorPrice: number;
  cutoffPrice: number;
  subcategoryName: string;
  fallbackMessage: string;
  nextSteps: string[];
  adjacentCategorySuggestion: string;
}

export interface RecommendationResponse {
  top_3_devices: Device[];
  fallback_info?: BudgetValidationResult;
}

export interface SubCategoryFloor {
  floor: number;
  cutoff: number;
  fallbackMessage: string;
  adjacentCategory: string;
}

export const CATEGORY_FLOORS: Record<string, SubCategoryFloor> = {
  laptops: {
    floor: 74990,
    cutoff: 37495,
    fallbackMessage: 'No laptops are available at this budget. The cheapest options start around ₹74,990.',
    adjacentCategory: 'refurbished/pre-owned laptops or desktop PCs',
  },
  smartphones: {
    floor: 6999,
    cutoff: 3500,
    fallbackMessage: 'No smartphones are available at this budget. The cheapest options start around ₹6,999.',
    adjacentCategory: 'refurbished/pre-owned smartphones or feature phones',
  },
  'wireless earbuds': {
    floor: 999,
    cutoff: 500,
    fallbackMessage: 'No reliable wireless earbuds are available at this budget. The cheapest options start around ₹999.',
    adjacentCategory: 'wired earphones instead of TWS earbuds',
  },
  tws: {
    floor: 999,
    cutoff: 500,
    fallbackMessage: 'No reliable wireless earbuds are available at this budget. The cheapest options start around ₹999.',
    adjacentCategory: 'wired earphones instead of TWS earbuds',
  },
  smartwatches: {
    floor: 1499,
    cutoff: 750,
    fallbackMessage: 'No smartwatches are available at this budget. The cheapest options start around ₹1,499.',
    adjacentCategory: 'fitness bands or traditional timepieces',
  },
};

export const SUBCATEGORY_FLOORS: Record<string, SubCategoryFloor> = {
  'gaming laptops': {
    floor: 55000,
    cutoff: 27500,
    fallbackMessage: 'No gaming laptops are available at this budget. The cheapest options start around ₹55,000.',
    adjacentCategory: 'refurbished gaming laptops or entry-level desktop PCs',
  },
  'gaming laptop': {
    floor: 55000,
    cutoff: 27500,
    fallbackMessage: 'No gaming laptops are available at this budget. The cheapest options start around ₹55,000.',
    adjacentCategory: 'refurbished gaming laptops or entry-level desktop PCs',
  },
  'flagship smartphones': {
    floor: 50000,
    cutoff: 25000,
    fallbackMessage: 'No flagship smartphones are available at this budget. The cheapest options start around ₹50,000.',
    adjacentCategory: 'upper midrange smartphones or refurbished flagship phones',
  },
  'flagship smartphone': {
    floor: 50000,
    cutoff: 25000,
    fallbackMessage: 'No flagship smartphones are available at this budget. The cheapest options start around ₹50,000.',
    adjacentCategory: 'upper midrange smartphones or refurbished flagship phones',
  },
  'gaming smartphones': {
    floor: 20000,
    cutoff: 10000,
    fallbackMessage: 'No gaming smartphones are available at this budget. The cheapest options start around ₹20,000.',
    adjacentCategory: 'budget smartphones with gaming modes',
  },
  'content creation laptops': {
    floor: 60000,
    cutoff: 30000,
    fallbackMessage: 'No content creation laptops are available at this budget. The cheapest options start around ₹60,000.',
    adjacentCategory: 'refurbished workstation laptops or desktop computers',
  },
};

export function validateBudget(
  categoryStr: string,
  budget: number,
  useCaseStr?: string,
): BudgetValidationResult {
  const normCat = categoryStr.trim().toLowerCase();
  const normUseCase = useCaseStr ? useCaseStr.trim().toLowerCase() : '';

  const combinedKey = `${normUseCase} ${normCat}`.trim();

  let floorConfig: SubCategoryFloor | null = null;
  let subcategoryName = categoryStr;

  if (SUBCATEGORY_FLOORS[combinedKey]) {
    floorConfig = SUBCATEGORY_FLOORS[combinedKey];
    subcategoryName = `${useCaseStr} ${categoryStr}`;
  } else if (SUBCATEGORY_FLOORS[normCat]) {
    floorConfig = SUBCATEGORY_FLOORS[normCat];
    subcategoryName = categoryStr;
  } else {
    for (const key of Object.keys(CATEGORY_FLOORS)) {
      if (normCat.includes(key) || key.includes(normCat)) {
        floorConfig = CATEGORY_FLOORS[key];
        break;
      }
    }
  }

  if (!floorConfig) {
    floorConfig = {
      floor: 1000,
      cutoff: 500,
      fallbackMessage: `No products are available at this budget for ${categoryStr}.`,
      adjacentCategory: 'refurbished or pre-owned alternatives',
    };
  }

  const isValid = budget >= floorConfig.cutoff;

  const nextSteps = [
    `Would you like to explore options near the starting floor price of ₹${floorConfig.floor.toLocaleString('en-IN')}?`,
    `You can also consider refurbished/pre-owned alternatives or adjacent product categories (e.g., ${floorConfig.adjacentCategory}).`,
  ];

  return {
    isValid,
    floorPrice: floorConfig.floor,
    cutoffPrice: floorConfig.cutoff,
    subcategoryName,
    fallbackMessage: floorConfig.fallbackMessage,
    nextSteps,
    adjacentCategorySuggestion: floorConfig.adjacentCategory,
  };
}

export const CATEGORIES: { id: Category; icon: string; blurb: string }[] = [
  { id: 'Laptops', icon: 'Laptop', blurb: 'Portable powerhouses for work & play' },
  { id: 'Smartphones', icon: 'Smartphone', blurb: 'Flagship & value picks in your range' },
  { id: 'Wireless Earbuds', icon: 'Headphones', blurb: 'Immersive sound, all-day comfort' },
  { id: 'Smartwatches', icon: 'Watch', blurb: 'Health tracking & smart features' },
];

export const USE_CASES: { id: UseCase; icon: string; desc: string }[] = [
  { id: 'Gaming', icon: 'Gamepad2', desc: 'High refresh rates, dedicated graphics, low latency' },
  { id: 'Office Work', icon: 'Briefcase', desc: 'Productivity, multitasking, long battery life' },
  { id: 'Content Creation', icon: 'Clapperboard', desc: 'Color-accurate displays, strong CPU/GPU' },
  { id: 'Casual', icon: 'Coffee', desc: 'Everyday browsing, media, social, light tasks' },
];

export const PRIORITIES: { id: Priority; icon: string }[] = [
  { id: 'High Battery Life', icon: 'BatteryFull' },
  { id: 'Display Quality', icon: 'MonitorSmartphone' },
  { id: 'Portability', icon: 'Feather' },
  { id: 'Camera Performance', icon: 'Camera' },
  { id: 'Audio Quality', icon: 'Volume2' },
  { id: 'Performance', icon: 'Cpu' },
];

const CATEGORY_DEFAULT_IMAGES: Record<string, string[]> = {
  Smartphones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=900&q=80',
  ],
  Laptops: [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80',
  ],
  'Wireless Earbuds': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80',
  ],
  'Wireless Earphones': [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=900&q=80',
  ],
  Smartwatches: [
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80',
  ],
};

export function getCategoryImage(category: string, index: number = 0): string {
  const normCategory =
    Object.keys(CATEGORY_DEFAULT_IMAGES).find(
      (k) => k.toLowerCase() === category.toLowerCase() || category.toLowerCase().includes(k.toLowerCase())
    ) || 'Laptops';

  const images = CATEGORY_DEFAULT_IMAGES[normCategory] || CATEGORY_DEFAULT_IMAGES['Laptops'];
  return images[Math.abs(index) % images.length];
}

const PX = 'https://images.pexels.com/photos/';

const CATALOG: CatalogDevice[] = [
  // ===== LAPTOPS =====
  {
    name: 'ASUS ROG Strix G16',
    price: 149990,
    image_url: `${PX}10843996/pexels-photo-10843996.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Intel Core i9-14900HX', RAM: '32GB DDR5', Battery: '90Wh — ~8 hrs', Display: '16" QHD+ 240Hz', Storage: '1TB NVMe SSD', GPU: 'NVIDIA RTX 4070' },
    scores: { Gaming: 9.6, 'Office Work': 6.5, 'Content Creation': 8.2, Casual: 7.0 },
    priorities: { 'High Battery Life': 5, 'Display Quality': 8, Portability: 4, 'Camera Performance': 5, 'Audio Quality': 7, Performance: 9.7 },
    highlights: ['240Hz Gaming Display', 'RTX 4070 Graphics', '32GB DDR5 RAM'],
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    price: 199900,
    image_url: `${PX}8068269/pexels-photo-8068269.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Apple M3 Pro', RAM: '18GB Unified', Battery: '70Wh — ~17 hrs', Display: '14.2" Liquid Retina XDR', Storage: '512GB SSD', GPU: '18-core M3 Pro' },
    scores: { Gaming: 6.0, 'Office Work': 9.4, 'Content Creation': 9.8, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.5, 'Display Quality': 9.8, Portability: 8.5, 'Camera Performance': 7, 'Audio Quality': 8.5, Performance: 9.2 },
    highlights: ['17-hour Battery', 'XDR Display', 'M3 Pro Silicon'],
  },
  {
    name: 'Dell XPS 15',
    price: 129990,
    image_url: `${PX}8989524/pexels-photo-8989524.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Intel Core i7-13700H', RAM: '16GB DDR5', Battery: '86Wh — ~10 hrs', Display: '15.6" OLED 3.5K', Storage: '512GB SSD', GPU: 'Intel Arc A370M' },
    scores: { Gaming: 6.5, 'Office Work': 8.8, 'Content Creation': 9.0, Casual: 8.5 },
    priorities: { 'High Battery Life': 8, 'Display Quality': 9.5, Portability: 7.5, 'Camera Performance': 6, 'Audio Quality': 7, Performance: 8.3 },
    highlights: ['3.5K OLED Display', 'Premium Build', '10-hour Battery'],
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 12',
    price: 159990,
    image_url: `${PX}8217305/pexels-photo-8217305.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Intel Core Ultra 7', RAM: '32GB LPDDR5x', Battery: '57Wh — ~15 hrs', Display: '14" 2.8K OLED', Storage: '1TB SSD', GPU: 'Intel Arc Graphics' },
    scores: { Gaming: 5.0, 'Office Work': 9.7, 'Content Creation': 7.5, Casual: 8.5 },
    priorities: { 'High Battery Life': 9, 'Display Quality': 8.5, Portability: 9.8, 'Camera Performance': 7, 'Audio Quality': 6, Performance: 8 },
    highlights: ['Ultra-light 2.4 lbs', '15-hour Battery', 'Mil-spec Durability'],
  },
  {
    name: 'Acer Swift Go 14',
    price: 74990,
    image_url: `${PX}8533587/pexels-photo-8533587.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Intel Core i5-13420H', RAM: '16GB LPDDR5', Battery: '65Wh — ~11 hrs', Display: '14" 2.8K OLED', Storage: '512GB SSD', GPU: 'Intel Iris Xe' },
    scores: { Gaming: 4.5, 'Office Work': 8.5, 'Content Creation': 7.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 8.5, 'Display Quality': 8, Portability: 9, 'Camera Performance': 6, 'Audio Quality': 6, Performance: 7 },
    highlights: ['Budget OLED', '11-hour Battery', 'Ultra-portable'],
  },
  {
    name: 'Razer Blade 14',
    price: 239990,
    image_url: `${PX}222835/pexels-photo-222835.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'AMD Ryzen 9 7945HX', RAM: '16GB DDR5', Battery: '61Wh — ~6 hrs', Display: '14" QHD+ 240Hz', Storage: '1TB SSD', GPU: 'NVIDIA RTX 4070' },
    scores: { Gaming: 9.3, 'Office Work': 7.5, 'Content Creation': 8.5, Casual: 7.5 },
    priorities: { 'High Battery Life': 4, 'Display Quality': 8.5, Portability: 8, 'Camera Performance': 5, 'Audio Quality': 7, Performance: 9.5 },
    highlights: ['Compact Gaming Beast', '240Hz Display', 'RTX 4070'],
  },

  // ===== SMARTPHONES =====
  {
    name: 'Samsung Galaxy S24 Ultra',
    price: 129999,
    image_url: `${PX}47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Battery: '5000mAh — ~30 hrs', Display: '6.8" QHD+ AMOLED 120Hz', Storage: '256GB', Camera: '200MP Quad' },
    scores: { Gaming: 9.2, 'Office Work': 8.5, 'Content Creation': 9.5, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.5, 'Display Quality': 9.8, Portability: 6, 'Camera Performance': 9.8, 'Audio Quality': 8, Performance: 9.5 },
    highlights: ['200MP Camera', 'S-Pen Included', 'Titanium Frame'],
  },
  {
    name: 'iPhone 15 Pro Max',
    price: 119900,
    image_url: `${PX}215581/pexels-photo-215581.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Apple A17 Pro', RAM: '8GB', Battery: '4422mAh — ~29 hrs', Display: '6.7" Super Retina XDR 120Hz', Storage: '256GB', Camera: '48MP Triple' },
    scores: { Gaming: 9.0, 'Office Work': 8.8, 'Content Creation': 9.7, Casual: 9.2 },
    priorities: { 'High Battery Life': 9, 'Display Quality': 9.5, Portability: 6.5, 'Camera Performance': 9.7, 'Audio Quality': 8.5, Performance: 9.6 },
    highlights: ['Titanium Design', '48MP Pro Camera', 'A17 Pro Chip'],
  },
  {
    name: 'Google Pixel 8 Pro',
    price: 99999,
    image_url: `${PX}5243203/pexels-photo-5243203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Tensor G3', RAM: '12GB', Battery: '5050mAh — ~31 hrs', Display: '6.7" LTPO OLED 120Hz', Storage: '128GB', Camera: '50MP Triple' },
    scores: { Gaming: 7.5, 'Office Work': 8.5, 'Content Creation': 9.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.5, 'Display Quality': 9, Portability: 6, 'Camera Performance': 9.8, 'Audio Quality': 7.5, Performance: 8 },
    highlights: ['AI Photography', '7-year Updates', 'Pure Android'],
  },
  {
    name: 'OnePlus 12',
    price: 64999,
    image_url: `${PX}16772285/pexels-photo-16772285.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Battery: '5400mAh — ~33 hrs', Display: '6.82" 3K AMOLED 120Hz', Storage: '256GB', Camera: '50MP Hasselblad' },
    scores: { Gaming: 9.0, 'Office Work': 8.0, 'Content Creation': 8.5, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.8, 'Display Quality': 9.2, Portability: 5.5, 'Camera Performance': 8.5, 'Audio Quality': 8, Performance: 9.3 },
    highlights: ['100W Fast Charge', 'Hasselblad Camera', '5400mAh Battery'],
  },
  {
    name: 'Samsung Galaxy A55',
    price: 39999,
    image_url: `${PX}214488/pexels-photo-214488.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Exynos 1480', RAM: '8GB', Battery: '5000mAh — ~28 hrs', Display: '6.6" FHD+ Super AMOLED', Storage: '128GB', Camera: '50MP Triple' },
    scores: { Gaming: 6.5, 'Office Work': 7.5, 'Content Creation': 7.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 9, 'Display Quality': 7.5, Portability: 7, 'Camera Performance': 7.5, 'Audio Quality': 7, Performance: 6.8 },
    highlights: ['Budget Flagship', '5000mAh Battery', 'Premium Build'],
  },
  {
    name: 'ASUS ROG Phone 8 Pro',
    price: 94999,
    image_url: `${PX}24181865/pexels-photo-24181865.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Processor: 'Snapdragon 8 Gen 3', RAM: '24GB', Battery: '5500mAh — ~26 hrs', Display: '6.78" AMOLED 165Hz', Storage: '1TB', Camera: '50MP Gimbal' },
    scores: { Gaming: 9.8, 'Office Work': 7.0, 'Content Creation': 8.0, Casual: 8.0 },
    priorities: { 'High Battery Life': 8.5, 'Display Quality': 9.5, Portability: 5, 'Camera Performance': 7.5, 'Audio Quality': 8.5, Performance: 9.8 },
    highlights: ['165Hz Gaming Display', '24GB RAM', 'Active Cooling'],
  },

  // ===== WIRELESS EARBUDS =====
  {
    name: 'Sony WF-1000XM5',
    price: 24990,
    image_url: `${PX}3921817/pexels-photo-3921817.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: '8.4mm Dynamic', Battery: '8 hrs + 24 hrs case', ANC: 'Industry-leading Hybrid', Connectivity: 'Bluetooth 5.3 LDAC', Charging: 'USB-C + Qi Wireless', Water: 'IPX4' },
    scores: { Gaming: 7.5, 'Office Work': 8.5, 'Content Creation': 7.0, Casual: 9.5 },
    priorities: { 'High Battery Life': 8, 'Display Quality': 0, Portability: 9.5, 'Camera Performance': 0, 'Audio Quality': 9.8, Performance: 8.5 },
    highlights: ['Best-in-class ANC', 'LDAC Hi-Res Audio', '8h Battery'],
  },
  {
    name: 'Apple AirPods Pro 2',
    price: 24900,
    image_url: `${PX}7054527/pexels-photo-7054527.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: 'Custom Apple Dynamic', Battery: '6 hrs + 24 hrs case', ANC: 'Adaptive 2x stronger', Connectivity: 'Bluetooth 5.3 H2', Charging: 'USB-C + Qi Wireless', Water: 'IPX4' },
    scores: { Gaming: 7.0, 'Office Work': 8.8, 'Content Creation': 7.5, Casual: 9.7 },
    priorities: { 'High Battery Life': 7, 'Display Quality': 0, Portability: 9.5, 'Camera Performance': 0, 'Audio Quality': 9.5, Performance: 8.5 },
    highlights: ['Adaptive ANC', 'Seamless Apple Ecosystem', 'Spatial Audio'],
  },
  {
    name: 'Bose QuietComfort Ultra',
    price: 25990,
    image_url: `${PX}33797659/pexels-photo-33797659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: 'Custom Bose Driver', Battery: '6 hrs + 24 hrs case', ANC: 'Immersive Audio', Connectivity: 'Bluetooth 5.3 aptX', Charging: 'USB-C', Water: 'IPX4' },
    scores: { Gaming: 7.0, 'Office Work': 9.0, 'Content Creation': 7.0, Casual: 9.5 },
    priorities: { 'High Battery Life': 7, 'Display Quality': 0, Portability: 9, 'Camera Performance': 0, 'Audio Quality': 9.7, Performance: 8 },
    highlights: ['Immersive Spatial Audio', 'Supreme Comfort', 'Top ANC'],
  },
  {
    name: 'Samsung Galaxy Buds3 Pro',
    price: 19999,
    image_url: `${PX}30981655/pexels-photo-30981655.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: 'Dual 11mm + 6mm', Battery: '6 hrs + 24 hrs case', ANC: 'Adaptive Smart', Connectivity: 'Bluetooth 5.3 SSC', Charging: 'USB-C + Qi', Water: 'IPX7' },
    scores: { Gaming: 7.5, 'Office Work': 8.5, 'Content Creation': 7.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 7.5, 'Display Quality': 0, Portability: 9.5, 'Camera Performance': 0, 'Audio Quality': 9.2, Performance: 8 },
    highlights: ['IPX7 Waterproof', 'Dual Drivers', 'Smart ANC'],
  },
  {
    name: 'JBL Tune Beam',
    price: 4999,
    image_url: `${PX}8858287/pexels-photo-8858287.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: '6mm Dynamic', Battery: '12 hrs + 36 hrs case', ANC: 'Adaptive', Connectivity: 'Bluetooth 5.3', Charging: 'USB-C', Water: 'IPX4' },
    scores: { Gaming: 6.5, 'Office Work': 7.5, 'Content Creation': 5.5, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.5, 'Display Quality': 0, Portability: 9, 'Camera Performance': 0, 'Audio Quality': 7.5, Performance: 7 },
    highlights: ['12h Battery', 'Budget Pick', 'Deep Bass'],
  },
  {
    name: 'Sennheiser Momentum True 4',
    price: 24990,
    image_url: `${PX}9204671/pexels-photo-9204671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Driver: '7mm TrueResponse', Battery: '7.5 hrs + 28 hrs case', ANC: 'Adaptive Hybrid', Connectivity: 'Bluetooth 5.4 aptX Lossless', Charging: 'USB-C + Qi', Water: 'IPX4' },
    scores: { Gaming: 7.0, 'Office Work': 8.0, 'Content Creation': 8.5, Casual: 9.0 },
    priorities: { 'High Battery Life': 8, 'Display Quality': 0, Portability: 9, 'Camera Performance': 0, 'Audio Quality': 9.9, Performance: 8.5 },
    highlights: ['aptX Lossless', 'Audiophile Sound', '7.5h Battery'],
  },

  // ===== SMARTWATCHES =====
  {
    name: 'Apple Watch Ultra 2',
    price: 89900,
    image_url: `${PX}18662969/pexels-photo-18662969.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '49mm LTPO OLED Always-On', Battery: '36 hrs / 72h low power', Health: 'ECG, SpO2, Temp, Crash', Connectivity: 'GPS + Cellular 5G', Water: '100m + IP6X', Chip: 'S9 SiP' },
    scores: { Gaming: 5.0, 'Office Work': 8.0, 'Content Creation': 6.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 8.5, 'Display Quality': 9.5, Portability: 8.5, 'Camera Performance': 0, 'Audio Quality': 7, Performance: 8.8 },
    highlights: ['Rugged Titanium', '72h Low Power', 'Cellular 5G'],
  },
  {
    name: 'Samsung Galaxy Watch6 Classic',
    price: 36999,
    image_url: `${PX}267391/pexels-photo-267391.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '47mm Super AMOLED', Battery: '30 hrs', Health: 'BIA, ECG, SpO2, HR', Connectivity: 'GPS + LTE', Water: '50m + IP68', Chip: 'Exynos W930' },
    scores: { Gaming: 5.0, 'Office Work': 8.0, 'Content Creation': 6.5, Casual: 9.0 },
    priorities: { 'High Battery Life': 7, 'Display Quality': 9.2, Portability: 8, 'Camera Performance': 0, 'Audio Quality': 7, Performance: 8 },
    highlights: ['Rotating Bezel', 'BIA Body Comp', 'Premium Design'],
  },
  {
    name: 'Garmin Fenix 7X Pro',
    price: 89990,
    image_url: `${PX}4426516/pexels-photo-4426516.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '51mm MIP Solar', Battery: '28 days smart / 37 days eco', Health: 'Multi-band GPS, HR, SpO2', Connectivity: 'GPS + Wi-Fi', Water: '100m', Chip: 'Garmin proprietary' },
    scores: { Gaming: 4.0, 'Office Work': 7.0, 'Content Creation': 5.0, Casual: 8.5 },
    priorities: { 'High Battery Life': 9.9, 'Display Quality': 7.5, Portability: 7, 'Camera Performance': 0, 'Audio Quality': 5, Performance: 8 },
    highlights: ['28-day Battery', 'Solar Charging', 'Multi-band GPS'],
  },
  {
    name: 'Google Pixel Watch 2',
    price: 39900,
    image_url: `${PX}1682821/pexels-photo-1682821.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '41mm AMOLED Always-On', Battery: '24 hrs', Health: 'ECG, SpO2, HR, Stress', Connectivity: 'GPS + LTE', Water: '50m', Chip: 'Snapdragon W5' },
    scores: { Gaming: 4.5, 'Office Work': 7.5, 'Content Creation': 6.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 6.5, 'Display Quality': 9, Portability: 9, 'Camera Performance': 0, 'Audio Quality': 6.5, Performance: 7.8 },
    highlights: ['Fitbit Integration', 'Stress Tracking', 'Sleek Design'],
  },
  {
    name: 'Amazfit GTR 4',
    price: 16999,
    image_url: `${PX}1080745/pexels-photo-1080745.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '46mm AMOLED', Battery: '14 days', Health: 'HR, SpO2, Sleep', Connectivity: 'GPS + BT', Water: '50m', Chip: 'Amazfit proprietary' },
    scores: { Gaming: 4.0, 'Office Work': 7.0, 'Content Creation': 5.0, Casual: 9.0 },
    priorities: { 'High Battery Life': 9.5, 'Display Quality': 8, Portability: 8, 'Camera Performance': 0, 'Audio Quality': 5, Performance: 7 },
    highlights: ['14-day Battery', 'Budget Pick', 'Built-in GPS'],
  },
  {
    name: 'Apple Watch Series 9',
    price: 41900,
    image_url: `${PX}374619/pexels-photo-374619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940`,
    specs: { Display: '45mm LTPO OLED Always-On', Battery: '18 hrs / 36h low', Health: 'ECG, SpO2, Temp', Connectivity: 'GPS + Cellular', Water: '50m', Chip: 'S9 SiP' },
    scores: { Gaming: 5.0, 'Office Work': 8.0, 'Content Creation': 6.0, Casual: 9.5 },
    priorities: { 'High Battery Life': 6, 'Display Quality': 9.3, Portability: 9, 'Camera Performance': 0, 'Audio Quality': 7, Performance: 8.5 },
    highlights: ['Double Tap Gesture', 'S9 Chip', 'Bright Display'],
  },
];

const CATEGORY_RANGES: Record<Category, [number, number]> = {
  Laptops: [0, 6],
  Smartphones: [6, 12],
  'Wireless Earbuds': [12, 18],
  Smartwatches: [18, 24],
};

export const BUDGET_DEFAULTS: Record<Category, number> = {
  Laptops: 120000,
  Smartphones: 60000,
  'Wireless Earbuds': 15000,
  Smartwatches: 25000,
};

export function getRecommendations(
  category: Category | string,
  budget: number,
  useCase: UseCase | string = 'Casual',
  priorities: Priority[] = [],
): RecommendationResponse {
  const validation = validateBudget(category, budget, useCase);
  if (!validation.isValid) {
    return {
      top_3_devices: [],
      fallback_info: validation,
    };
  }

  const normCatKey = (Object.keys(CATEGORY_RANGES).find(
    (k) => k.toLowerCase() === category.toLowerCase() || category.toLowerCase().includes(k.toLowerCase())
  ) || 'Laptops') as Category;

  const range = CATEGORY_RANGES[normCatKey] || CATEGORY_RANGES['Laptops'];
  const [start, end] = range;
  const allCategoryDevices = CATALOG.slice(start, end);
  let candidatePool = allCategoryDevices.filter((d) => d.price <= budget);

  if (candidatePool.length < 3) {
    // Sort by price ascending so user gets closest choices near starting price
    candidatePool = [...allCategoryDevices].sort((a, b) => Math.abs(a.price - budget) - Math.abs(b.price - budget));
  }

  const scored = candidatePool.map((d) => {
    const ucKey = (useCase as UseCase) in d.scores ? (useCase as UseCase) : 'Casual';
    let score = d.scores[ucKey] * 0.5;
    if (priorities.length > 0) {
      const priAvg =
        priorities.reduce((acc, p) => acc + (d.priorities[p] ?? 0), 0) / priorities.length;
      score += priAvg * 0.4;
    }
    const budgetRatio = d.price <= budget ? d.price / budget : 1 - (d.price - budget) / budget;
    score += Math.max(0, Math.min(budgetRatio, 1)) * 0.1;
    return { device: d, score: Math.round(score * 10) / 10 };
  });

  scored.sort((a, b) => b.score - a.score);
  const top3 = scored.slice(0, 3);

  const devices: Device[] = top3.map(({ device, score }, idx) => {
    const ucKey = (useCase as UseCase) in device.scores ? (useCase as UseCase) : 'Casual';
    const why = buildWhyFitsYou(device, ucKey, priorities, idx === 0);
    return {
      name: device.name,
      price: device.price,
      image_url: device.image_url,
      specs: device.specs,
      why_fits_you: why,
      matchScore: Math.min(99, Math.round(score * 10)),
      highlights: device.highlights,
    };
  });

  return { top_3_devices: devices };
}

function buildWhyFitsYou(
  d: CatalogDevice,
  useCase: UseCase,
  priorities: Priority[],
  isTop: boolean,
): string {
  const parts: string[] = [];
  const topScore = d.scores[useCase];

  if (isTop) {
    parts.push(`Best overall match for ${useCase.toLowerCase()} in your budget`);
  } else {
    parts.push(`Strong ${useCase.toLowerCase()} performer at a great price point`);
  }

  if (topScore >= 9) parts.push(`with class-leading ${useCase.toLowerCase()} capability`);
  if (priorities.includes('High Battery Life') && d.priorities['High Battery Life'] >= 8)
    parts.push('excellent battery life');
  if (priorities.includes('Display Quality') && d.priorities['Display Quality'] >= 9)
    parts.push('a standout display');
  if (priorities.includes('Portability') && d.priorities['Portability'] >= 9)
    parts.push('easy to carry all day');
  if (priorities.includes('Camera Performance') && d.priorities['Camera Performance'] >= 9)
    parts.push('pro-grade cameras');
  if (priorities.includes('Audio Quality') && d.priorities['Audio Quality'] >= 9)
    parts.push('audiophile-grade sound');
  if (priorities.includes('Performance') && d.priorities['Performance'] >= 9)
    parts.push('raw performance headroom');

  return parts.join(', ').replace(/, ([^,]*)$/, ' and $1') + '.';
}
