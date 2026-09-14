import database from "./database/db.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const sampleProducts = [
  {
    name: "Ultra-Light Ergonomic Wireless Mouse",
    description: "High-precision optical gaming & productivity mouse with dynamic RGB lighting and 70-hour battery life.",
    price: 29.99,
    category: "Electronics",
    stock: 25,
    ratings: 4.8,
    images: [
      {
        url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600",
        public_id: "sample_mouse_1"
      }
    ]
  },
  {
    name: "Insulated Stainless Steel Smart Flask (750ml)",
    description: "Double-wall vacuum insulation keeps drinks ice-cold for 24 hours or hot for 12 hours. Features LED temperature display touch cap.",
    price: 19.50,
    category: "Home & Garden",
    stock: 40,
    ratings: 4.6,
    images: [
      {
        url: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
        public_id: "sample_flask_1"
      }
    ]
  },
  {
    name: "Active Noise Cancelling Wireless Headphones",
    description: "Immersive spatial audio with hybrid active noise cancellation and ultra-soft memory foam earcups.",
    price: 149.00,
    category: "Electronics",
    stock: 15,
    ratings: 4.9,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        public_id: "sample_headphones_1"
      }
    ]
  },
  {
    name: "Classic Vintage Denim Trucker Jacket",
    description: "100% premium cotton denim jacket with button closure and relaxed fit for year-round style.",
    price: 89.99,
    category: "Fashion",
    stock: 18,
    ratings: 4.7,
    images: [
      {
        url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600",
        public_id: "sample_jacket_1"
      }
    ]
  },
  {
    name: "Smart Fitness Watch with SpO2 & Heart Rate Monitor",
    description: "Sleek AMOLED smartwatch with GPS tracking, 30+ sports modes, and 10-day battery life.",
    price: 119.99,
    category: "Electronics",
    stock: 12,
    ratings: 4.8,
    images: [
      {
        url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        public_id: "sample_watch_1"
      }
    ]
  },
  {
    name: "Pro Mechanical RGB Gaming Keyboard",
    description: "Hot-swappable tactile mechanical switches, solid aluminum frame, and customizable macro keys.",
    price: 79.50,
    category: "Electronics",
    stock: 30,
    ratings: 4.9,
    images: [
      {
        url: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600",
        public_id: "sample_keyboard_1"
      }
    ]
  },
  {
    name: "Ultra-Wide Curved 4K HDR Monitor (34-inch)",
    description: "Stunning 144Hz IPS display with 1ms response time, dual HDMI 2.1, and Thunderbolt 4 support.",
    price: 599.00,
    category: "Electronics",
    stock: 8,
    ratings: 4.95,
    images: [
      {
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600",
        public_id: "sample_monitor_1"
      }
    ]
  },
  {
    name: "Genuine Leather Executive Briefcase & Laptop Bag",
    description: "Handcrafted full-grain leather bag with padded laptop compartment, detachable shoulder strap, and organizer pockets.",
    price: 249.00,
    category: "Fashion",
    stock: 10,
    ratings: 4.85,
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        public_id: "sample_bag_1"
      }
    ]
  }
];

async function seed() {
  try {
    console.log("Connecting to database...");

    // Find or create admin user ID for created_by constraint
    let userRes = await database.query("SELECT id FROM users LIMIT 1");
    let createdBy;

    if (userRes.rows.length === 0) {
      console.log("No existing user found. Creating a system admin user...");
      const newUser = await database.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('System Admin', 'admin@example.com', '$2b$10$dummyHashPassword1234567890', 'Admin')
        RETURNING id
      `);
      createdBy = newUser.rows[0].id;
    } else {
      createdBy = userRes.rows[0].id;
    }

    console.log(`Inserting ${sampleProducts.length} new arrival products across various price ranges ($19.50 - $599.00)...`);

    for (const prod of sampleProducts) {
      await database.query(
        `INSERT INTO products (name, description, price, category, stock, ratings, images, created_by, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [
          prod.name,
          prod.description,
          prod.price,
          prod.category,
          prod.stock,
          prod.ratings,
          JSON.stringify(prod.images),
          createdBy
        ]
      );
      console.log(` + Added: ${prod.name} ($${prod.price.toFixed(2)})`);
    }

    console.log("✅ All new arrival products added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding new arrival products:", error);
    process.exit(1);
  }
}

seed();
