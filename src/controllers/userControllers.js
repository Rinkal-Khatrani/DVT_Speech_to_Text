const User = require("../models/user");

const login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email, password: password });
    console.log("existingUser>>>", existingUser);
  } catch (err) {
    res.render("index", {
      error: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!existingUser) {
    res.render("index", {
      error: "Logging in failed, please try again later.",
    });
    return;
  }

  res.redirect("/main");
};

exports.login = login;
