const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
require('dotenv').config();
//==================================================================================================
//to validate the data sent through frontend through post request
// Example:
// username:Joi.string().min(6).required(),
// passowrd:Joi.string().min(6).required(),
// email:Joi.string().min(6).required().email()
const Joi = require('@hapi/joi');
//==================================================================================================

//Importing mongoose USER model
const User = require('../models/User');


//example database which is protected using jwtauth.
//only a user's particular post will appear when we login.
const posts = [
  {
    username: "Dwight",
    content:"Assistant to the Regional Manager"
  },
  {
    username: "Jim",
    content:"J Crew model salesman"
  },
  {
    username:"Angela",
    content:"I am all about cats"
  }
];




router.post('/register', async(req, res) =>{

  //check if the username already exists
  const userexists = await User.findOne({username:req.body.username});
  if(userexists)
    res.status(400).send('Username already exists');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  //Create a new user and save it in DB
  const newuser = new User({
    username: req.body.username,
    password:hashedPassword
  });
  try{
    const saveduser = await newuser.save();
    res.status(200).send(saveduser);
  }catch(err){
    res.status(400).send(err);
    console.log(err);
  }
});


//LOGIN LOGIC
router.post('/login', async(req, res) => {
  //check if the username does not exist
  const userexists = await User.findOne({username:req.body.username});
  if(!userexists)
    res.status(400).send('Username or password is wrong');

  //check password
  const validPass = await bcrypt.compare(req.body.password, userexists.password);
  if(!validPass)
    res.status(400).send('Password is incorrect');

  const username = req.body.username;
  // console.log(req.body.username);
  const user = {name : username};
  // console.log(user);
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

  res.json({accessToken :  accessToken});
// res.send('Logged In');
});


router.get('/posts', authenticateToken, function(req, res){
  res.json(posts.filter(post => post.username === req.user.name));
  // res.json(req.user.name)
});


//MIDDLEWARE TO AUTHENTICTAE TOKEN BEFORE ACCESSING PROTECTED ROUTES
function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token==null)
   return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if(err)
    return res.sendStatus(403);
    req.user = user;
    next();
  });
}


module.exports = router;
