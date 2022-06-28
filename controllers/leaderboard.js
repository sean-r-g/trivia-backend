const express = require('express');
const router = express.Router();
const postgres = require('../postgres.js');

router.get('/', (req, res) => {
    postgres.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 20;', (err, results) => {
        res.json(results.rows)
    });
});

router.post('/', (req, res) => {
    postgres.query(`INSERT INTO leaderboard (email, score) VALUES ('${req.body.email}', ${req.body.score});`, (err, results) => {
        postgres.query('SELECT * FROM leaderboard ORDER BY score DESC LIMIT 20;', (err, results) => {
            if (err) {
                console.log(err);
            } else {
            console.log(req.body);
            res.json(results.rows)
            }
        });
    })
});


module.exports = router
