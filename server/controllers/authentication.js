const User = require("../models/user");
const jwt = require("jwt-simple");
const config = require("../config");

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
  const user = req.user;
  res.send({ token: tokenForUser(user) });
      console.log(`signed in as: ${user}`);
};

exports.signup = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: "You must provide email and password" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(422).send({ error: "Email is already in use" });
    }

    const user = new User({ email, password });
    await user.save();

    res.json({ user_id: user._id, token: tokenForUser(user) });
    console.log(`user account created: ${user}`);
  } catch (err) {
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  const token = req.headers.authorization;
  const { email, password } = req.body;

  try {
    if (token) {
      const decoded = jwt.decode(token, config.secret);
      const user = await User.findById(decoded.sub);

      if (!user) {
        return res.status(401).send({ error: "Invalid token" });
      }

      return res.send(user);
    } else if (email && password) {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).send({ error: "Invalid email or password" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).send({ error: "Invalid email or password" });
      }

      return res.send(user);
    } else {
      return res
        .status(400)
        .send({ error: "No authentication method provided" });
    }
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { email, newEmail, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    if (newEmail) {
      user.email = newEmail;
    }

    if (newPassword) {
      user.password = newPassword;
    }

    await user.save();

    res.send({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};