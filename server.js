const express = require('express');
//const fetch = require('node-fetch');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const router = require('./routes');

//require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const PORT = 3000;
app.listen(PORT, console.log(`Listening on port ${PORT}`));
