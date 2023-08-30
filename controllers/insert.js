const jwt = require("jsonwebtoken")
const db = require("../database/database")

module.exports = {

    //function adds device to users account in userdevices
    addDevice: (req, res, next) => {
        const {device_id} = req.body;
        if (isNaN(device_id)) {
            return res.render('feedback',{
                failmessage: 'Device has to be selected! Retry...',
                userlogged: true
            })
        }
        const token = req.cookies.jwt;
        if (token){
        jwt.verify(token, process.env.SECRETKEY , (err,decodedToken) => {
            if (err){
            console.log(err.message);
            res.redirect('/');
            } else{
            console.log(decodedToken.userId);
            const id = decodedToken.userId;
            db.query('INSERT INTO userdevices SET ?', {id: id, device_id: device_id} , (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);    
                    return res.render('feedback',{
                        successmessage: 'Successfully added Device!',
                        userlogged: true
                    })
                }
            })
            }
        });
        }   
    },
    //function adds plant to users account in userdevices
    addPlant: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token){
        jwt.verify(token, process.env.SECRETKEY , (err,decodedToken) => {
            if (err){
            console.log(err.message);
            res.redirect('/');
            } else{
            const id = decodedToken.userId;
            db.query('INSERT INTO userplants SET ?', {id: id, plant_id: req.body.id} , (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('feedback',{
                        successmessage: 'Successfully added Plant!',
                        userlogged: true
                    })
                }
            })
            }
        });
        }
    },

    //both device and plant can be configured together and stored inside configureplant table
    configurePlant: (req, res, next) => {
        const {plant_id,device_id} = req.body;
        if (isNaN(device_id)) {
            return res.render('feedback',{
                failmessage: 'Device has to be selected! Retry...',
                userlogged: true
            })
        } else if (isNaN(plant_id)){
            return res.render('feedback',{
                failmessage: 'Plant has to be selected! Retry...',
                userlogged: true
            })
        }
        const token = req.cookies.jwt;
        if (token){
        jwt.verify(token, process.env.SECRETKEY , (err,decodedToken) => {
            if (err){
            console.log(err.message);
            res.redirect('/');
            } else{
            const id = decodedToken.userId;

            db.query('INSERT INTO configureplant SET ?;', {user_id: id, plant_id: req.body.plant_id, device_id: req.body.device_id} , (error, results) => {
                if(error){
                    console.log(error);
                } else {
    
                    db.query('INSERT INTO plantalert SET ?', {user_id: id, plant_id: plant_id, device_id: device_id, moisture_difference: 0}, (error,results) => {
                        console.log(results);

                        return res.render('feedback',{
                            successmessage: "Configuration Successful",
                            userlogged: true
                        })
                    })
                }
            })
            }
        });
        }
    },


    insertPlant: (req, res, next) => {
        const plantType = req.body.plant_type;
        const plantName = req.body.plant_name;
        const uses = req.body.uses;
        const plantFamily = req.body.plant_family;
        const season = req.body.season;
        const soilType = req.body.soil_type;
        const minTemperatureRequirement = parseInt(req.body.min_temperature_requirement);
        const maxTemperatureRequirement = parseInt(req.body.max_temperature_requirement);
        const minHumidityRequirement = parseInt(req.body.min_humidity_requirement);
        const maxHumidityRequirement = parseInt(req.body.max_humidity_requirement);

        //Error Checking for all fields that are initially empty that needs to be filled in
        if(!plantName){
            return res.render('feedback',{
                failmessage: "Plant name needs to be specified!",
                userlogged: true
            })
        }else if(!uses){
            return res.render('feedback',{
                failmessage: "Uses needs to be specified!",
                userlogged: true
            })
        }else if(isNaN(minTemperatureRequirement)){
            return res.render('feedback',{
                failmessage: "Minimum Temperature Requirement needs to be specified!",
                userlogged: true
            })
        }else if(isNaN(maxTemperatureRequirement)){
            return res.render('feedback',{
                failmessage: "Maximum Temperature Requirement needs to be specified!",
                userlogged: true
            })
        }else if(isNaN(minHumidityRequirement)){
            return res.render('feedback',{
                failmessage: "Minimum Humididty needs to be specified!",
                userlogged: true
            })
        }else if(isNaN(maxHumidityRequirement)){
            return res.render('feedback',{
                failmessage: "Maximum Humididty needs to be specified!",
                userlogged: true
            })
        }

        let sql = `INSERT INTO planttype (plant_type, plant_name, uses, plant_family, season, soil_type, min_temperature_requirement, max_temperature_requirement, min_humidity_requirement, max_humidity_requirement) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        let values = [plantType, plantName, uses, plantFamily, season, soilType, minTemperatureRequirement, maxTemperatureRequirement, minHumidityRequirement, maxHumidityRequirement];

        db.query(sql, values , (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('feedback',{
                    successmessage: 'Successfully entered device!',
                    userlogged: true
                })
            }
        })
    },


    insertDevice: (req, res, next) => {
        const deviceCategory = req.body.device_category;
        const deviceName = req.body.device_name;

        if (!deviceName) {
            return res.render('feedback', {
                failmessage: 'Device name not specified!',
                userlogged: true
            })
          }

        let sql = `INSERT INTO devicelist (device_category, device_name) VALUES (?, ?)`;
        let values = [deviceCategory, deviceName]

        db.query(sql, values , (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.redirect('/');
            }
        })
    }


}
