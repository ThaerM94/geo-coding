
let helper = {};
require('dotenv').config();

// Application Dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');
 helper.superagent = require('superagent');

// Application Setup
 helper.PORT = process.env.PORT;
 const app = express();
 helper.app=app;
// const pg = require('pg');

require('dotenv').config();

 helper.client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());

module.exports=helper;