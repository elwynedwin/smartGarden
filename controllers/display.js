
const jwt = require("jsonwebtoken");
const db = require("../database/database")


module.exports = {
    displayPlantType: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token){
        jwt.verify(token, process.env.SECRETKEY , (err,decodedToken) => {
            if (err){
            console.log(err.message);
            res.redirect('/');
            } else{
            const id = decodedToken.userId;
            db.query('SELECT id,plant_type, plant_family, plant_name, uses FROM planttype WHERE id NOT IN (SELECT plant_id FROM userplants WHERE id = ?)',[id], function(err,results){
                if(err){
                    throw err;
                }else{
                    return res.render('planttype',{
                        data: results
                    });
                }
            })
            }
        });
        }
    },

    displayPlantInfo: (req, res, next) => {
        const plantID = req.params.id
        db.query('SELECT * FROM planttype WHERE id = ?;',[plantID], function(err,results){
            if(err){
                throw err;
            }else{
                return res.render('plantinfo',{
                    data: results
                });
            }
        })
    },
    
    displayDevices: (req, res, next) => { 
        db.query('SELECT * FROM devicelist WHERE device_id NOT IN (SELECT device_id FROM userdevices)', function(err,results){
            if(err){
                throw err;
            }else{
                return res.render('adddevice',{
                    data: results
                });
            }
        })
    },

    displayDashboard: (req, res, next) => { 

        const token = req.cookies.jwt;
            if (token){
                jwt.verify(token, process.env.SECRETKEY, (err,decodedToken) => {
                if (err){
                    console.log(err.message);
                    res.redirect('/');
                } else{
                    console.log(decodedToken.userId);
                    id = decodedToken.userId;
                }
                });
            }
            
        let sql1 = 'SELECT * FROM devicelist WHERE device_id IN (SELECT device_id FROM userdevices WHERE id = ?);'
        let sql2 = 'SELECT * FROM planttype WHERE id IN (SELECT plant_id FROM userplants WHERE id = ?);'
        let sql3 = 'SELECT * from users WHERE id = ?;'
        let sql4 = 'SELECT * FROM planttype INNER JOIN plantalert ON planttype.id = plantalert.plant_id INNER JOIN devicelist ON plantalert.device_id = devicelist.device_id WHERE plantalert.user_id = ? ORDER BY plantalert.moisture_difference;'
        let sqlcode = sql1 + sql2 + sql3 + sql4 
        let values = [id,id,id,id,id]

        db.query(sqlcode, values, function(err,results){
            if(err){
                throw err;
            }else{
                //maps results to act as an array
                var statusArray = results[3].map(function(e) {
                    return e.plant_id;
                    });

                    console.log(results[3])

                return res.render('index',{
                    dataDevices: results[0],
                    dataPlants: results[1],
                    dataUser: results[2],
                    dataStatus: results[3],
                    itemStatus: statusArray
                });
            }
        })
    },

    displayAccount: (req,res,next) => {

        const token = req.cookies.jwt;
        if (token){
            jwt.verify(token, process.env.SECRETKEY, (err,decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('/');
            } else{
                console.log(decodedToken.userId);
                id = decodedToken.userId;
            }
            });
        }

        db.query('SELECT * FROM users WHERE id = ?',[id], function(err,results){
            if(err){
                throw err;
            }else{
                return res.render('settings',{
                    data: results
                });
            }
        })
    },




    displayConfigurePlant: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token){
            jwt.verify(token, process.env.SECRETKEY, (err,decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('/');
            } else{
                console.log(decodedToken.userId);
                const id = decodedToken.userId;

                let query1 = 'SELECT * FROM devicelist WHERE device_id IN (SELECT device_id FROM userdevices WHERE id = ?) AND NOT EXISTS (SELECT * FROM configureplant WHERE configureplant.device_id = devicelist.device_id AND user_id = ?);'
                let query2 = 'SELECT * FROM planttype WHERE id IN (SELECT plant_id FROM userplants WHERE id = ?) AND NOT EXISTS (SELECT * FROM configureplant WHERE configureplant.plant_id = planttype.id AND user_id = ?);'
                let finalQuery = query1 + query2
                let values = [id,id,id,id]

                db.query(finalQuery, values, function(err,results){
                    if(err){
                        throw err;
                    }else{
                        console.log(req.body.device_id);
                        return res.render('configure',{
                            dataDevice: results[0],
                            dataPlant: results[1]
                        });
                    }
                })
            }
            });
        }
    },

    displayGraph: (req, res, next) => {

        const token = req.cookies.jwt;
        const plantID = req.params.plant_id

        if (token){
        jwt.verify(token, process.env.SECRETKEY , async (err,decodedToken) => {
            if (err){
            console.log(err.message);
            res.redirect('/');
            } else{
            const id = decodedToken.userId;
            await db.query('SELECT * FROM planttype WHERE id = ?;SELECT * FROM moisturedata WHERE plant_id = ? AND id = ?;',[plantID ,plantID, id],function(err,results){
                if(err){
                    throw err;
                }else{
                    var labels = results[1].map(function(e) {
                    return e.time;
                    });
    
                    var data = results[1].map(function(e) {
                    return e.moisture_level;
                    });
    
                    return res.render('moistureview',{
                        graphdata: data,
                        labeldata: labels,
                        data: results[0]
                    })
                }
            })
            }
        });
        }
    }

}



