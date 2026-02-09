import { tryCatch } from "../utils/TryCatch.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import getBuffer from "../utils/buffer.js";
import upload from "../middleware/multer.js";
import axios from "axios";

export const myProfile = tryCatch(
  async (req: AuthenticatedRequest, res, next) => {
    const user = req.user;

    res.json(user);
  },
);
// get user profile by is
export const getUserProfile = tryCatch(async (req, res) => {
  const { userId } = req.params;

  const users = await sql`
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.phone_number,
      u.role,
      u.bio,
      u.resume,
      u.resume_public_id,
      u.profile_picture,
      u.profile_picture_public_id,
      u.subscription,
      COALESCE(
        ARRAY_AGG(s.skill_name) FILTER (WHERE s.skill_name IS NOT NULL),
        '{}'
      ) AS skills
    FROM users u
    LEFT JOIN user_skills us ON u.user_id = us.user_id
    LEFT JOIN skills s ON us.skill_id = s.skill_id
    WHERE u.user_id = ${userId}
    GROUP BY u.user_id;
  `;

  if (users.length === 0) {
    throw new ErrorHandler("User is not Found", 404);
  }

  res.json(users[0]);
});


// update user profile
export const updateUserProfile = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    if (!user) {
      throw new ErrorHandler("Authentication required", 404);
    }

    const { name, phoneNumber, bio } = req.body;
    const newName = name || user.name;
    const newPhoneNumber = phoneNumber || user.phone_number;
    const newbio = bio || user.bio;
    const [updatedUser] = await sql`
  UPDATE users SET name= ${newName}, phone_number = ${newPhoneNumber}, bio= ${newbio}
  WHERE user_id= ${user.user_id}
  RETURNING user_id, name, email, phone_number, bio

  
  `;
    res.json({
      message: "Profile updated successfully ",
      updatedUser,
    });
  },
);

export const updateProfilePic = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Authentication required", 401);
    }

    const file = req.file;
    if (!file) {
      throw new ErrorHandler("Profile picture is required", 400);
    }

    // same helper you already use
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ErrorHandler("Failed to generate buffer", 500);
    }

    // SAME upload service call as registerUser
    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      {
        buffet: fileBuffer,
        public_id: user.profile_picture_public_id, // optional overwrite
      },
    );

    const [updatedUser] = await sql`
    UPDATE users
    SET
      profile_picture = ${data.url},
      profile_picture_public_id = ${data.public_id}
    WHERE user_id = ${user.user_id}
    RETURNING
      user_id,
      name,
      email,
      profile_picture;
  `;

    res.json({
      message: "Profile picture updated successfully",
      user: updatedUser,
    });
  },
);

export const updateProfileResume = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Authentication required", 401);
    }

    const file = req.file;
    if (!file) {
      throw new ErrorHandler("Resume is required", 400);
    }

    // same helper you already use
    const fileBuffer = getBuffer(file);

    if (!fileBuffer || fileBuffer.length === 0) {
      throw new ErrorHandler("Failed to generate buffer", 500);
    }

    // SAME upload service call as registerUser
    const { data } = await axios.post(
      `${process.env.UPLOAD_SERVICE}/api/utils/upload`,
      {
        buffet: fileBuffer,
        public_id: user.resume_public_id, // overwrite old resume
      },
    );

    const [updatedUser] = await sql`
      UPDATE users
      SET
        resume = ${data.url},
        resume_public_id = ${data.public_id}
      WHERE user_id = ${user.user_id}
      RETURNING
        user_id,
        name,
        email,
        resume,
        resume_public_id;
    `;

    res.json({
      message: "Resume updated successfully",
      user: updatedUser,
    });
  },
);

export const addSkillToUser = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?.user_id;
    const { skillName } = req.body;

    if (!userId) {
      throw new ErrorHandler("Authentication required", 401);
    }

    if (!skillName || skillName.trim() === "") {
      throw new ErrorHandler("Please provide a skill name", 400);
    }

    // 🔹 split + normalize
    const skills = skillName
      .split(",")
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);

    if (skills.length === 0) {
      throw new ErrorHandler("No valid skills provided", 400);
    }

    try {
      await sql`BEGIN`;

      const addedSkills: string[] = [];

      for (const skill of skills) {
        // 1️⃣ insert skill if not exists
        const [dbSkill] = await sql`
          INSERT INTO skills (skill_name)
          VALUES (${skill})
          ON CONFLICT (skill_name)
          DO UPDATE SET skill_name = EXCLUDED.skill_name
          RETURNING skill_id, skill_name;
        `;

        // 2️⃣ link skill to user
        const result = await sql`
          INSERT INTO user_skills (user_id, skill_id)
          VALUES (${userId}, ${dbSkill?.skill_id})
          ON CONFLICT (user_id, skill_id)
          DO NOTHING
          RETURNING skill_id;
        `;

        if (result.length > 0) {
          addedSkills.push(dbSkill?.skill_name);
        }
      }

      await sql`COMMIT`;

      if (addedSkills.length === 0) {
        return res.status(200).json({
          message: "User already has all provided skills",
        });
      }

      res.status(201).json({
        message: "Skills added successfully",
        addedSkills,
      });
    } catch (error) {
      await sql`ROLLBACK`;
      throw error;
    }
  },
);



export const deleteSkillFromUser = tryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      throw new ErrorHandler("Authentication is required", 401);
    }

    const { skillName } = req.body;

    if (!skillName || skillName.trim() === "") {
      throw new ErrorHandler("Please provide a skill name", 400);
    }

    // 🔹 split + normalize
    const skills = skillName
      .split(",")
      .map((s: string) => s.trim().toLowerCase())
      .filter(Boolean);

    if (skills.length === 0) {
      throw new ErrorHandler("No valid skills provided", 400);
    }

    const result = await sql`
      DELETE FROM user_skills
      WHERE user_id = ${user.user_id}
        AND skill_id IN (
          SELECT skill_id
          FROM skills
          WHERE skill_name = ANY(${skills})
        )
      RETURNING skill_id;
    `;

    if (result.length === 0) {
      throw new ErrorHandler(
        `None of the skills (${skills.join(", ")}) were found`,
        404,
      );
    }

    res.json({
      message: "Skills deleted successfully",
      deletedSkills: skills,
    });
  },
);
