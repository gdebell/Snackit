(function() {

  'use strict';

  // *** dependencies *** //
  const express = require('express');

  const appConfig = require('./config/main-config.js');
  const routeConfig = require('./config/route-config.js');
  const errorConfig = require('./config/error-config.js');

  // *** express instance *** //
  const app = express();

  // *** config *** //
  appConfig.init(app, express);
  routeConfig.init(app);
  errorConfig.init(app);
  module.exports = app;

}());

//To Display Route onto the DOM
//         // var route = response.routes[0];
//         // var summaryPanel = document.getElementById('directions_panel');
//         // summaryPanel.innerHTML = '';
//         //console.log(route);
//         // For each route, display summary information.
//         // var totalDistance = 0;
//         // for (var i = 0; i < route.legs.length; i++) {
//         //   totalDistance += parseFloat(route.legs[i].distance.text);
//         //   console.log(totalDistance);
//         //   var routeSegment = i + 1;
//         //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
//         //       '</b><br>';
//         //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
//         //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
//         //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
//         // }
//       } else {
//         window.alert('Directions request failed due to ' + status);
//       }
//       //console.log('here is the shortest data:', storeLocation);
