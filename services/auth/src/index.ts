import app from "./app.js";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";

dotenv.config();

async function initialize() {
  try {
    // 1️⃣ Create enum safely
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_role'
        ) THEN
          CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
        END IF;
      END $$;
    `;

    // 2️⃣ Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20) NOT NULL,
        role user_role NOT NULL,
        bio TEXT,
        resume VARCHAR(255),
        resume_public_id VARCHAR(255),
        profile_picture VARCHAR(255),
        profile_picture_public_id VARCHAR(255),
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        subscription TIMESTAMPTZ
      );
    `;

    // 3️⃣ Create skills table
    await sql`
      CREATE TABLE IF NOT EXISTS skills (
        skill_id SERIAL PRIMARY KEY,
        skill_name VARCHAR(100) UNIQUE NOT NULL
      );
    `;

    // 4️⃣ Create user_skills mapping table
    await sql`
      CREATE TABLE IF NOT EXISTS user_skills (
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        skill_id INT REFERENCES skills(skill_id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, skill_id)
      );
    `;

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

// VERY IMPORTANT — you forgot this
initialize().then(() => {
  console.log("Database setup complete.");
  app.listen(process.env.PORT || 3000, () => {
  console.log(`Auth service running at http://localhost:${process.env.PORT || 3000}`);
});
});


