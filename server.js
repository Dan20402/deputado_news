const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/deputados', router);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Listening on port ${PORT}`));

//Just filler comment
