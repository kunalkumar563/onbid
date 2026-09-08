import type {
  CategoryOption,
  ListingCategory,
  SubCategoryOption,
  SubSubCategoryOption,
} from "../types/listing";

export const LISTING_CATEGORIES: CategoryOption[] = [
  {
    value: "electronics",
    label: "Electronics",
    minimumPrice: 2500,
  },
  {
    value: "art_collectibles",
    label: "Art & Collectibles",
    minimumPrice: 500,
  },
  {
    value: "fashion",
    label: "Fashion",
    minimumPrice: 500,
  },
  {
    value: "jewelry_watches",
    label: "Jewelry & Watches",
    minimumPrice: 500,
  },
  {
    value: "home_garden",
    label: "Home & Garden",
    minimumPrice: 500,
  },
  {
    value: "sports",
    label: "Sports",
    minimumPrice: 500,
  },
  {
    value: "stationery_office",
    label: "Stationery & Office",
    minimumPrice: 300,
  },
];

export const SUB_CATEGORIES: Record<
  ListingCategory,
  SubCategoryOption[]
> = {
  /* =====================================================
     ELECTRONICS
     ===================================================== */

  electronics: [
    {
      value: "mobile_tablets",
      label: "Mobile & Tablets",
    },
    {
      value: "computers",
      label: "Computers & Accessories",
    },
    {
      value: "cameras",
      label: "Cameras & Photography",
    },
    {
      value: "audio",
      label: "Audio",
    },
    {
      value: "televisions",
      label: "Televisions & Home Entertainment",
    },
    {
      value: "gaming",
      label: "Gaming",
    },
    {
      value: "wearable_technology",
      label: "Wearable Technology",
    },
    {
      value: "smart_home",
      label: "Smart Home",
    },
    {
      value: "electronic_accessories",
      label: "Electronic Accessories",
    },
  ],

  /* =====================================================
     ART & COLLECTIBLES
     ===================================================== */

  art_collectibles: [
    {
      value: "paintings",
      label: "Paintings",
    },
    {
      value: "prints_posters",
      label: "Prints & Posters",
    },
    {
      value: "photography",
      label: "Photography",
    },
    {
      value: "sculptures",
      label: "Sculptures",
    },
    {
      value: "coins_currency",
      label: "Coins & Currency",
    },
    {
      value: "stamps",
      label: "Stamps",
    },
    {
      value: "memorabilia",
      label: "Memorabilia",
    },
    {
      value: "collectible_cards",
      label: "Collectible Cards",
    },
    {
      value: "figurines_models",
      label: "Figurines & Models",
    },
    {
      value: "musical_collectibles",
      label: "Musical Collectibles",
    },
  ],

  /* =====================================================
     FASHION
     ===================================================== */

  fashion: [
    {
      value: "mens_clothing",
      label: "Men's Clothing",
    },
    {
      value: "womens_clothing",
      label: "Women's Clothing",
    },
    {
      value: "kids_clothing",
      label: "Kids' Clothing",
    },
    {
      value: "footwear",
      label: "Footwear",
    },
    {
      value: "bags",
      label: "Bags",
    },
    {
      value: "wallets_belts",
      label: "Wallets & Belts",
    },
    {
      value: "sunglasses",
      label: "Sunglasses",
    },
    {
      value: "fashion_accessories",
      label: "Fashion Accessories",
    },
  ],

  /* =====================================================
     JEWELRY & WATCHES
     ===================================================== */

  jewelry_watches: [
    {
      value: "fine_jewelry",
      label: "Fine Jewelry",
    },
    {
      value: "fashion_jewelry",
      label: "Fashion Jewelry",
    },
    {
      value: "rings",
      label: "Rings",
    },
    {
      value: "necklaces",
      label: "Necklaces",
    },
    {
      value: "bracelets",
      label: "Bracelets",
    },
    {
      value: "earrings",
      label: "Earrings",
    },
    {
      value: "mens_watches",
      label: "Men's Watches",
    },
    {
      value: "womens_watches",
      label: "Women's Watches",
    },
    {
      value: "smartwatches",
      label: "Smartwatches",
    },
    {
      value: "watch_accessories",
      label: "Watch Accessories",
    },
  ],

  /* =====================================================
     HOME & GARDEN
     ===================================================== */

  home_garden: [
    {
      value: "furniture",
      label: "Furniture",
    },
    {
      value: "home_decor",
      label: "Home Decor",
    },
    {
      value: "kitchen_dining",
      label: "Kitchen & Dining",
    },
    {
      value: "home_appliances",
      label: "Home Appliances",
    },
    {
      value: "lighting",
      label: "Lighting",
    },
    {
      value: "garden_outdoor",
      label: "Garden & Outdoor",
    },
    {
      value: "tools_hardware",
      label: "Tools & Hardware",
    },
    {
      value: "storage_organization",
      label: "Storage & Organization",
    },
  ],

  /* =====================================================
     SPORTS
     ===================================================== */

  sports: [
    {
      value: "cricket",
      label: "Cricket",
    },
    {
      value: "football",
      label: "Football",
    },
    {
      value: "badminton",
      label: "Badminton",
    },
    {
      value: "tennis",
      label: "Tennis",
    },
    {
      value: "fitness",
      label: "Fitness & Gym",
    },
    {
      value: "cycling",
      label: "Cycling",
    },
    {
      value: "running",
      label: "Running",
    },
    {
      value: "outdoor_adventure",
      label: "Outdoor & Adventure",
    },
    {
      value: "sports_memorabilia",
      label: "Sports Memorabilia",
    },
    {
      value: "sports_equipment",
      label: "Sports Equipment",
    },
  ],

  /* =====================================================
     STATIONERY & OFFICE
     ===================================================== */

  stationery_office: [
    {
      value: "writing",
      label: "Writing Instruments",
    },
    {
      value: "notebooks_journals",
      label: "Notebooks & Journals",
    },
    {
      value: "school_supplies",
      label: "School Supplies",
    },
    {
      value: "art_drawing",
      label: "Art & Drawing Supplies",
    },
    {
      value: "office_supplies",
      label: "Office Supplies",
    },
    {
      value: "desk_accessories",
      label: "Desk Accessories",
    },
    {
      value: "paper_products",
      label: "Paper Products",
    },
    {
      value: "bags_cases",
      label: "Bags & Cases",
    },
    {
      value: "books_study",
      label: "Books & Study Material",
    },
  ],
};

