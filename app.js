require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Getting data in json format
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Mongoose connection to the cluster
//mongoose.connect('mongodb://localhost:27017/jwt_auth', { useUnifiedTopology: true,useNewUrlParser: true  }, () => {
//  console.log('mongodb connected');
//});

mongoose.connect("mongodb+srv://admin:admin@cluster0-nbxxl.mongodb.net/jwtauth", { useUnifiedTopology: true,useNewUrlParser: true  }, () => {
 console.log('mongodb connected');

//Importing Routes
const authRoute = require('./routes/auth.js');

//Using imported Routes
app.use('/api/user', authRoute);


app.get('/',function(req, res){
res.send('Hi');
});

app.listen(3000 || process.env.PORT, function(){
  console.log('Server is running on port 3000');
});




//
// const posts = [
//   {
//     username: "Dwight",
//     content:"Assistant to the Regional Manager"
//   },
//   {
//     username: "Jim",
//     content:"J Crew model salesman"
//   }
// ];
//
// app.get('/posts', authenticateToken, function(req, res){
//   res.json(posts.filter(post => post.username === req.user.name));
//   // res.json(req.user.name)
// });
//
// app.post('/login', function(req, res){
//   const username = req.body.username;
//   // console.log(req.body.username);
//   const user = {name : username};
//   // console.log(user);
//   const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
//
//   res.json({accessToken :  accessToken});
//
// });

// app.post('/localStorage', function(req,res){
//   res.send(req.body);
// });

//
// function authenticateToken(req, res, next){
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//
//   if(token==null)
//    return res.sendStatus(401);
//
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if(err)
//     return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// }
