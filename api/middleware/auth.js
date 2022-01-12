const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const verifyToken = (req, res, next) => {
  var token = req.headers["x-access-token"];

  if (!token)
    return res.status(403).json({'msg': "Please Login" });

  jwt.verify(token, process.env.SecretToken, async function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, 'msg': "Not authorized", err: err });

    // if everything good, save to request for use in other routes
    let id = decoded.ID;
    try {
      const existingUser = await User.findById(id);
      if (existingUser) {
        req.USER = existingUser;
      } else {
        res.status(404).json(err);
      }
      // console.log(existingUser);
    } catch (err) {
      res.status(500).json(err);
    }
    next();
  });
};

module.exports = verifyToken;
