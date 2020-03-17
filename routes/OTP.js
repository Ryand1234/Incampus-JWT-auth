const router = require("express").Router();
require('dotenv').config();
const User = require('../models/User');
require('dotenv').config();

const request = require('request')
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

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
router.post('/loginotp', async (req, res) => {
    let { phone_number } = req.body
    try {
        var url = `https://2factor.in/API/V1/${api_key}/SMS/${phone_number}/AUTOGEN`
        request.get(url, function (err, response, body) {
            body = JSON.parse(body)
            if (err)
                return res.json(err)
            return res.json(body.Details)
        })
    }
    catch (err) {
        return res.json(err.message)
    }
})

// Verify Session Id and OTP 
router.post('/verifyotp', async (req, res) => {
    let { otp, session_id } = req.body;
    try {
        var url = `https://2factor.in/API/V1/${api_key}/SMS/VERIFY/${session_id}/${otp}`
        request.get(url, function (err, response, body) {
            body = JSON.parse(body)
            if (err)
                return res.json(err)
            return res.json(body.Details)
        })
    }
    catch (err) {
        return res.json(err.message)
    }
})

module.exports = router;
