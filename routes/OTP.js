const router = require("express").Router();
require('dotenv').config();
const User = require('../models/User');
require('dotenv').config();

const request = require('request')
const FormData = require('form-data');
// Download the helper library from https://www.twilio.com/docs/node/install
// Your Account Sid and Auth Token from twilio.com/console
// DANGER! This is insecure. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



// router.post('/', function(req, res){
//   const {email,phone} = req.body;
//   const randomotp = Math.floor((Math.random() * 899999) + 100000);
//   User.updateOne({email:email},{phone:phone,otp:randomotp}, function(err,found){
//     if(!found){
//       console.log('Number in DB not updated');
//     }else{
//       console.log('Number Updated Successfully');
//     }
//   });
//   const msgbody = 'Your OTP for incampus is ' + randomotp;
//   console.log('sending msg with twilio');
//   client.messages
//     .create({
//        body: msgbody,
//        from: '+14079016056',
//        to: '+919560257177'
//      })
//     .then(message => console.log(message.sid));
//
//   console.log('Sent message with twilio');
//   res.send('otp message sent');
// });

// Sends Back Session ID And sends the otp to the phone number
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

// router.post('/verify', function (req, res) {
//   const phone = req.body.phone;
//   const otp = req.body.otp;
//   User.findOne({ phone: phone }, function (err, found) {
//     if (!found) {
//       console.log('No account with this number exists.');
//       res.status(404).send('No account with this number exists.');
//     } else {
//       if (otp === found.otp) {
//         res.status(200).send('Successfully verified');
//       } else {
//         res.status(401).send('Wrong OTP entered');
//       }
//     }
//   });
// });

module.exports = router;
