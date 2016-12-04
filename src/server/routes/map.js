const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const knex = require('../db/knex');

//get data from server side data base
router.get('/', function (req, res, next) {
  console.log('hello');
  const renderObject = {};
  knex('school')
  .select('*')
  .then((data) => {
    knex('store')
    .select('*')
    .then((moreData) => {
      renderObject.schools = data;
      renderObject.stores = moreData;
      res.render('map/map', renderObject);
    });
  });
});

//get route for page to get map
router.get('/data', function (req, res, next) {
  const renderObject = {};
  knex('school')
  .select('*')
  .then((data) => {
    knex('store')
    .select('*')
    .then((moreData) => {
      renderObject.schools = data;
      renderObject.stores = moreData;
      res.json({
        schools: renderObject.schools,
        stores: renderObject.stores
      });
    });
  });
});

module.exports = router;
