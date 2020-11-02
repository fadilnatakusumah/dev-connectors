const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
  // get token from header
  const token = req.header('x-auth-token');

  // check if token doesn't exist
  if (!token) {
    return res.status(401).json({
      success: false,
      errors: [{ msg: "No token, authorization denied." }]
    })
  }


  // verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("error", error)
    res.status(401).json({
      msg: 'Token is not valid'
    })
  }
}