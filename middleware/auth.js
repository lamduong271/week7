var jsonWebToken = require("jsonwebtoken");

const JSON_SECRET_CODE = "thiIsADog";

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (token == null) return res.sendStatus(401);
  jsonWebToken.verify(token, JSON_SECRET_CODE, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = { JSON_SECRET_CODE, verifyToken };
