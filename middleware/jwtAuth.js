const AppError = require('../utility/appError');
const jwt = require('jsonwebtoken');

exports.isLoggedIn = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new AppError('Unauthenticated, please login again', 401));
  }

  const userDetails = await jwt.verify(token, process.env.SECRET);

  req.user = userDetails;
  next();
};
