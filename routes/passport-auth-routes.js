const router = require('express').Router();
const passport = require('passport');
// // auth login
// router.get('/login', (req, res) => {
//     res.render('login', { user: req.user });
// });

// // auth logout
// router.get('/logout', (req, res) => {
//     // handle with passport
//     req.logout();
//     res.redirect('/');
// });


/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Google Signin
 *     description: Google Auth
 *     tags:
 *       - Social Authentication
  *     requestBody:
 *       content:
 *         application/json:
 *                 
 *     responses:
 *       200:
 *         description: Successful
 *         
 *               
 */
// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

// hand control to passport to use code to grab profile info
router.get('/google/callback', passport.authenticate("google", { failureRedirect: "/", session: false }), (req, res) => {
    var token = req.user.token;
    console.log(token)
    res.redirect("http://localhost:3000?token=" + token);

});



/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Facebook Signin
 *     description: Facebook Auth
 *     tags:
 *       - Social Authentication
  *     requestBody:
 *       content:
 *         application/json:
 *                 
 *     responses:
 *       200:
 *         description: Successful
 *         
 *               
 */
//Auth with Facebook

router.get('/facebook', passport.authenticate('facebook', {
    scope: ["email",  "user_location", "user_hometown", "user_birthday"]
}));


router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' , session: false}),(req, res) => {
    var token = req.user.token;
    console.log(token)
    res.redirect("http://localhost:3000?token=" + token);

});

module.exports = router;