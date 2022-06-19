
const express = require('express');
const PORT = process.env.PORT || 3001;

const app = express(); //We assign express() to the app variable so that we can later chain on methods to the Express.js server.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
//mounts a function to the server that our requests will pass through before getting to the intended endpoint.
//The functions we can mount to our server are referred to as middleware.
app.use(express.json());
//^^used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object.
app.use(express.static('public'));
//This function will take in req.query as an argument and filter through the animals accordingly, returning the new filtered array
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => { //method to make our server listen
    console.log(`API server now on port ${PORT}`);
});
//start by creating a route that the front-end can request data from
