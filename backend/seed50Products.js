import database from "./database/db.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const productsData = [
  // ELECTRONICS (12 products)
  {
    name: "Ultra HD 4K OLED Smart TV (55-inch)",
    description: "Cinematic picture quality with self-lit pixels, Dolby Vision IQ, and AI 4K Processor.",
    price: 1299.99,
    category: "Electronics",
    stock: 10,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600"
  },
  {
    name: "Noise-Cancelling Wireless Headphones Pro",
    description: "Active noise cancellation, 30-hour battery life, and crystal-clear microphone calls.",
    price: 249.50,
    category: "Electronics",
    stock: 25,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
  },
  {
    name: "Flagship 5G Smartphone (256GB)",
    description: "120Hz Super Retina XDR display, pro camera system with 100x zoom, and all-day battery.",
    price: 999.00,
    category: "Electronics",
    stock: 15,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"
  },
  {
    name: "Mechanical Gaming Keyboard RGB",
    description: "Hot-swappable tactile switches, per-key RGB backlighting, and solid aluminum casing.",
    price: 89.99,
    category: "Electronics",
    stock: 40,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"
  },
  {
    name: "Ergonomic Wireless Gaming Mouse",
    description: "26,000 DPI optical sensor, ultra-lightweight design, and 70-hour rechargeable battery.",
    price: 49.99,
    category: "Electronics",
    stock: 50,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600"
  },
  {
    name: "Smartwatch Series 9 GPS + Cellular",
    description: "Advanced health tracking, ECG monitoring, bright Always-On retina display.",
    price: 399.00,
    category: "Electronics",
    stock: 20,
    ratings: 4.85,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
  },
  {
    name: "Portable Bluetooth Speaker Waterproof (IPX7)",
    description: "Deep bass sound, 24-hour continuous playtime, and rugged shockproof build.",
    price: 69.95,
    category: "Electronics",
    stock: 35,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"
  },
  {
    name: "Ultra-Wide 34-inch Curved Gaming Monitor",
    description: "144Hz refresh rate, 1ms response time, HDR400, and AMD FreeSync Premium Pro.",
    price: 549.99,
    category: "Electronics",
    stock: 12,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600"
  },
  {
    name: "Full HD Webcam with Dual Microphones",
    description: "1080p 60fps streaming camera with auto-focus and privacy shutter.",
    price: 39.99,
    category: "Electronics",
    stock: 45,
    ratings: 4.5,
    image: "https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=600"
  },
  {
    name: "Wireless Charging Pad Duo 15W",
    description: "Fast dual wireless charging pad for smartphone and earbuds simultaneously.",
    price: 29.99,
    category: "Electronics",
    stock: 60,
    ratings: 4.4,
    image: "https://images.unsplash.com/photo-1622445268465-8438165a2683?w=600"
  },
  {
    name: "4K Action Camera Waterproof 60fps",
    description: "Dual touchscreen displays, electronic image stabilization, and 131ft underwater rating.",
    price: 189.00,
    category: "Electronics",
    stock: 18,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600"
  },
  {
    name: "Hi-Fi Studio Reference Headphones",
    description: "Open-back audiophile headphones with acoustic resolution and detachable cable.",
    price: 329.00,
    category: "Electronics",
    stock: 8,
    ratings: 4.95,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"
  },

  // FASHION (10 products)
  {
    name: "Classic Vintage Leather Jacket",
    description: "100% genuine lambskin leather biker jacket with asymmetrical zipper and silk lining.",
    price: 289.00,
    category: "Fashion",
    stock: 15,
    ratings: 4.85,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"
  },
  {
    name: "Designer Denim Trucker Jacket",
    description: "Premium washed cotton denim jacket with durable copper hardware.",
    price: 79.99,
    category: "Fashion",
    stock: 25,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600"
  },
  {
    name: "Full-Grain Leather Executive Briefcase",
    description: "Handcrafted briefcase with padded laptop sleeve, organizer pockets, and shoulder strap.",
    price: 199.50,
    category: "Fashion",
    stock: 12,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
  },
  {
    name: "Urban Lightweight Running Sneakers",
    description: "Breathable mesh upper with high-rebound cushioning for maximum comfort.",
    price: 119.00,
    category: "Fashion",
    stock: 30,
    ratings: 4.75,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
  },
  {
    name: "Polarized Aviator Sunglasses",
    description: "UV400 protective polarized lenses with lightweight titanium metal frame.",
    price: 59.99,
    category: "Fashion",
    stock: 40,
    ratings: 4.65,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600"
  },
  {
    name: "Minimalist Slim Leather Wallet",
    description: "RFID-blocking genuine calfskin leather bi-fold wallet with quick card access.",
    price: 34.99,
    category: "Fashion",
    stock: 50,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600"
  },
  {
    name: "Heavyweight Organic Cotton Hoodie",
    description: "400 GSM plush fleece hoodie with reinforced seams and pre-shrunk fabric.",
    price: 64.50,
    category: "Fashion",
    stock: 35,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600"
  },
  {
    name: "Italian Wool Tailored Blazer",
    description: "Single-breasted slim fit blazer crafted from 100% fine Italian wool yarn.",
    price: 349.00,
    category: "Fashion",
    stock: 10,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"
  },
  {
    name: "Water-Resistant Canvas Travel Duffel Bag",
    description: "Spacious 45L travel bag with shoe compartment and reinforced leather handles.",
    price: 89.00,
    category: "Fashion",
    stock: 20,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
  },
  {
    name: "Chronograph Quartz Stainless Steel Watch",
    description: "Water resistant 100m chronograph watch with scratch-resistant sapphire crystal glass.",
    price: 179.99,
    category: "Fashion",
    stock: 18,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600"
  },

  // HOME & GARDEN (8 products)
  {
    name: "Smart Robot Vacuum & Mop Combo",
    description: "LiDAR navigation, 4000Pa strong suction, and automatic dirt disposal base station.",
    price: 499.00,
    category: "Home & Garden",
    stock: 14,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=600"
  },
  {
    name: "Stainless Steel Smart Thermal Flask (750ml)",
    description: "LED touch temperature lid, double-wall vacuum insulation keeps liquids hot/cold.",
    price: 24.99,
    category: "Home & Garden",
    stock: 60,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"
  },
  {
    name: "Barista Touch Espresso Coffee Machine",
    description: "15-bar Italian pump pressure, integrated conical grinder, and automatic microfoam milk wand.",
    price: 699.99,
    category: "Home & Garden",
    stock: 8,
    ratings: 4.95,
    image: "https://images.unsplash.com/photo-1517668808822-9ebe02afd2a4?w=600"
  },
  {
    name: "Modern Ergonomic Mesh Office Chair",
    description: "Adjustable lumbar support, 3D armrests, breathable mesh back, and synchro-tilt mechanism.",
    price: 229.00,
    category: "Home & Garden",
    stock: 22,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=600"
  },
  {
    name: "Smart Air Purifier HEPA H13",
    description: "Filters 99.97% of dust, pollen, and pet dander. Quiet night sleep mode.",
    price: 129.99,
    category: "Home & Garden",
    stock: 30,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600"
  },
  {
    name: "Cast Iron Dutch Oven Pot (5.5 Quart)",
    description: "Enameled heavy-duty cast iron pot for braising, baking sourdough, and slow cooking.",
    price: 79.50,
    category: "Home & Garden",
    stock: 25,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600"
  },
  {
    name: "Minimalist Ceramic Table Lamp",
    description: "Warm LED dimmable bedside lamp with textured ceramic base and linen shade.",
    price: 45.00,
    category: "Home & Garden",
    stock: 35,
    ratings: 4.65,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600"
  },
  {
    name: "Aromatherapy Essential Oil Diffuser",
    description: "Ultrasonic mist humidifier with 7 ambient color lights and timer settings.",
    price: 19.99,
    category: "Home & Garden",
    stock: 70,
    ratings: 4.55,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600"
  },

  // SPORTS & FITNESS (8 products)
  {
    name: "Adjustable SelectTech Dumbbell Pair (50 lbs)",
    description: "Replaces 15 sets of weights with selector dial from 5 to 52.5 lbs per dumbbell.",
    price: 349.00,
    category: "Sports",
    stock: 12,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600"
  },
  {
    name: "Non-Slip Eco-Friendly Yoga Mat (6mm)",
    description: "Natural rubber TPE yoga mat with alignment lines and carrying strap.",
    price: 38.50,
    category: "Sports",
    stock: 45,
    ratings: 4.75,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600"
  },
  {
    name: "Deep Tissue Percussion Massage Gun",
    description: "6 speed levels, 4 interchangeable massage heads, ultra-quiet brushless motor.",
    price: 89.99,
    category: "Sports",
    stock: 28,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"
  },
  {
    name: "Insulated Sports Water Bottle 32oz",
    description: "Leak-proof straw lid, stainless steel vacuum flask with durable powder coating.",
    price: 22.00,
    category: "Sports",
    stock: 65,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600"
  },
  {
    name: "Foldable Indoor Treadmill 2.5HP",
    description: "Compact running machine with shock absorption deck and LCD tracking screen.",
    price: 449.00,
    category: "Sports",
    stock: 10,
    ratings: 4.65,
    image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600"
  },
  {
    name: "Heavy-Duty Resistance Bands Set (5 Pack)",
    description: "100% natural latex exercise loop bands with handles, door anchor, and carry bag.",
    price: 18.99,
    category: "Sports",
    stock: 80,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600"
  },
  {
    name: "Hydration Backpack Pack (2L Bladder)",
    description: "Lightweight running and cycling backpack with BPA-free water reservoir.",
    price: 42.50,
    category: "Sports",
    stock: 30,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
  },
  {
    name: "Speed Jump Rope with Ball Bearings",
    description: "Tangle-free steel cable jump rope with non-slip memory foam handles.",
    price: 12.99,
    category: "Sports",
    stock: 90,
    ratings: 4.5,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"
  },

  // BEAUTY & PERSONAL CARE (7 products)
  {
    name: "Sonic Facial Cleansing Brush",
    description: "Medical-grade silicone ultrasonic face scrubber with 8 intensity modes.",
    price: 49.99,
    category: "Beauty",
    stock: 40,
    ratings: 4.7,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600"
  },
  {
    name: "Hydrating Hyaluronic Acid Serum (50ml)",
    description: "Pure hyaluronic acid formula plumps skin and locks in deep hydration.",
    price: 28.00,
    category: "Beauty",
    stock: 55,
    ratings: 4.85,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600"
  },
  {
    name: "Professional Ceramic Hair Straightener",
    description: "Tourmaline ceramic floating plates with instant 30-second heat-up to 450°F.",
    price: 69.50,
    category: "Beauty",
    stock: 25,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600"
  },
  {
    name: "Organic Vitamin C Brightening Face Cream",
    description: "Antioxidant-rich moisturizer restores radiance and improves skin texture.",
    price: 32.00,
    category: "Beauty",
    stock: 48,
    ratings: 4.75,
    image: "https://images.unsplash.com/photo-1608248597261-83325803d450?w=600"
  },
  {
    name: "Luxury Oud Wood Eau De Parfum (100ml)",
    description: "Exotic warm woody fragrance with notes of rare oud, rosewood, and amber.",
    price: 160.00,
    category: "Beauty",
    stock: 16,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600"
  },
  {
    name: "Electric Sonic Toothbrush with 4 Heads",
    description: "40,000 VPM sonic motor, 5 brushing modes, and 2-minute smart timer.",
    price: 39.99,
    category: "Beauty",
    stock: 60,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1559591937-e58af10079d3?w=600"
  },
  {
    name: "Rose Quartz Jade Roller & Gua Sha Set",
    description: "100% natural rose quartz facial roller for puffiness relief and skin firming.",
    price: 18.50,
    category: "Beauty",
    stock: 75,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=600"
  },

  // BOOKS & AUTOMOTIVE & KIDS (7 products)
  {
    name: "The Art of Clean Code & Architecture",
    description: "Hardcover guide on software engineering practices, refactoring, and clean code principles.",
    price: 34.99,
    category: "Books",
    stock: 50,
    ratings: 4.95,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600"
  },
  {
    name: "Portable Car Jump Starter 2000A",
    description: "Packs 2000 peak amps to jump start up to 8.0L gas engines. Built-in LED flashlight & power bank.",
    price: 79.99,
    category: "Automotive",
    stock: 22,
    ratings: 4.85,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"
  },
  {
    name: "Dual Dash Cam 4K Front + 1080P Rear",
    description: "Night vision, built-in GPS, G-sensor emergency recording, and Wi-Fi app connection.",
    price: 139.99,
    category: "Automotive",
    stock: 18,
    ratings: 4.75,
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600"
  },
  {
    name: "High-Pressure Car Power Washer Nozzle",
    description: "Heavy-duty brass nozzle with foam cannon attachment for vehicle detailing.",
    price: 29.50,
    category: "Automotive",
    stock: 40,
    ratings: 4.6,
    image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600"
  },
  {
    name: "Interactive STEM Wooden Building Block Set",
    description: "100-piece natural wood building blocks for creative child cognitive development.",
    price: 36.99,
    category: "Kids & Baby",
    stock: 35,
    ratings: 4.9,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600"
  },
  {
    name: "Soft Organic Cotton Baby Blanket",
    description: "Ultra-soft breathable double-layer knit blanket for infants and toddlers.",
    price: 24.00,
    category: "Kids & Baby",
    stock: 50,
    ratings: 4.8,
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600"
  },
  {
    name: "Plush Giant Teddy Bear (3 Feet)",
    description: "Super soft premium washable plush teddy bear toy.",
    price: 45.00,
    category: "Kids & Baby",
    stock: 25,
    ratings: 4.85,
    image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600"
  }
];

async function seed() {
  try {
    console.log("Connecting to database pool...");

    let userRes = await database.query("SELECT id FROM users LIMIT 1");
    let createdBy;

    if (userRes.rows.length === 0) {
      const newUser = await database.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('System Admin', 'admin@example.com', '$2b$10$dummyHashPassword1234567890', 'Admin')
        RETURNING id
      `);
      createdBy = newUser.rows[0].id;
    } else {
      createdBy = userRes.rows[0].id;
    }

    console.log(`Inserting ${productsData.length} new products into database...`);

    let insertedCount = 0;
    for (const prod of productsData) {
      const imagesArr = [{ url: prod.image, public_id: `seed_${insertedCount}` }];

      await database.query(
        `INSERT INTO products (name, description, price, category, stock, ratings, images, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW() - (INTERVAL '1 minute' * $9))`,
        [
          prod.name,
          prod.description,
          prod.price,
          prod.category,
          prod.stock,
          prod.ratings,
          JSON.stringify(imagesArr),
          createdBy,
          insertedCount // staggered created_at by minutes so order is maintained
        ]
      );
      insertedCount++;
    }

    console.log(`✅ Successfully seeded ${insertedCount} products into database!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding 50+ products:", error);
    process.exit(1);
  }
}

seed();
