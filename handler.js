'use strict';

function notFoundHandler(request, response) {
    response.status(404).send('huh?');
  }
  
  function errorHandler(error, request, response) {
    response.status(500).send(error);
  }

  let handl = {

    notFoundHandler: notFoundHandler,
    errorHandler: errorHandler,
};

module.exports=handl;

