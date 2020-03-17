var express = require('express');
const { check, validationResult } = require('express-validator');
const User = require('../models/User')
const fs = require('fs')
var router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken')

// To store user info.

router.post('/userinfo',
	[
		check('name').isAlpha().isLength({min: 1}),
		check('education').isLength({ min: 1 }),
		check('gender').isLength({ min: 1 }).isAlpha(),
		check('profession').isLength({ min: 1 }).isAlpha(),
		check('course').isLength({ min: 1 }),
		check('university').isLength({ min: 1 }),
		check('dob').isISO8601(),

	], authenticateToken,
	async (req, res, next) => {

		const error = validationResult(req);
		if (!error.isEmpty()) {
			console.log("Error: ", error.array());
			//res.render('form', {errors: error.array()})
		}
		else {			

						User.findOne({username: req.user.name}, function(err,existingUser){
 						if (err) console.log(err)
 						else
						{	
						existingUser.name = req.body.name;
						existingUser.gender = req.body.gender;
						existingUser.university = req.body.university;
						existingUser.dob = req.body.dob;
						existingUser.profession = req.body.profession;
						existingUser.education = req.body.education;
						existingUser.course = req.body.course;
						existingUser.save();

					}
				});

				res.send('User info saved');
						
		
		}
		

	});

// To save profile picture 

router.post('/image', authenticateToken, async (req, res, next) => {

			User.findOne({username: req.user.name}, function(err,existingUser){
 			if (err) console.log(err)
 			else
				{	
					existingUser.image.data = fs.readFileSync(req.body.image.path);
					existingUser.image.contentType = 'image/png';
					existingUser.save();
					res.send('Image Saved');
				}
 			});
	

			

});



module.exports = router;
