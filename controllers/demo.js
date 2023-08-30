const jwt = require("jsonwebtoken")
const db = require("../database/database")

module.exports = {

    generateMoistureData: (req, res, next) => {
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
        const plantID = req.params.plant_id
        db.query('SELECT device_id FROM configureplant WHERE plant_id = ?',[plantID], async function(err,results){
            if(err){
                throw err;
            }else{
                const startDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); //Allows start date to start from 2 previous days 
                for (let i = 0; i < 24; i++) {
                  const date = new Date(startDate.getTime() + i * 60 * 60 * 1000);
                  const randomInt = Math.random() * 2 - 1; // Random value between -1 and 1
                  const moistureLevel = Math.floor((Math.cos(0.1 * i) * 0.5 + 8) + randomInt); // math.cos allows a wave pattern to be formed
                  const time = (i + 1) * 100; // increment time by 100 each loop iteration
                  const plantID = req.params.plant_id;
                  const deviceID = results[0].device_id;


                    const sql = 'INSERT INTO moisturedata SET ?;'
                    const values = {
                        id: id,
                        moisture_level: moistureLevel,
                        date: date,
                        time: time,
                        device_id: deviceID,
                        plant_id: plantID
                    }

                    await db.query(sql, values , function(err,results){
                        if(err){
                            throw err;
                        }else{
                            console.log(results)                      
                        }
                    })
                    if(i == 24){
                        db.end();
                    }
                }
                return res.render('feedback', {
                    successmessage: 'Successfully Generated 24 data values for Demo Data!',
                    userlogged: true
                })  
            }
        })
    },

    waterPlant: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
          jwt.verify(token, process.env.SECRETKEY, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect('/');
            } else {
              console.log(decodedToken.userId);
              const userID = decodedToken.userId;
              const plantID = req.params.plant_id;

              db.query('SELECT moisture_difference FROM plantalert WHERE plant_id = ? AND user_id = ?',[plantID, userID],function (err, results) {
                  if (err) {
                    throw err;
                  } else {
                    if (results.length > 0) {
                      const currentDifference = results[0].moisture_difference;
                      const updatedDifference = currentDifference + 10;
                      db.query('UPDATE plantalert SET moisture_difference = ? WHERE plant_id = ? AND user_id = ?',[updatedDifference, plantID, userID],
                        function (err, results) {
                          if (err) {
                            throw err;
                          } else {
                            return res.render('feedback', {
                              successmessage: 'Updated by 10!',
                              userlogged: true
                            });
                          }
                        }
                      );
                    } else {
                      // case when no row is found from the given plant_id and user_id
                      return res.render('feedback', {
                        errormessage: 'No record found!',
                        userlogged: true
                      });
                    }
                  }
                }
              );
            }
          });
        }
      },



    controlTemperature: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
          jwt.verify(token, process.env.SECRETKEY, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect('/');
            } else {
              console.log(decodedToken.userId);
              const userID = decodedToken.userId;
              const plantID = req.params.plant_id;
              const sliderValue = req.body.slider;

              db.query('SELECT moisture_difference FROM plantalert WHERE plant_id = ? AND user_id = ?',[plantID, userID],function (err, results) {
                  if (err) {
                    throw err;
                  } else {
                    if (results.length > 0) {
                      const currentDifference = results[0].moisture_difference;
                      const updatedDifference = currentDifference - (sliderValue/5);
                      db.query('UPDATE plantalert SET moisture_difference = ? WHERE plant_id = ? AND user_id = ?',[updatedDifference, plantID, userID],
                        function (err, results) {
                          if (err) {
                            throw err;
                          } else {
                            return res.render('feedback', {
                              successmessage: 'Updated!',
                              userlogged: true
                            });
                          }
                        }
                      );
                    } else {
                      // case when no row is found from the given plant_id and user_id
                      return res.render('feedback', {
                        errormessage: 'No record found!',
                        userlogged: true
                      });
                    }
                  }
                }
              );
            }
          });
        }
      }
      


}