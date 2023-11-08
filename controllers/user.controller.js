const jsonwebtoken = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }
  jsonwebtoken.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userData = decoded;
    next();
  });
};
function getUserData(req, res) {
  const userData = req.userData;
  res.status(200).json(userData);
}
module.exports = {
  verifyToken,
  getUserData,
};
