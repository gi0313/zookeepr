const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

router.use(animalRoutes);

router.use(zookeeperRoutes);

module.exports = router;

//Doing it this way, we're using apiRoutes/index.js as a central hub for all routing functions
//we may want to add to the application. It may seem like overkill with just one exported module, 
//but as your application evolves, it will become a very efficient mechanism for managing your routing code and keeping it modularized.