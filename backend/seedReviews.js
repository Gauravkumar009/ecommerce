import database from "./database/db.js";
import { config } from "dotenv";

config({ path: "./config/config.env" });

const sampleComments = [
  "Absolutely love this product! Exceeded my expectations.",
  "Great build quality and very fast shipping.",
  "Works perfectly as described. Highly recommended!",
  "Decent quality for the price point. Happy with the purchase.",
  "Top-notch performance and sleek design.",
  "Awesome customer experience and fantastic product.",
  "Solid build, easy to set up and use every day.",
  "Five stars! Will definitely buy again."
];

async function seedReviews() {
  try {
    console.log("Connecting to database to seed sample reviews...");

    // Get or create reviewer user
    let userRes = await database.query("SELECT id FROM users LIMIT 1");
    let userId;
    if (userRes.rows.length === 0) {
      const newUser = await database.query(`
        INSERT INTO users (name, email, password, role)
        VALUES ('Verified Buyer', 'buyer@example.com', '$2b$10$dummyHashPassword1234567890', 'User')
        RETURNING id
      `);
      userId = newUser.rows[0].id;
    } else {
      userId = userRes.rows[0].id;
    }

    // Get all products
    const productsRes = await database.query("SELECT id, name, ratings FROM products");
    const products = productsRes.rows;

    console.log(`Seeding reviews for ${products.length} products...`);
    let totalReviewsInserted = 0;

    for (const prod of products) {
      // Check existing reviews count
      const existingReviews = await database.query(
        "SELECT COUNT(*) FROM reviews WHERE product_id = $1",
        [prod.id]
      );
      const count = parseInt(existingReviews.rows[0].count);

      if (count === 0) {
        const baseRating = Number(prod.ratings) || 4.5;
        // Determine number of reviews based on product ID
        const numReviews = (Math.abs(String(prod.id).split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)) % 12) + 5;

        for (let i = 0; i < numReviews; i++) {
          const ratingVariation = Math.min(5, Math.max(3.5, baseRating + (Math.random() * 0.6 - 0.3)));
          const comment = sampleComments[i % sampleComments.length];

          await database.query(
            `INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
             VALUES ($1, $2, $3, $4, NOW() - (INTERVAL '1 hour' * $5))`,
            [prod.id, userId, ratingVariation.toFixed(1), comment, i * 3]
          );
          totalReviewsInserted++;
        }

        // Recalculate average rating for product
        const avgRes = await database.query(
          "SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = $1",
          [prod.id]
        );
        const newAvg = Number(avgRes.rows[0].avg_rating).toFixed(1);
        await database.query("UPDATE products SET ratings = $1 WHERE id = $2", [newAvg, prod.id]);
      }
    }

    console.log(`✅ Successfully inserted ${totalReviewsInserted} reviews across products!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    process.exit(1);
  }
}

seedReviews();
