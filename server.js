'use strict';

// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());


app.get('/', (request, response) => {
  response.send('Home Page!');
});

// Route Definitions

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailHandler)

app.use('*', notFoundHandler);
app.use(errorHandler);

// Route Handlers

function locationHandler(Request, Response) {
  const city = Request.query.city;
  getlocation(city)
    .then((newLocation) => {
      Response.status(200).json(newLocation)
    })

    .catch((err) => errorHandler(err, request, response));
}

function getlocation(city) {
  const key = process.env.LOCATION_API_KEY;
  console.log(key);
  const locaUrl = `https://eu1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;

  return superagent.get(locaUrl)
    .then((geoData) => {
      const newLocation = new Location(city, geoData.body);
      return newLocation

    });

}
let lat ;
let lon ;
function Location(city, geoData) {
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
  lat = this.latitude;
  lon = this.longitude;
}

let arrWeather = [];

function weatherHandler(Request, Response) {
  const city = Request.query.search_query;
  getWeather(city)
    .then(arrWeather => {

      Response.status(200).json(arrWeather)
      console.log(arrWeather);
    })
    .catch((err) => errorHandler(err, request, response));
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
  const city = Request.query.search_query;
  getTrail(city)
    .then(arrTeail => {
      Response.status(200).json(arrTeail)
    })
}

function getTrail(city) {
  const key = process.env.TRAILS_API_KEY;
  const trailUrl = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
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
app.listen(PORT, () => console.log(`App is listening on ${PORT}`));

