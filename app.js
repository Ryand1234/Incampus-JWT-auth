require('dotenv').config();
const express = require('express');
const passport = require('passport');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
var path = require('path');
// Getting data in json format
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Documentation
// const swaggerRoute = require('./routes/swagger-routes')
// app.use('/api',swaggerRoute);

// const swaggerUi = require('swagger-ui-express'),
// swaggerDocument = require('./swagger.json');
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerDefinition = {
  info: {
    title: 'Incampus API',
    version: '1.0.0',
    description: 'Documentation for Incampus Backend API',
  },
  host: 'localhost:4500',
  basePath: '/',
};
const options = {
  swaggerDefinition,
  // apis: [path.resolve(__dirname, 'app.js')],
  apis: ['./routes/auth.js', './routes/passport-auth-routes.js','./routes/OTP.js', './routes/fileupload.js']
};
const swaggerSpec = swaggerJSDoc(options);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

app.use(passport.initialize());
app.use(passport.session());

//==================================================================================================================================

//Mongoose connection to the cluster
// mongoose.connect('mongodb://localhost:27017/jwt_auth', { useUnifiedTopology: true, useNewUrlParser: true }, () => {
//   console.log('mongodb connected');
// });

//  mongoose.connect(keys.mongodb.dbURI, () => {
//    console.log('connected to mongodb');
// });

mongoose.connect("mongodb+srv://admin:admin@cluster0-nbxxl.mongodb.net/jwtauth?retryWrites=true&w=majority",{useNewUrlParser: true});

//==================================================================================================================================

//Importing Routes
const authRoute = require('./routes/auth.js');
const passportAuth = require('./routes/passport-auth-routes');
const otpRoute = require('./routes/OTP.js');
const userInfo = require('./routes/userinfo.js')
const fileupload = require('./routes/fileupload')
//Using imported Routes
app.use('/api/user', authRoute);
app.use('/', otpRoute);
app.use('/auth', passportAuth);
app.use('/info', userInfo);
app.use('/fileUpload', fileupload);

//==================================================================================================================================

app.get('/', function (req, res) {
  console.log('route / is accessed.');
  res.send('Hi');
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.listen(process.env.PORT || 4500, function () {
  console.log('Server is running on port 4500');
});
