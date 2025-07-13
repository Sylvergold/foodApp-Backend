const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Export the functions
module.exports = {
    // Create user with async and await
    createUser: async(req, res) =>{
        const user = req.body;

        try {
            await admin.auth().getUserByEmail(user.email);

            res.status(400).json({message: "Email already registered"})
        } catch (error) {
            // Error from firebase
            if(error.code === 'auth/user-not-found'){
                try {
                    // Create firebase User(Admin)
                    const userResponse = await admin.auth().createUser({
                        email: user.email, 
                        password: user.password,
                        emailVerified: false,
                        disabled: false
                    });
                    console.log(userResponse.uid);

                    // Creating a User that is going to be stored in Database
                    const newUser = new User({
                        username: user.username,
                        email: user.email,
                        // Encrypt the password by finding the secret key using CryptoJS
                        password: CryptoJS.AES.encrypt(user.password, process.env.SECRET).toString(),
                        uid: userResponse.uid,
                        userType: 'Client'
                    })
                    await newUser.save();
                    res.status(201).json({status: true})
                } catch (error) {
                    res.status(500).json({status: false, error: "Error creating user", error: error.message})
                }
            }
            
        }

    },

    loginUser: async(req, res) =>{
        try {
            const user = await User.findOne({email: req.body.email},{ __v: 0, updatedAt: 0, createdAt: 0})
            !user && res.status(401).json("wrong Credentials")
            const decryptedpassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            const decrypted = decryptedpassword.toString(CryptoJS.enc.Utf8);

            decrypted !== req.body.password && res.status(401).json("Wrong Password")
            const userToken = jwt.sign({id: user._id, userType: user.userType, email: user.email
            }, process.env.JWT_SECRET, {expiresIn: "1h"});
            const {password, email, ...others} = user._doc;
            res.status(200).json({...others, userToken})
        } catch (error) {
            res.status(500).json({status: false, error: error.message})
        }
    }
}