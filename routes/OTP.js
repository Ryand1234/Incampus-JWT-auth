const router = require("express").Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const request = require('request')

//Importing mongoose USER model
const User = require('../models/User');
const Blacklist = require('../models/BlacklistToken');

//Importing access token Authentication middleware
const authenticateToken = require('../middlewares/authenticateToken');

let api_key = process.env.TWO_FACTOR_API_KEY;

/**
 * @swagger
 * /otp/loginotp:
 *   post:
 *     summary: Generate OTP for Registration
 *     description: Otp generation
 *     tags:
 *       - OTP
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                  type: string
 *
 *     responses:
 *       200:
 *         description: OTP sent
 *         schema:
 *           type: object
 *           properties:
 *             Status:
 *                type: string
 *             Details:
 *                type: string
 *
 */

//SAVES THE PHONE NUMBER THROUGH THE req.body IN THE CORRESPONDING USER MODEL AND SENDS AN OTP TO THE PHONE NUMBER
 router.post('/otp', authenticateToken, async (req, res) => {
     let { phone_number } = req.body
     try {
       User.findOne({phone:phone_number}, (err, found) => {
         if(err)
            return res.send(err);
         if(found){
           return res.status(401).send('This phone number is already registered.');
         }else{
           User.findOneAndUpdate({username:req.user.name}, {phone:phone_number}, (err, found) =>{
             if(err){
               return res.status(400).send(err);
             }
             if(found){
               var url = `https://2factor.in/API/V1/${api_key}/SMS/${phone_number}/AUTOGEN`
                 request.get(url, function (err, response, body) {
                     body = JSON.parse(body)
                     if (err)
                         return res.json(err)
                     return res.json(body)
                 })
             }else{
               return res.status(404).send('No user with this token exists!');
             }
           });
         }
       })
     }
     catch (err) {
         return res.json(err.message)
     }
 })

// Verify Session Id and OTP
router.post('/verifyotp', authenticateToken, async (req, res) => {
    let { otp, session_id } = req.body;
    try {
        var url = `https://2factor.in/API/V1/${api_key}/SMS/VERIFY/${session_id}/${otp}`
        request.get(url, function (err, response, body) {
            body = JSON.parse(body)
            if (err)
                return res.json(err)

            //If the OTP entered by user matches correctly, then the flag variable otpverified in USER model is set to true.
            if(body.Details === "OTP Matched"){
              User.findOneAndUpdate({username:req.user.name}, {otpverified: true}, (err, found) => {
                if(err)
                  return res.status(400).send(err);
              });
            }

            //Returns "OTP Matched"  or "OTP Mismatch"
            return res.json(body.Details)
        })
    }
    catch (err) {
        return res.json(err.message)
    }
})

module.exports = router;