/* =========================================================
   SUB-SUB-CATEGORIES
   ========================================================= */

export const SUB_SUB_CATEGORIES: Record<
  string,
  SubSubCategoryOption[]
> = {
  /* ---------------- ELECTRONICS ---------------- */

  mobile_tablets: [
    { value: "smartphones", label: "Smartphones" },
    { value: "tablets", label: "Tablets" },
    { value: "e_readers", label: "E-readers" },
    { value: "feature_phones", label: "Feature Phones" },
  ],

  computers: [
    { value: "laptops", label: "Laptops" },
    { value: "desktop_pcs", label: "Desktop PCs" },
    { value: "monitors", label: "Monitors" },
    { value: "keyboards", label: "Keyboards" },
    { value: "mice", label: "Mice" },
    { value: "webcams", label: "Webcams" },
  ],

  cameras: [
    { value: "dslr", label: "DSLR Cameras" },
    { value: "mirrorless", label: "Mirrorless Cameras" },
    { value: "point_shoot", label: "Point & Shoot Cameras" },
    { value: "action_cameras", label: "Action Cameras" },
    { value: "camera_lenses", label: "Camera Lenses" },
    { value: "camera_accessories", label: "Camera Accessories" },
  ],

  audio: [
    { value: "headphones", label: "Headphones" },
    { value: "earbuds", label: "Earbuds" },
    { value: "speakers", label: "Speakers" },
    { value: "soundbars", label: "Soundbars" },
    { value: "microphones", label: "Microphones" },
    { value: "amplifiers", label: "Amplifiers" },
  ],

  televisions: [
    { value: "smart_tvs", label: "Smart TVs" },
    { value: "led_tvs", label: "LED TVs" },
    { value: "projectors", label: "Projectors" },
    { value: "streaming_devices", label: "Streaming Devices" },
    { value: "media_players", label: "Media Players" },
  ],

  gaming: [
    { value: "gaming_consoles", label: "Gaming Consoles" },
    { value: "handheld_consoles", label: "Handheld Consoles" },
    { value: "controllers", label: "Controllers" },
    { value: "gaming_headsets", label: "Gaming Headsets" },
    { value: "gaming_accessories", label: "Gaming Accessories" },
  ],

  wearable_technology: [
    { value: "smartwatches", label: "Smartwatches" },
    { value: "fitness_trackers", label: "Fitness Trackers" },
    { value: "smart_bands", label: "Smart Bands" },
    { value: "vr_headsets", label: "VR Headsets" },
  ],

  smart_home: [
    { value: "smart_lights", label: "Smart Lights" },
    { value: "smart_speakers", label: "Smart Speakers" },
    { value: "smart_cameras", label: "Smart Cameras" },
    { value: "smart_plugs", label: "Smart Plugs" },
    { value: "smart_sensors", label: "Smart Sensors" },
  ],

  electronic_accessories: [
    { value: "chargers", label: "Chargers" },
    { value: "power_banks", label: "Power Banks" },
    { value: "cables", label: "Cables" },
    { value: "adapters", label: "Adapters" },
    { value: "storage_devices", label: "Storage Devices" },
  ],

  /* ---------------- ART & COLLECTIBLES ---------------- */

  paintings: [
    { value: "oil_paintings", label: "Oil Paintings" },
    { value: "acrylic_paintings", label: "Acrylic Paintings" },
    { value: "watercolor_paintings", label: "Watercolor Paintings" },
    { value: "mixed_media", label: "Mixed Media" },
  ],

  prints_posters: [
    { value: "art_prints", label: "Art Prints" },
    { value: "vintage_posters", label: "Vintage Posters" },
    { value: "movie_posters", label: "Movie Posters" },
    { value: "music_posters", label: "Music Posters" },
  ],

  photography: [
    { value: "fine_art_photography", label: "Fine Art Photography" },
    { value: "vintage_photographs", label: "Vintage Photographs" },
    { value: "signed_photographs", label: "Signed Photographs" },
  ],

  sculptures: [
    { value: "metal_sculptures", label: "Metal Sculptures" },
    { value: "wood_sculptures", label: "Wood Sculptures" },
    { value: "stone_sculptures", label: "Stone Sculptures" },
    { value: "ceramic_sculptures", label: "Ceramic Sculptures" },
  ],

  coins_currency: [
    { value: "indian_coins", label: "Indian Coins" },
    { value: "foreign_coins", label: "Foreign Coins" },
    { value: "commemorative_coins", label: "Commemorative Coins" },
    { value: "banknotes", label: "Banknotes" },
  ],

  stamps: [
    { value: "indian_stamps", label: "Indian Stamps" },
    { value: "foreign_stamps", label: "Foreign Stamps" },
    { value: "commemorative_stamps", label: "Commemorative Stamps" },
    { value: "stamp_collections", label: "Stamp Collections" },
  ],

  memorabilia: [
    { value: "celebrity_memorabilia", label: "Celebrity Memorabilia" },
    { value: "movie_memorabilia", label: "Movie Memorabilia" },
    { value: "music_memorabilia", label: "Music Memorabilia" },
    { value: "historical_memorabilia", label: "Historical Memorabilia" },
  ],

  collectible_cards: [
    { value: "trading_cards", label: "Trading Cards" },
    { value: "sports_cards", label: "Sports Cards" },
    { value: "game_cards", label: "Game Cards" },
    { value: "collectible_card_sets", label: "Card Sets" },
  ],

  figurines_models: [
    { value: "action_figures", label: "Action Figures" },
    { value: "model_cars", label: "Model Cars" },
    { value: "miniatures", label: "Miniatures" },
    { value: "collectible_figures", label: "Collectible Figures" },
  ],

  musical_collectibles: [
    { value: "vinyl_records", label: "Vinyl Records" },
    { value: "vintage_instruments", label: "Vintage Instruments" },
    { value: "signed_music_items", label: "Signed Music Items" },
    { value: "music_merchandise", label: "Music Merchandise" },
  ],

  /* ---------------- FASHION ---------------- */

  mens_clothing: [
    { value: "shirts", label: "Shirts" },
    { value: "t_shirts", label: "T-Shirts" },
    { value: "jackets", label: "Jackets" },
    { value: "jeans_trousers", label: "Jeans & Trousers" },
    { value: "ethnic_wear", label: "Ethnic Wear" },
    { value: "suits_blazers", label: "Suits & Blazers" },
  ],

  womens_clothing: [
    { value: "dresses", label: "Dresses" },
    { value: "tops", label: "Tops" },
    { value: "jeans_trousers_women", label: "Jeans & Trousers" },
    { value: "ethnic_wear_women", label: "Ethnic Wear" },
    { value: "jackets_women", label: "Jackets" },
    { value: "sarees", label: "Sarees" },
  ],

  kids_clothing: [
    { value: "boys_clothing", label: "Boys' Clothing" },
    { value: "girls_clothing", label: "Girls' Clothing" },
    { value: "kids_ethnic_wear", label: "Kids' Ethnic Wear" },
    { value: "kids_outerwear", label: "Kids' Outerwear" },
  ],

  footwear: [
    { value: "sneakers", label: "Sneakers" },
    { value: "sports_shoes", label: "Sports Shoes" },
    { value: "formal_shoes", label: "Formal Shoes" },
    { value: "boots", label: "Boots" },
    { value: "sandals", label: "Sandals" },
    { value: "heels", label: "Heels" },
  ],

  bags: [
    { value: "backpacks", label: "Backpacks" },
    { value: "handbags", label: "Handbags" },
    { value: "laptop_bags", label: "Laptop Bags" },
    { value: "duffle_bags", label: "Duffle Bags" },
    { value: "travel_bags", label: "Travel Bags" },
  ],

  wallets_belts: [
    { value: "wallets", label: "Wallets" },
    { value: "card_holders", label: "Card Holders" },
    { value: "belts", label: "Belts" },
  ],

  sunglasses: [
    { value: "aviator", label: "Aviator" },
    { value: "wayfarer", label: "Wayfarer" },
    { value: "round_sunglasses", label: "Round" },
    { value: "sport_sunglasses", label: "Sport" },
  ],

  fashion_accessories: [
    { value: "scarves", label: "Scarves" },
    { value: "caps_hats", label: "Caps & Hats" },
    { value: "ties", label: "Ties" },
    { value: "fashion_jewelry", label: "Fashion Jewelry" },
    { value: "hair_accessories", label: "Hair Accessories" },
  ],

  /* ---------------- JEWELRY & WATCHES ---------------- */

  fine_jewelry: [
    { value: "gold_jewelry", label: "Gold Jewelry" },
    { value: "silver_jewelry", label: "Silver Jewelry" },
    { value: "diamond_jewelry", label: "Diamond Jewelry" },
    { value: "gemstone_jewelry", label: "Gemstone Jewelry" },
  ],

  fashion_jewelry: [
    { value: "costume_jewelry", label: "Costume Jewelry" },
    { value: "beaded_jewelry", label: "Beaded Jewelry" },
    { value: "handmade_jewelry", label: "Handmade Jewelry" },
  ],

  rings: [
    { value: "engagement_rings", label: "Engagement Rings" },
    { value: "fashion_rings", label: "Fashion Rings" },
    { value: "gemstone_rings", label: "Gemstone Rings" },
  ],

  necklaces: [
    { value: "pendant_necklaces", label: "Pendant Necklaces" },
    { value: "chain_necklaces", label: "Chain Necklaces" },
    { value: "statement_necklaces", label: "Statement Necklaces" },
  ],

  bracelets: [
    { value: "chain_bracelets", label: "Chain Bracelets" },
    { value: "charm_bracelets", label: "Charm Bracelets" },
    { value: "bangles", label: "Bangles" },
  ],

  earrings: [
    { value: "stud_earrings", label: "Stud Earrings" },
    { value: "hoop_earrings", label: "Hoop Earrings" },
    { value: "drop_earrings", label: "Drop Earrings" },
  ],

  mens_watches: [
    { value: "mechanical_watches", label: "Mechanical Watches" },
    { value: "automatic_watches", label: "Automatic Watches" },
    { value: "quartz_watches", label: "Quartz Watches" },
    { value: "luxury_watches", label: "Luxury Watches" },
  ],

  womens_watches: [
    { value: "analog_watches", label: "Analog Watches" },
    { value: "dress_watches", label: "Dress Watches" },
    { value: "luxury_womens_watches", label: "Luxury Watches" },
  ],

  smartwatches: [
    { value: "fitness_smartwatches", label: "Fitness Smartwatches" },
    { value: "premium_smartwatches", label: "Premium Smartwatches" },
    { value: "everyday_smartwatches", label: "Everyday Smartwatches" },
  ],

  watch_accessories: [
    { value: "watch_straps", label: "Watch Straps" },
    { value: "watch_boxes", label: "Watch Boxes" },
    { value: "watch_winders", label: "Watch Winders" },
  ],

  /* ---------------- HOME & GARDEN ---------------- */

  furniture: [
    { value: "chairs", label: "Chairs" },
    { value: "tables", label: "Tables" },
    { value: "desks", label: "Desks" },
    { value: "sofas", label: "Sofas" },
    { value: "beds", label: "Beds" },
    { value: "shelves", label: "Shelves & Bookcases" },
  ],

  home_decor: [
    { value: "wall_decor", label: "Wall Decor" },
    { value: "decorative_objects", label: "Decorative Objects" },
    { value: "mirrors", label: "Mirrors" },
    { value: "rugs", label: "Rugs & Carpets" },
    { value: "cushions", label: "Cushions & Throws" },
  ],

  kitchen_dining: [
    { value: "cookware", label: "Cookware" },
    { value: "dinnerware", label: "Dinnerware" },
    { value: "glassware", label: "Glassware" },
    { value: "cutlery", label: "Cutlery" },
    { value: "kitchen_tools", label: "Kitchen Tools" },
  ],

  home_appliances: [
    { value: "fans", label: "Fans" },
    { value: "vacuum_cleaners", label: "Vacuum Cleaners" },
    { value: "air_purifiers", label: "Air Purifiers" },
    { value: "heaters", label: "Heaters" },
    { value: "irons", label: "Irons" },
  ],

  lighting: [
    { value: "table_lamps", label: "Table Lamps" },
    { value: "floor_lamps", label: "Floor Lamps" },
    { value: "ceiling_lights", label: "Ceiling Lights" },
    { value: "decorative_lighting", label: "Decorative Lighting" },
  ],

  garden_outdoor: [
    { value: "garden_tools", label: "Garden Tools" },
    { value: "planters", label: "Planters" },
    { value: "outdoor_furniture", label: "Outdoor Furniture" },
    { value: "garden_decor", label: "Garden Decor" },
  ],

  tools_hardware: [
    { value: "hand_tools", label: "Hand Tools" },
    { value: "power_tools", label: "Power Tools" },
    { value: "tool_sets", label: "Tool Sets" },
    { value: "hardware", label: "Hardware" },
  ],

  storage_organization: [
    { value: "storage_boxes", label: "Storage Boxes" },
    { value: "cabinets", label: "Cabinets" },
    { value: "organizers", label: "Organizers" },
    { value: "shelving", label: "Shelving" },
  ],

  /* ---------------- SPORTS ---------------- */

  cricket: [
    { value: "cricket_bats", label: "Cricket Bats" },
    { value: "cricket_balls", label: "Cricket Balls" },
    { value: "cricket_kits", label: "Cricket Kits" },
    { value: "cricket_protection", label: "Protection Gear" },
  ],

  football: [
    { value: "football_balls", label: "Football Balls" },
    { value: "football_boots", label: "Football Boots" },
    { value: "football_kits", label: "Football Kits" },
    { value: "football_equipment", label: "Football Equipment" },
  ],

  badminton: [
    { value: "badminton_rackets", label: "Badminton Rackets" },
    { value: "badminton_shuttlecocks", label: "Shuttlecocks" },
    { value: "badminton_kits", label: "Badminton Kits" },
    { value: "badminton_accessories", label: "Badminton Accessories" },
  ],

  tennis: [
    { value: "tennis_rackets", label: "Tennis Rackets" },
    { value: "tennis_balls", label: "Tennis Balls" },
    { value: "tennis_bags", label: "Tennis Bags" },
    { value: "tennis_accessories", label: "Tennis Accessories" },
  ],

  fitness: [
    { value: "dumbbells", label: "Dumbbells" },
    { value: "kettlebells", label: "Kettlebells" },
    { value: "exercise_equipment", label: "Exercise Equipment" },
    { value: "fitness_accessories", label: "Fitness Accessories" },
  ],

  cycling: [
    { value: "cycling_helmets", label: "Cycling Helmets" },
    { value: "cycling_jerseys", label: "Cycling Jerseys" },
    { value: "cycling_shoes", label: "Cycling Shoes" },
    { value: "cycling_accessories", label: "Cycling Accessories" },
  ],

  running: [
    { value: "running_shoes", label: "Running Shoes" },
    { value: "running_wear", label: "Running Wear" },
    { value: "running_accessories", label: "Running Accessories" },
    { value: "running_electronics", label: "Running Electronics" },
  ],

  outdoor_adventure: [
    { value: "camping_gear", label: "Camping Gear" },
    { value: "hiking_gear", label: "Hiking Gear" },
    { value: "trekking_gear", label: "Trekking Gear" },
    { value: "adventure_accessories", label: "Adventure Accessories" },
  ],

  sports_memorabilia: [
    { value: "signed_jerseys", label: "Signed Jerseys" },
    { value: "signed_equipment", label: "Signed Equipment" },
    { value: "sports_photos", label: "Sports Photographs" },
    { value: "sports_collectibles", label: "Sports Collectibles" },
  ],

  sports_equipment: [
    { value: "training_equipment", label: "Training Equipment" },
    { value: "protective_gear", label: "Protective Gear" },
    { value: "sports_bags", label: "Sports Bags" },
    { value: "sports_accessories", label: "Sports Accessories" },
  ],

  /* ---------------- STATIONERY & OFFICE ---------------- */

  writing: [
    { value: "ball_pens", label: "Ball Pens" },
    { value: "gel_pens", label: "Gel Pens" },
    { value: "fountain_pens", label: "Fountain Pens" },
    { value: "pencils", label: "Pencils" },
    { value: "mechanical_pencils", label: "Mechanical Pencils" },
    { value: "markers", label: "Markers & Highlighters" },
  ],

  notebooks_journals: [
    { value: "notebooks", label: "Notebooks" },
    { value: "journals", label: "Journals" },
    { value: "diaries", label: "Diaries & Planners" },
    { value: "sketchbooks", label: "Sketchbooks" },
  ],

  school_supplies: [
    { value: "school_kits", label: "School Kits" },
    { value: "geometry_sets", label: "Geometry Sets" },
    { value: "erasers_sharpeners", label: "Erasers & Sharpeners" },
    { value: "school_organizers", label: "School Organizers" },
  ],

  art_drawing: [
    { value: "sketching_pencils", label: "Sketching Pencils" },
    { value: "color_pencils", label: "Color Pencils" },
    { value: "crayons", label: "Crayons" },
    { value: "watercolors", label: "Watercolors" },
    { value: "acrylic_colors", label: "Acrylic Colors" },
    { value: "drawing_tools", label: "Drawing Tools" },
  ],

  office_supplies: [
    { value: "folders_files", label: "Folders & Files" },
    { value: "staplers", label: "Staplers" },
    { value: "paper_clips", label: "Paper Clips & Fasteners" },
    { value: "labels", label: "Labels & Stickers" },
    { value: "calculators", label: "Calculators" },
  ],

  desk_accessories: [
    { value: "pen_holders", label: "Pen Holders" },
    { value: "desk_organizers", label: "Desk Organizers" },
    { value: "desk_calendars", label: "Desk Calendars" },
    { value: "mouse_pads", label: "Mouse Pads" },
    { value: "desk_decor", label: "Desk Decor" },
  ],

  paper_products: [
    { value: "copy_paper", label: "Copy Paper" },
    { value: "colored_paper", label: "Colored Paper" },
    { value: "craft_paper", label: "Craft Paper" },
    { value: "sticky_notes", label: "Sticky Notes" },
    { value: "envelopes", label: "Envelopes" },
  ],

  bags_cases: [
    { value: "pencil_cases", label: "Pencil Cases" },
    { value: "document_cases", label: "Document Cases" },
    { value: "stationery_pouches", label: "Stationery Pouches" },
    { value: "school_bags", label: "School Bags" },
  ],

  books_study: [
    { value: "textbooks", label: "Textbooks" },
    { value: "reference_books", label: "Reference Books" },
    { value: "competitive_exam_books", label: "Competitive Exam Books" },
    { value: "study_guides", label: "Study Guides" },
    { value: "educational_material", label: "Educational Material" },
  ],
};

/* =========================================================
   HELPERS
   ========================================================= */

export function getSubCategories(
  category: ListingCategory,
): SubCategoryOption[] {
  return SUB_CATEGORIES[category] ?? [];
}

export function getSubSubCategories(
  subCategory: string,
): SubSubCategoryOption[] {
  return SUB_SUB_CATEGORIES[subCategory] ?? [];
}

export function getCategoryMinimumPrice(
  category: ListingCategory,
): number {
  return (
    LISTING_CATEGORIES.find(
      (item) => item.value === category,
    )?.minimumPrice ?? 0
  );
}

export function getCategoryLabel(
  category: ListingCategory,
): string {
  return (
    LISTING_CATEGORIES.find(
      (item) => item.value === category,
    )?.label ?? category
  );
}

export function getSubCategoryLabel(
  category: ListingCategory,
  subCategory: string,
): string {
  return (
    getSubCategories(category).find(
      (item) => item.value === subCategory,
    )?.label ?? subCategory
  );
}

export function getSubSubCategoryLabel(
  subCategory: string,
  subSubCategory: string,
): string {
  return (
    getSubSubCategories(subCategory).find(
      (item) => item.value === subSubCategory,
    )?.label ?? subSubCategory
  );
}