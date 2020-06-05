require('dotenv').config();
const express = require('express')
const router = require('./app/router');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('views',path.join(__dirname,'app/views'))
app.engine('ejs', require('express-ejs-extend')); // add this line
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);

app.listen(3000);