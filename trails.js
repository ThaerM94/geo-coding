'use strict';

const helping = require('./depend.js');


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
  return helping.superagent.get(trailUrl)
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

module.exports=trailHandler;