const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const db = require("../database/database")

module.exports = {

    registerUser: (req, res, next) => {
        const {name, email, password, passwordConfirm} = req.body
        //requests from body is called which is then used to search database to check if email exists
        db.query('SELECT email From users WHERE email = ?', [email], async(error, results) =>{
            if(error){
                console.log(error);
            }
            //if the selected query returns rows from the database, each failure message will be sent to register.hbs
            if(results.length > 0){
                return res.render('register', {
                    failmessage: "Email in use",
                    name: name
                })
            } else if (password !== passwordConfirm){
                return res.render('register',{
                    failmessage: "Passwords do not match",
                    name: name,
                    email: email
                });
            }


            let hashedpassword = await bcrypt.hash(password, 8); //8 rounds of encryption
            console.log(hashedpassword);

            //asynchronous function allows data to be inserted into database
            await db.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedpassword} , (error, results) => {
                if(error){
                    console.log(error);
                } else {
                    console.log(results);
                    return res.render('login', {
                        successmessage: 'User Registered',
                        email: email,
                        password: password
                    });
                }
            })
        });
    },

    loginUser: (req, res) => {
        const { email, password } = req.body;

        db.query(`SELECT * FROM users WHERE email = ${db.escape(email)};`, async (err, result) => {
            // user does not exists
            if (err) { 
              throw err;
            };
            if (!result.length) {
              return res.render('login', {
                failmessage: 'Password or Email incorrect!'
              });
            };
            // check password
            await bcrypt.compare(password, result[0]['password'], async (bErr, bResult) => {
            // wrong password
            if (bErr) {
              throw bErr
            }
            if (bResult) {
              const token = jwt.sign({
                username: result[0].username,
                userId: result[0].id
              },
                process.env.SECRETKEY, {
                expiresIn: '7d'
              }
              )
              res.cookie('jwt', token)
              await db.query('SELECT * FROM configureplant WHERE user_id = ?', [result[0].id], (error, result) => {
                if (error) {
                  throw error
                };
                if (!result.length) {
                  return res.redirect('/startup');
                } else {
                  return res.redirect('/');
                }
              })
            } else {
              return res.render('login', {
                failmessage: 'Password or Email incorrect!'
              })
            }
          }
          )
          }
        );
    },

    logoutUser: (req, res) => {
        res.cookie('jwt', '', {maxAge: 1});
        res.redirect('/');
    }
}