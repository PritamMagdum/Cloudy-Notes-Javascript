const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'PritamMagdum$1622'

// Create a user using POST "/api/auth/createuser". No login required
router.post('/createuser',
    [
        body('name', 'Enter a valid name').isLength({ min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 8 })
    ], async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // check whether the user is already exists or not
        try {
            let user = await User.findOne({ email: req.body.email });
            console.log(user);
            if (user) {
                return res.status(400).json({ error: "Sorrry user is already created" });
            }

            const salt = await bcrypt.genSalt(10)

            const secPass = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })

            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET)
            // res.json(user)
            res.json({ authToken })

            res.json(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("some error ouccured internally");
        }
    })

module.exports = router