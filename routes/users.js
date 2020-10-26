var express = require('express');
var router = express.Router();
var usersService = require('../services/usersService');
var VerifyToken = require('../auth/VerifyToken');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('API running!');
});

module.exports = router;

// register a new user
router.post('/register', usersService.register);

// login existing user
router.post('/login', usersService.login);

// search an user using the specific fields
router.get('/search', VerifyToken, usersService.search);

// get the sorted data of an user. Sorting on specific fields
router.get('/sort', VerifyToken, usersService.sort);

// get the user data in paginated form
router.get('/paginatedusers', VerifyToken, usersService.paginationList);

// One API to search, sort and get paginated user data
router.get('/userlist', VerifyToken, usersService.userList);
