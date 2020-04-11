'use strict';

const helping = require('./depend.js');
const handler = require('./handler.js');




//////linking with location file\\\\
const checkLocation = require('./location.js');
helping.app.get('/location', checkLocation);


/////link with weather file\\\\\
const weatherHandler = require('./weather.js');
helping.app.get('/weather', weatherHandler);


///////link with trail file\\\\\
const trailHandler = require('./trails.js');
helping.app.get('/trails', trailHandler)

//////link with movies file\\\\\\
const moviesHandler = require('./movies.js');
helping.app.get('/movies',moviesHandler);

/////link with yelp file\\\\\
const yelpHandler = require('./yelp.js');
helping.app.get('/yelp',yelpHandler);


helping.client.connect()
.then(() => {
  
  helping.app.listen(helping.PORT, () => console.log(`App is listening on ${helping.PORT}`));
});

helping.app.use('*',handler.notFoundHandler);
helping.app.use(handler.errorHandler);