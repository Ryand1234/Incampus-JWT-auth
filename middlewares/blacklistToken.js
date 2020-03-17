const Blacklist = require('../models/BlacklistToken');

//MIDDLEWARE TO BLACKLIST TOKEN ON LOGOUT.
function blacklistToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null)
    return res.sendStatus(401);

  const newtoken = new Blacklist({
    token: token
  });
  newtoken.save();
  next();
}

module.exports = blacklistToken
