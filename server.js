const {animals} = require('./data/animals.json');
const express = require('express');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');
const app = express(); //We assign express() to the app variable so that we can later chain on methods to the Express.js server.
// parse incoming string or array data
// takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
//mounts a function to the server that our requests will pass through before getting to the intended endpoint.
//The functions we can mount to our server are referred to as middleware.
app.use(express.json());
//^^used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object.

//This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray =[];
    //We save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //If personalityTraits isa a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
    //Loop through each trait in the personalityTraits array
    personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !==-1
      )
    })
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    //return filtered results
    return filteredResults;
//This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
}
//takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal (body,animalsArray) {
// we just created a function that accepts the POST route's req.body value and the array we want to add the data to
//animalsArray, because the function is for adding a new animal to the catalog.
const animal = body;
animalsArray.push(animal);
fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({animals: animalsArray}, null, 2)
);
    // return finished code to post route for response
    return animal;
    //return body;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

//the get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
//The second is a callback function that will execute every time that route is accessed with a GET request.
//res.json(animals); sends entire json file to the client-not waht we need
//we are using the send() method from the res parameter (short for response) to send the string Hello! to our client
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
//Our code works well querying properties that are strings, but what if we wanted to filter out animals based on their personality traits
})

app.get('/api/animals/:id', (req, res) => {
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
app.post('/api/animals', (req, res) => {
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
app.listen(PORT, () => { //method to make our server listen
    console.log(`API server now on port ${PORT}`);
});
//start by creating a route that the front-end can request data from
