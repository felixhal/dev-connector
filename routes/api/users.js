const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//express-validator/check for validation
const { check, validationResult } = require('express-validator/check');
//load the user model
const User = require('../../models/User');

//@route  POST api /users
//@desc   Register User
//@access public

//Deifned in "Define Routes" in server.js
router.post(
  '/',
  [
    //Checks all the fields (validation) ans saves it in the array
    check('name', 'Name is Required').not().isEmpty(),
    check('email', 'Please enter a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //Saves all the errors into "errors array"
    const errors = validationResult(req);
    //If the "errors" array is NOT empty than there is a validation error
    if (!errors.isEmpty()) {
      //400 = bad request and display the errors
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    //CREATE USER
    try {
      //See if the user exist
      let user = await User.findOne({ email: email });

      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exist' }] });
      }

      //Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      //Save to db
      await user.save();

      //return the JSON web tokern
      const payload = {
        user: {
          id: user.id,
        },
      };

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
