require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const port = 1890;
const admin = require("firebase-admin");
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const restaurantRouter = require('./routes/restaurant');
const categoryRouter = require('./routes/category');
const foodRouter = require('./routes/food');

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // this is important!
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain:process.env.FIREBASE_UNIVERSE_DOMAIN
  })
});


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', authRouter);
app.use('/api/users', userRouter);
app.use('/api/restaurant', restaurantRouter);
app.use('/api/category', categoryRouter);
app.use('/api/foods', foodRouter)
app.listen(process.env.PORT || port, ()=> console.log(`App is running on http://localhost: ${process.env.PORT}!`))

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log(`Database connected successfully`)
}).catch((err)=> console.log(err))

