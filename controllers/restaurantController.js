const Restaurant = require('../models/restaurant');

module.exports = {
    addRestaurant: async(req, res) => {
        const newRestaurant = new Restaurant(req.body);

        try {
            await newRestaurant.save();
            res.status(201).json({status: true, message: ` Restaurant created successfully`})
        } catch (error) {
            res.status(500).json({status: false, message: `Error creating restaurant`, error: error.message})
        }
    },

    serviceAvailability: async(req, res) =>{
        const restaurantId = req.params.id;
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if(!restaurant){
                return res.status(404).json({status: false, message: `Restaurant not found`})
            }
            restaurant.isAvailable = restaurant.isAvailable;
            await restaurant.save();
            res.status(200).json({status:true, message: `Availability successfully toggled`, isAvailable: restaurant.isAvailable})
        } catch (error) {
            res.status(500).json({status: false, message: `Error toggling restaurant availability`, error: error.message})
        }
    },

    deleteRestaurant: async(req, res) =>{
        const restaurantId = req.params.id;
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if(!restaurant){
                return res.status(403).json({status: false, message: `Restaurant not found`})
            }
            await Restaurant.findByIdAndDelete(restaurantId);
            res.status(200).json({status:true, message: `Availability successfully deleted`})
            
        } catch (error) {
            res.status(500).json({status: false, message: `Error deleting restaurant`, error: error.message})
        }
    },

    getRestaurant: async(req, res) =>{
        const restaurantId = req.params.id;
        try {
            const restaurant = await Restaurant.findById(restaurantId);
            if(!restaurant){
                return res.status(404).json({status: false, message: `Restaurant not found`});
            }
            res.status(200).json(restaurant)
        } catch (error) {
            res.status(500).json({status: false, message: `Error retrieving the restaurant`, error: error.message})
        }
    },

    getRandomRestaurant: async(req, res) =>{
        try {
            let randomRestaurant = [];
            if(req.params.code){
                randomRestaurant = await Restaurant.aggregate([
                    {$match: {code: req.params.code}},
                    {$sample: {size: 5}},
                    {$project: {__v: 0}}
                ])
            };
            if(!randomRestaurant.length){
                randomRestaurant = await Restaurant.aggregate([
                    {$sample: {size: 5}},
                    {$project: {__v: 0}}
                ])
            };
            if(randomRestaurant.length){
                res.status(200).json(randomRestaurant)
            }
        } catch (error) {
            res.status(500).json({status: false, message: `Error finding restaurant`, error: error.message})
        }
    }
}