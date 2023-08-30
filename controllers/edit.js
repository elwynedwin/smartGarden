const jwt = require("jsonwebtoken");
const db = require("../database/database")
const bcrypt = require("bcryptjs")

module.exports = {

    editAccount: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token){
            jwt.verify(token, process.env.SECRETKEY, (err,decodedToken) => {
            if (err){
                console.log(err.message);
                res.redirect('/');
            } else{
                console.log(decodedToken.userId);
                const decodedid = decodedToken.userId;
                const userID = req.body.id;
                const username = req.body.username;
                const email = req.body.email;

                if(decodedid != userID){
                    return res.status(400).json({ error: 'Id has been tampered with!' });
                }else {
                    db.query('UPDATE users SET username = ?, email = ? WHERE id = ?', [username, email, id] , function(err,results){
                        if(err){
                            throw err;
                            
                        }else{
                            return res.render('feedback', {
                                successmessage: "User Details has been Updated!",
                                userlogged: true
                              });
                        }
                    })
                }
            }
            });
        }
    },

    editPassword: (req, res, next) => {
        const token = req.cookies.jwt;
        if (token) {
          jwt.verify(token, process.env.SECRETKEY, (err, decodedToken) => {
            if (err) {
              console.log(err.message);
              res.redirect('/');
            } else {
              console.log(decodedToken.userId);
              id = decodedToken.userId;
            }
          });
        }
        const { currentpassword, newpassword, confirmpassword } = req.body;
        //passwords are compared to ensure they both match
        if (newpassword == confirmpassword) {
          db.query(`SELECT password FROM users WHERE id = ?`, [id], async (err, result) => {
            if (err) {
              throw err;
            }
            // user does not exist
            if (result.length === 0) {
              return res.render('feedback', {
                failmessage: "User does not exist.",
                userlogged: true
              });
            }
      
            const databasepassword = result[0].password;
            try {
              const match = await bcrypt.compare(currentpassword, databasepassword);
              if(match){
                //if the new password equals the database password it encrypts the new password
                let hashedpassword = await bcrypt.hash(newpassword, 8); //8 rounds of encryption
                db.query('UPDATE users SET password = ? WHERE id = ?', [hashedpassword, id], function (err, results) {
                  if(err){
                    throw err;
                  }else{
                    return res.render('feedback', {
                      successmessage: 'User Password Changed!',
                      userlogged: true
                    });
                  }
                });
              }else{
                return res.render('feedback', {
                  failmessage: "Current password is incorrect.",
                  userlogged: true
                });
              }
            }catch(error){
              console.log(error);
              throw error;
            }
          });
        }else{
          return res.render('feedback',{
            failmessage: "New Password doesn't match Confirm Password",
            userlogged: true
          });
        }
      }
      
}



