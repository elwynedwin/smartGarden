const jwt = require("jsonwebtoken");

module.exports = {
  //Check json web token exists
  requireAuth: (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
      try {
        //verifies token from browser cookie request and tests it with secret key stored in env
        jwt.verify(token, process.env.SECRETKEY, (err, decodedToken) => {
          if(err){
            console.log(err.message);
            res.redirect('/login');
          }else{
            next();
            console.log(decodedToken);
          }
        });
      }catch(error){
        return res.status(400).json({ err: error });
      }
    } else {
      res.redirect('/login');
    }
  },

  //Check Current User
  checkUser: (req, res, next) => {
    const accessToken = req.cookies.jwt;
    if(accessToken){
      try {
        //verifies token from browser cookie request and tests it with secret key stored in env
        const validToken = jwt.verify(accessToken, process.env.SECRETKEY);
        if (validToken){
          res.locals.userlogged = true;
          return next();
        }
      }catch (error) {
        return res.status(400).json({err: error});
      }
    }else{
      res.locals.userlogged = null;
      next();
    }
  },

  //Validates the user details entered
  validateUser: (req,res, next) => {
    try {
      const {name, email, password, passwordConfirm} = req.body

      //regex pattern is tested against email. makes sure email has '@'
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const emailCheck = emailPattern.test(email);
      //regex pattern is tested against password
      const passwordPattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
      const passwordCheck = passwordPattern.test(password);

      if (!emailCheck){
        return res.render('register',{
          failmessage: "Your Email isnt valid!",
          name: name

        })
      } else if (!passwordCheck){
        return res.render('register',{
          failmessage: "Your Password isnt valid! 1 Digit + 1 Uppercase + 1 Special Character + minimun 8 characters long ",
          name: name,
          email: email
        })
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Error"
      });
    }
  }

}