const fs = require("fs");
const path = require("path");
//required since now not in the server.js file

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
}
//need to export then so they can be used in the server.js file