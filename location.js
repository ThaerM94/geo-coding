'use strict';

const helping = require('./depend.js');
// const handler = require('./handler.js');





function checkLocation (request,response){
    const city = request.query.city;
    let sqlCheck = `SELECT * FROM locations WHERE search_query = '${city}';`;
    console.log(sqlCheck);
  
    helping.client.query(sqlCheck)
      .then(result => {
        if(result.rows.length > 0){
          response.status(200).json(result.rows[0]);
          console.log(result.rows.length);
        } else {
          getlocation(city)
            .then(newLocation => {
              console.log(newLocation);
              let ccty = newLocation.search_query;
              let foQuery =  newLocation.formatted_query;
              let lat = newLocation.latitude;
              let lng = newLocation.longitude;
              let safeValues = [ccty,foQuery,lat,lng];
              let SQL = 'INSERT INTO locations (search_query,formatted_query,latitude,longitude) VALUES ($1,$2,$3,$4);';
            
             return helping.client.query(SQL,safeValues)
                .then(result2 => {
                  response.status(200).json(result2.rows[0]);
                })
                .catch (error => handler.errorHandler(error));
            })
        }
      })
  }
  
  function getlocation(city) {
    const locationkey = process.env.LOCATION_API_KEY;
    console.log(locationkey);
    
    // console.log(key);
    const locaUrl = `https://eu1.locationiq.com/v1/search.php?key=${locationkey}&q=${city}&format=json`;
    console.log(locaUrl);
    
  
    return helping.superagent.get(locaUrl)
      .then((geoData) => {
        const newLocation = new Location(city, geoData.body);
        console.log(newLocation);
        
        return newLocation;

  
      });
  
  }

  function Location(city, geoData) {
    this.search_query = city;
    this.formatted_query = geoData[0].display_name;
    this.latitude = geoData[0].lat;
    this.longitude = geoData[0].lon;
   
  }

  module.exports = checkLocation;