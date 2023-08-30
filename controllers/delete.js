const jwt = require("jsonwebtoken");
const db = require("../database/database")


module.exports = {

    //deletes device from user's account
    deleteDevice: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
          jwt.verify(token, process.env.SECRETKEY, async (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect("/");
            } else {
              const userId = decodedToken.userId;
              const deviceID = req.body.device_id;

              let query = "DELETE FROM userdevices WHERE device_id = ? AND id = ? AND NOT EXISTS (SELECT * FROM configureplant WHERE device_id = ? AND user_id = ?)";
              let values = [deviceID, userId, deviceID, userId]
      
              await db.query(query, values,(error, results) => { 
                  if (error) {
                    console.log(error);
                    return res.redirect("/");
                  }
                  if (results.affectedRows === 0) {
                    return res.render('feedback', {
                      failmessage: "Device is associated with a configureplant entry.",
                      userlogged: true
                    });

                  } else {
                    return res.render('feedback', {
                      successmessage: "Device deleted successfully.",
                      userlogged: true
                    });
                  }
                }
              );
            }
          });
        } else {
          res.redirect("/");
        }
      },


      //deletes plant from users account
      deletePlant: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
          jwt.verify(token, process.env.SECRETKEY, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect("/");
            } else {
              const userId = decodedToken.userId;
              const plantID = req.body.plant_id;

              let query = "DELETE FROM userplants WHERE plant_id = ? AND id = ? AND NOT EXISTS (SELECT * FROM configureplant WHERE plant_id = ? AND user_id = ?)";
              let values = [plantID, userId, plantID, userId]
      
              db.query(query, values,(error, results) => {
                  if (error) {
                    console.log(error);
                    return res.redirect("/");
                  }
                  if (results.affectedRows === 0) {
                    return res.render('feedback', {
                      failmessage: "Plant is associated with a configureplant entry.",
                      userlogged: true
                    });
                  } else {
                    return res.render('feedback', {
                      successmessage: "Plant deleted successfully.",
                      userlogged: true
                    });
                  }
                }
              );
            }
          });
        } else {
          res.redirect("/");
        }
      }

}
