const express = require('express');
const router = express.Router();
const postgres = require('../postgres.js');

const randomid = () => {
    
}

router.get('/', (req, res) => {
    postgres.query('SELECT * FROM questions ORDER BY id ASC;', (err, results) => {
        res.json(results.rows)
    });
});

router.get('/:id', (req, res) => {
    postgres.query(`SELECT * FROM questions WHERE id = ${req.params.id};`, (err, results) => {
        res.json(results.rows)
    });
});

router.post('/', (req, res) => {
    postgres.query(`INSERT INTO questions (category, question, answer, image) VALUES ('${req.body.category}', '${req.body.question}', '${req.body.answer}', '${req.body.image}')`, (err, results) => {
        postgres.query('SELECT * FROM questions ORDER BY id ASC;', (err, results) => {
            if (err) {
                console.log(err);
            } else {
            console.log(req.body);
            res.json(results.rows)
            }
        });
    })
});

router.delete('/:id', (req, res) => {
    postgres.query(`DELETE FROM questions WHERE id = ${req.params.id};`, (err, results) => {
        postgres.query('SELECT * FROM questions ORDER BY id ASC;', (err, results) => {
            res.json(results.rows)
        });
    });
});

router.put('/:id', (req, res) => {
    postgres.query(`UPDATE questions SET category = '${req.body.category}', question = '${req.body.question}', answer = '${req.body.answer}', image = '${req.body.image}' WHERE id = ${req.params.id}`, (err, results) => {
        postgres.query('SELECT * FROM questions ORDER BY id ASC;', (err, results) => {
            res.json(results.rows)
        });
    })
});




module.exports = router
