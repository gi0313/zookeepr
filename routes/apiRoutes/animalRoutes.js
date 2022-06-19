const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');//  ../../means 2 levels higher
const router = require('express').Router();

//the get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
//The second is a callback function that will execute every time that route is accessed with a GET request.
//res.json(animals); sends entire json file to the client-not waht we need
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
// parse incoming string or array data
// takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.

    }
    res.json(results);
//Our code works well querying properties that are strings, but what if we wanted to filter out animals based on their personality traits
});

router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
      if (result) {
        res.json(result);
      } else { //To send JSON, just change send to json
        res.send(404);
      }
  });
//Now that we have multiple routes, we have to pay extra attention to the order of the routes. A param route must come after the other GET route
//If we make a GET request to /api/animals, then the app.get('/api/animals') callback function will execute. 
//But if it's a POST request, it'll go to the one we just created. 
router.post('/animals', (req, res) => {
    //req.body is where our incoming content will be
    //console.log(req.body);
      // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();
// Remember, the length property is always going to be one number ahead of the last index of the array so we can avoid any duplicate values.
// add animal to json file and animals array in this function
 // if any data in req.body is incorrect, send 400 error back
 if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
  const animal = createNewAnimal(req.body, animals);
    res.json(req.body);
  }
});
//we defined a route that listens for POST requests, not GET requests.

module.exports = router;