const express = require('express');
const { isLoggedIn } = require('../middleware/jwtAuth');
const router = express.Router();
const {
  home,
  register,
  login,
  getProfile,
  logout,
} = require('../controller/userControl');

router.get('/home', home);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isLoggedIn, getProfile);

module.exports = router;
