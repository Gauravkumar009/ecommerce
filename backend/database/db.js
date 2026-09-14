import pkg from "pg";

const { Pool } = pkg;

const database = new Pool({
    user: "postgres",
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: "Aman@#$1234",
    port: process.env.DB_PORT,
});

database.on("connect", () => {
    // Client connected to pool
});

database.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err);
});

console.log("Connected to the database pool successfully");

export default database;