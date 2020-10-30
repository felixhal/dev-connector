const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
//express-validator/check for validation
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');

//@route  GET api /auth
//@desc   Test route
//@access public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//LOGIN MECHANISM

//@route  POST api /users
//@desc   Register User
//@access public

//Deifned in "Define Routes" in server.js
router.post(
  '/',
  [
    //Checks all the fields (validation) ans saves it in the array
    check('email', 'Please enter a valid email address').isEmail(),
    check('password', 'Password is Required').exists(),
  ],
  async (req, res) => {
    //Saves all the errors into "errors array"
    const errors = validationResult(req);
    //If the "errors" array is NOT empty than there is a validation error
    if (!errors.isEmpty()) {
      //400 = bad request and display the errors
      return res.status(400).json({ errors: errors.array() });
    }

    //Get email and password from body
    const { email, password } = req.body;

    try {
      //See if the user exist (find by email)
      let user = await User.findOne({ email: email });

      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid User' }] });
      }

      //compare the if it's true
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Password' }] });
      }

      //return the JSON web tokern
      const payload = {
        user: {
          id: user.id,
        },
      };

      //sign the token with all the data
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token }); //data we want to send
        }
      );
    } catch (err) {
      //error message produced by server and recorded for err variable
      console.error(err.message);
      //500 = internal Server Error
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
