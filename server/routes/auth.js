const express = require("express");
const passport = require("passport");
const authenticationController = require("../controllers/authentication");

const router = express.Router();

router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  authenticationController.signin
);
router.post("/signup", authenticationController.signup);
router.put('/profile', authenticationController.updateProfile);

module.exports = router;
