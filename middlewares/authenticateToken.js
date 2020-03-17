const Blacklist = require('../models/BlacklistToken');
const jwt = require('jsonwebtoken');

//MIDDLEWARE TO AUTHENTICTAE TOKEN BEFORE ACCESSING PROTECTED ROUTES
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null)
    return res.sendStatus(401);

  Blacklist.findOne({ token: token }, function (err, found) {
    if (found)
      return res.json('Token blacklisted. Cannot use this token.');
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.sendStatus(403);
        req.user = user;
        next();
      });
    }
  });
}

module.exports = authenticateToken
