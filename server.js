'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);

app.get('/', (request, response) => {
  response.send('Home Page!');
});




// Route Definitions

app.get('/location', checkLocation);
app.get('/weather', weatherHandler);
app.get('/trails', trailHandler)

app.use('*', notFoundHandler);
app.use(errorHandler);


app.get('/cities',(request,response) =>{
  let sql = 'SELECT * FROM locations';
  clinet.query(sql)
  .then(result => {
    response.status(200).json(result)
  })
  .catch((err) => errorHandler(err, request, response));
})



// Route Handlers

function checkLocation (request,response){
  const city = request.query.city;
  let sqlCheck = `SELECT * FROM locations WHERE search_query = '${city}';`;
  console.log(sqlCheck);

  client.query(sqlCheck)
    .then(result => {
      if(result.rows.length > 0){
        //result.row [{id,search_query,formatted_query,latitude,longitude}]
        response.status(200).json(result.rows[0]);
        console.log(result.rows.length);
      } else {
        getlocation(city)
          .then(newLocation => {
            console.log(newLocation);
            //newLocation {search_query,formatted_query,latitude,longitude}
            let ccty = newLocation.search_query;
            let foQuery =  newLocation.formatted_query;
            let lat = newLocation.latitude;
            let lng = newLocation.longitude;
            let safeValues = [ccty,foQuery,lat,lng];
            let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);';

            client.query(SQL,safeValues)
              .then(result2 => {
                response.status(200).json(result2.rows[0]);
              })
              .catch (error => errorHandler(error));
          })
      }
    })
}

function getlocation(city) {
  const locationkey = process.env.LOCATION_API_KEY;
  // console.log(key);
  const locaUrl = `https://eu1.locationiq.com/v1/search.php?key=${locationkey}&q=${city}&format=json`;

  return superagent.get(locaUrl)
    .then((geoData) => {
      const newLocation = new Location(city, geoData.body);
      return newLocation

    });

}
// let lat ;
// let lon ;
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  // lat = this.latitude;
  // lon = this.longitude;
}

let arrWeather = [];

function weatherHandler(Request, Response) {
  const city = Request.query.search_query;
  getWeather(city)
    .then(arrWeather => {

      Response.status(200).json(arrWeather)
      console.log(arrWeather);
    })
    .catch((err) => errorHandler(err, Request, Response));
}

function getWeather(city) {
  const key = process.env.WEATHER_API_KEY;
  console.log(key);

  const weathurl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log(weathurl);

  return superagent.get(weathurl)
    .then(weatherData => {
      arrWeather = [];
      arrWeather = weatherData.body.data.map(val => {
        return new Weather(val)
      });
      return arrWeather;
    })

}

function Weather(day) {
  this.forecast = day.weather.description;
  this.time = new Date(day.valid_date).toDateString();
}


let arrTrail = [];


function trailHandler(Request, Response) {
  // const city = Request.query.search_query;
  let lat = Request.query.latitude;
  let lon = Request.query.longitude;
  getTrail(lat,lon)
    .then(arrTeail => {
      Response.status(200).json(arrTeail)
    })
}

function getTrail(lat,lon) {
  const key = process.env.TRAILS_API_KEY;
  const trailUrl = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=500&key=${key}`;
  return superagent.get(trailUrl)
    .then(trailData => {
      arrTrail = [];
      arrTrail = trailData.body.trails.map(val => {
        console.log(val);
        return new trails(val)

      });
      return arrTrail
    })

}


function trails(val) {
  this.name = val.name;
  this.location = val.location;
  this.length = val.length;
  this.stars = val.stars;
  this.star_votes = val.starVotes;
  this.summary = val.summary;
  this.trail_url = val.url;
  this.conditions = val.conditionDetails;
  this.condition_date = val.conditionDate.toString().slice(0, 9);
  this.condition_time = val.conditionDate.toString().slice(11);
}


function notFoundHandler(request, response) {
  response.status(404).send('huh?');
}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Make sure the server is listening for requests

client.connect()
.then(() => {
  
  app.listen(PORT, () => console.log(`App is listening on ${PORT}`));
});


