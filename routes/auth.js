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
const Blacklist = require('../models/BlacklistToken');

//Initializing twilio library and API keys
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

let blacklisted = [];

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
router.post('/register', async(req, res) =>{

  //check if the username already exists
  const userexists = await User.findOne({username:req.body.username});
  if(userexists)
    return res.status(400).send('Username already exists');

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);


  //Generating a 6 digit random OTP
  const randomotp = Math.floor((Math.random() * 899999) + 100000);

  //Create a new user and save it in DB
  const newuser = new User({
    username: req.body.username,
    password:hashedPassword,
    email:req.body.email,
    name:req.body.name,
    phone:req.body.phone,
    otp:randomotp
  });

  //Sending OTP mobile verification message with twilio
  const msgbody = 'Your OTP for incampus is ' + randomotp;
  client.messages
    .create({
       body: msgbody,
       from: '+14079016056',
       to: '+919560257177'
     })
    .then(message => console.log(message.sid));


  try{
    const saveduser = await newuser.save();
    return res.status(200).send(saveduser);
  }catch(err){

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
router.delete('/logout', blacklistToken ,function(req, res){
  console.log('blacklisted');
  res.send("Token blacklisted");
});


//Displaying the protected posts. User can only see their own post. The posts array is defined above.
router.get('/posts', authenticateToken, function(req, res){
  res.json(posts.filter(post => post.username === req.user.name));
});




//MIDDLEWARE TO AUTHENTICTAE TOKEN BEFORE ACCESSING PROTECTED ROUTES
function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token==null)
   return res.sendStatus(401);

   // blacklisted.forEach(function(expiredToken){
   //   if(token===expiredToken)
   //    res.status(400).send("This token has expired because the user of this token logged out. Login again to create a new token.");
   // });

   Blacklist.findOne({token:token}, function(err, found){
      if(found)
     return res.json('Token blacklisted. Cannot use this token.');
     else{
       jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         if(err)
         return res.sendStatus(403);
         req.user = user;
         next();
       });
     }
   });


}

//MIDDLEWARE TO BLACKLIST TOKEN ON LOGOUT.
function blacklistToken(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token==null)
   return res.sendStatus(401);
   console.log(token);
   blacklisted.push(token);

   const newtoken = new Blacklist({
     token:token
   });
   newtoken.save();

   next();
}


module.exports = router;



//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW5nZWxhIiwiaWF0IjoxNTgzOTE4NzAyfQ.PvEMICT_v33INbUapy8jUmi40RkvllGj2NrGHe8JWco
