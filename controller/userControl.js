const AppError = require('../utility/appError');
const User = require('../model/user.schema');
const bcrypt = require('bcrypt');

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

exports.home = (req, res) => {
  res.send('This is a Home Page');
};

exports.register = async (req, res, next) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !password || !email) {
    return next(new AppError('All Fields are required', 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('Email already exists', 400));
  }
  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'https://res.cloudinary.com',
    },
  });
  if (!user) {
    return next(
      new AppError('User registration failed,please try again later', 400)
    );
  }

  //Todo: File Upload
  await user.save();
  user.password = undefined;

  //generating token
  const token = await user.generateJWTToken();
  res.cookie('token', cookieOptions);
  res.status(201).json({
    success: true,
    message: 'user registerd Successfully',
    user,
  });
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('All fields are required', 400));
  }
  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.comparePassword(password)) {
      return next(new AppError('Email or password does not match !', 400));
    }
    const token = await user.generateJWTToken();
    user.password = undefined;
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      success: true,
      message: 'User logged in sucessfully',
      user,
    });
  } catch (err) {
    return next(new AppError(err.message, 500));
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.status(400).json({
      success: true,
      message: 'User Details',
      user,
    });
  } catch (err) {
    return next(new AppError(err, 400));
  }
};
exports.logout = (req, res) => {
  res.cookie('token', null, {
    secure: true,
    maxAge: 0,
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
};
