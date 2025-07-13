const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const port = 1890;
const admin = require("firebase-admin");
const serviceAccount = require("./servicesAccountKey.json");
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const restaurantRouter = require('./routes/restaurant');
const categoryRouter = require('./routes/category');
const foodRouter = require('./routes/food');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

dotenv.config();

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

