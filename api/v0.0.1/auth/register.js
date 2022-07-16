const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const router = express.Router();
const User = require("../../../models/User");

router.use(
  "/",
  [
    check("username", "username is required")
      .trim()
      .not()
      .isEmpty()
      .custom((value) => !/\s/.test(value))
      .withMessage("Invalid username"),
    check("password", "password is required")
      .trim()
      .not()
      .isEmpty()
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        minUppercase: 1,
      })
      .withMessage(
        "password length must be 8 characters with atleast an uppercase, a lowercase, a number from 0 to 9, and a special character"
      ),
    check("repassword")
      .trim()
      .custom(async (repassword, { req }) => {
        const password = req.body.password.trim();
        if (!repassword) {
          throw new Error("please confirm password");
        } else if (!password) {
          throw new Error("password is required");
        } else if (repassword !== password) {
          throw new Error("passwords doesn't match");
        }
      }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req).errors;
    if (errors.length >= 1) {
      return res.status(400).json({ errors });
    } else {
      try {
        const { username, password, role } = req.body;
        let user = await User.findOne({ username });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: "user already exists" }] });
        }

        user = new User({
          username,
          password,
          role,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        return res.status(200).json({
          username,
          role,
        });
      } catch (e) {
        console.log("/api/v0.0.1/user/register.js (xinj-25)", e.message); //xinj-25
        return res.status(500).json({
          errors: [{ msg: "Internal Server Error (xinj-26)" }], //xinj-26
        });
      }
    }
  }
);

module.exports = router;
