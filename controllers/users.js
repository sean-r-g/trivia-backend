const express = require('express');
const router = express.Router();
const postgres = require('../postgres.js');
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
require('dotenv').config()
// router.get('/', (req,res)=>{
//     res.send({
//         token: ''
//     })
// })

router.post('/signup', [
    check('email', 'Invalid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({min: 6})
],
    async (req, res) => {
        const email = req.body.email
        const password = req.body.password
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }
        // let user = postgres.query(`SELECT * FROM users WHERE email = '${email}';`)
        // if (user) {
        // return res.status(200).json({
        //     errors: [{
        //         msg: 'The user already exists',
        //     },
        //     ],
        // })
        // }
        const salt = await bcrypt.genSalt(10)
        console.log('salt:', salt);
        const hashedPassword = await bcrypt.hash(password, salt)
        console.log('hashed password:', hashedPassword);
        postgres.query(`INSERT INTO users (email, password) VALUES ('${req.body.email}', '${hashedPassword}');`, (err)=>{
            if (err) {
                console.log(err);
            }
        })
        const accessToken = await JWT.sign(
            {email},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '10m'}
        )
        res.json({
            accessToken
        })
    })

router.post('/login', async (req, res) =>{
    const email = req.body.email
    const password = req.body.password
    // let user = postgres.query(`SELECT * FROM users WHERE email = '${email}';`)
    // console.log(user);
    // if (!user) {
    //     return res.status(400).json({
    //         errors: [{
    //             msg: 'Invalid username or password'
    //         }]
    //     })
    // }
    let dbPassword = postgres.query(`SELECT password FROM users WHERE email = '${req.body.email}';`)
    let isMatch = await bcrypt.compare(password, postgres.query(`SELECT password FROM users WHERE email = '${req.body.email}';`).toString())
    // if (!isMatch) {
    //     return res.status(401).json({
    //         errors: [{
    //             msg: 'Email or password is invalid'
    //         }]
    //     })
    // }
    const accessToken = await JWT.sign(
        {email},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '10m'}
    )
    res.json({accessToken})
})

module.exports = router