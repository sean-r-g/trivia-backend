const express = require('express');
const app = express();
const postgres = require('./postgres.js');
const triviaController = require('./controllers/trivia.js');


app.use(express.json());
app.use(express.static('public'))


app.use('/trivia', triviaController);

postgres.connect();

app.listen(process.env.PORT || 3000, () => {
    console.log(`listening...`);
})