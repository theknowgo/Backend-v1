import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get(
  "/google", // /auth/google
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    // Create JWT token after successful login
    const token = jwt.sign(
      {
        userId: req.user._id,
        email: req.user.email,
        userType: req.user.userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Redirect the user to the frontend with the JWT token as query param
    res.redirect(`${process.env.FRONTEND_MAIN_PAGE_URL}?token=${token}`);
  }
);

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully" });
  });
});

export default router;
