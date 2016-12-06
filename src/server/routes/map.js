const express = require('express');
const router = express.Router();
const indexController = require('../controllers/index');
const knex = require('../db/knex');
const passport = require('passport');


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

//get the telephone number
router.post('/data', function (req, res, next) {
  console.log('in map post >>>>>>>AGAIN');
  var messageData = {
    phone: req.body.phone,
    directions: req.body.directions,
    store: req.body.store,
    school: req.body.school,
    sid: process.env.KEY_1,
    api: process.env.KEY_2
  }
  res.send({data: messageData});
})

module.exports = router;
