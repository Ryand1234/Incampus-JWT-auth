var express = require('express');
const { check,validationResult } = require('express-validator');
const User = require('../config/schema')
const fs = require('fs')
var router = express.Router();
const Blacklist = require('../models/BlacklistToken');

// To store user info.

router.post('/userinfo',
[
  check('lname').isLength({min: 3}).isAlpha(),
  check('fname').isLength({min: 3}).isAlpha(),
  check('education').isLength({min: 1}),
  check('gender').isLength({min: 1}).isAlpha(),
  check('profession').isLength({min: 1}).isAlpha(),
  check('course').isLength({min: 1}),
  check('university').isLength({min:1}),
  check('dob').isISO8601(),
  
],
 async (req, res, next) => {
	
	const error = validationResult(req);
	if(!error.isEmpty())
	{
		console.log("Error: ",error.array());
		//res.render('form', {errors: error.array()})
	}
	else
	{
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if(token==null)
   			return res.sendStatus(401);

	Blacklist.findOne({token:token}, function(err, found){
		if(found)
  		   return res.json('Token blacklisted. Cannot use this token.');
		else{
   			    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         		if(err)
         			return res.sendStatus(403);
				var existingUser = user;
				existingUser.name.lname = req.body.lname;
				existingUser.name.fname = req.body.fname;
				existingUser.gender = req.body.gender;
				existingUser.university = req.body.university;
				existingUser.dob = req.body.dob;
				existingUser.profession = req.body.profession;
				existingUser.education = req.body.education;
				existingUser.course = req.body.course;
				existingUser.save();
				next();
       						});
 			}
 														});
 
	}
	res.send('User info saved');
	
 });

// To save profile picture 

router.post('/image', async (req, res, next) => {
	
	const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if(token==null)
   			return res.sendStatus(401);

	Blacklist.findOne({token:token}, function(err, found){
		if(found)
  		   return res.json('Token blacklisted. Cannot use this token.');
		else{
   			    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
         		if(err)
         			return res.sendStatus(403);
				var existingUser = user;
				existingUser.image.data = fs.readFileSync(req.body.image.path);
				existingUser.image.contentType = 'image/png';
				existingUser.save();
				next();
       						});
 			}
 														});
		
	res.send('Image Saved');
	
 });



module.exports = router;
