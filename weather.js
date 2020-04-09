'use strict';

const helping = require('./depend.js');
const handler = require('./handler.js');


let arrWeather = [];

function weatherHandler(Request, Response) {
  const city = Request.query.search_query;
  getWeather(city)
    .then(arrWeather => {

      Response.status(200).json(arrWeather)
      console.log(arrWeather);
    })
    .catch((err) => handler.errorHandler(err, Request, Response));
}

function getWeather(city) {
  const key = process.env.WEATHER_API_KEY;
  console.log(key);

  const weathurl = `https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=${key}`;
  console.log(weathurl);

  return helping.superagent.get(weathurl)
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

module.exports = weatherHandler;