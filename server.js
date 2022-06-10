const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express(); //We assign express() to the app variable so that we can later chain on methods to the Express.js server.

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
      } else {
        res.send(404);
      }
  });

app.get('/api/animals', (req, res) => {
    const result = findById(req.params.id, animals);
    res.json(result);
//Now that we have multiple routes, we have to pay extra attention to the order of the routes. A param route must come after the other GET route
});

//the get() method requires two arguments. The first is a string that describes the route the client will have to fetch from. 
//The second is a callback function that will execute every time that route is accessed with a GET request.
app.get('/api/animals' ,(req, res) => {
    let results = animals;
    console.log(req.query)
    res.json(results);
    //res.json(animals); sends entire json file to the client-not waht we need
//we are using the send() method from the res parameter (short for response) to send the string Hello! to our client
})
app.listen(PORT, () => { //method to make our server listen
    console.log(`API server now on port ${PORT}`);
});
//start by creating a route that the front-end can request data from
const {animals} = require('./data/animals.json');