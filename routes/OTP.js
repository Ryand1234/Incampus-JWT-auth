const router = require("express").Router();
require('dotenv').config();
const User = require('../models/User');
require('dotenv').config();
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


router.post('/loginotp', async (req, res) => {
  let { phone_number, sms } = req.body
  try {
      var url = `http://2factor.in/API/V1/15755230-3545-11ea-9fa5-0200cd936042/ADDON_SERVICES/SEND/PSMS`
      //console.log(url)
      var form = {
          From: "InCampus",
          To: phone_number,
          Msg: sms
      }
      request.post({ url, form: form }, function (err, res, body) {
          body = JSON.parse(body)
          if (err)
              return res.json(err)
          res.json(body)
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
