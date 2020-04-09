// 'use strict';

// const helping = require('./depend.js');


// function yelpHandler(request,response){
//     let city = request.query.search_query;
//     const lat = request.query.latitude;
//     const lon = request.query.longitude;
//     getyelpData(city)
//       .then((yelpData)=>{
//         response.status(200).json(yelpData)
//       })
//   }
//   function getyelpData(city){
//     const key = process.env.YELP_API_KEY;
//     let url =`${key} ${city}`;
//     return helping.superagent.get(url)
//       .then(yelData =>{
//         let yelpArray = yelData.body.!!!!!!.map((value) => {
//           return new Yelp(value);
//         })
//         return yelpArray;
//       })
//       .catch((err) => errorHandler(err));
//   }
//   function Yelp(value){
//     this.name = value.name;
//     this.image_url = value.imgurl;
//     this.price = value.price;
//     this.rating= value.rating;
//     this.url = value.url;
//   }

//   module.exports=yelpHandler;