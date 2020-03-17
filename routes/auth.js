const router = require("express").Router();
const { check } = require('express-validator');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Importing access token Authentication middleware
const authenticateToken = require('../middlewares/authenticateToken');
const blacklistToken = require('../middlewares/blacklistToken');

//Importing mongoose USER model
const User = require('../models/User');
const Blacklist = require('../models/BlacklistToken');

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register User
 *     description: Register Users into DB
 *     tags:
 *       - Authentication
  *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                  type: string
 *               password:
 *                  type: string
 *               name:
 *                  type: string
 *
 *     responses:
 *       200:
 *         description: User Registered
 *         schema:
 *           type: object
 *           properties:
 *             username:
 *                type: string
 *             password:
 *                type: string
 *             name:
 *                type: string
 */

//route to register a new user
router.post('/register', async (req, res) => {

  //check if the username already exists
  const userexists = await User.findOne({ username: req.body.username });
  if (userexists)
    return res.status(400).send('Username already exists');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user and save it in DB
  const newuser = new User({
    name:req.body.name,
    username: req.body.username,
    password: hashedPassword
  });

  //GENERATING ACCESS TOKEN CORRESPONDING TO UNIQUE username
  const user = { name: req.body.username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  //Save the user in DB and return the success or failure messages
  try {
    const saveduser = await newuser.save();
    return res.json({ accessToken: accessToken });
  } catch (err) {
    return res.status(400).send(err);
    console.log(err);
  }
});


/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login
 *     description: Login User
 *     tags:
 *       - Authentication
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                  type: string
 *               password:
 *                  type: string
 *
 *
 *     responses:
 *       200:
 *         description: User Registered
 *         schema:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *
 */


//LOGIN LOGIC
router.post('/login', async (req, res) => {
  //check if the username does not exist
  const userexists = await User.findOne({ username: req.body.username });
  if (!userexists)
    res.status(400).send('Username or password is wrong');

  //check password
  const validPass = await bcrypt.compare(req.body.password, userexists.password);
  if (!validPass)
    res.status(400).send('Password is incorrect');

  //Send the jwt accessToken on successful authorization of username and password
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  return res.json({ accessToken: accessToken });
});


/**
 * @swagger
 * /api/user/logout:
 *   delete:
 *     summary: Logout
 *     description: Logout User
 *     tags:
 *       - Authentication
 *     components:
 *      securitySchemes:
 *        bearerAuth:
 *          type: http
 *          scheme: bearer
 *          bearerFormat: JWT
 *     responses:
 *       UnauthorizedError:
 *          description: Access token is missing or invalid
 *
 */


//LOGOUT LOGIC
router.delete('/logout', blacklistToken, async (req, res) => {
  return res.json({message:"Token blacklisted. User logged out."});
});

//Password RESET
router.post('/recover', [
  check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
  check('password').not().isEmpty().isLength({ min: 6 }).withMessage('Must be at least 6 chars long'),
  check('confirmPassword', 'Passwords do not match').custom((value, { req }) => (value === req.body.password)),
], validate, Password.resetPassword);


module.exports = router;
