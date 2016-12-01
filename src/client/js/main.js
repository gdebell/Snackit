//creates a roadmap centered over Denver
var map;
function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(39.7033,-105.00),
    mapTypeId: 'roadmap'
  });
  directionsDisplay.setMap(map);
  //ajax request to get long/lat of schools and stores in database
  $.ajax({
    type: 'GET',
    url: '/map/data',
    data: 'json'
  })
   .then((data) => {
    //console.log(data);
    createMarkers(data);
  })
   .fail((err) => {
    console.log(err);
  });
  //on submit, gets the start/end location from DOM
  $('.route').on('submit', (eve)=> {
    eve.preventDefault();
    const start = $('#startAddress').val();
    const end = $('#endAddress').val();
    findRoutes(directionsService, directionsDisplay);
  });
}

//puts school and store markers on the map from database
var locationListings;
function  createMarkers (results) {
  locationListings = results;
  //create school markers
  var appleImage = {
    url: 'http://www.freeiconspng.com/uploads/apple-icon-19.png',
    scaledSize: new google.maps.Size(30, 30)
  };
  for (var i = 0; i < results.schools.length; i++) {
    var lat = parseFloat(results.schools[i].lat);
    var long = parseFloat(results.schools[i].long);
    var latLng = new google.maps.LatLng(lat,long);
    var marker = new google.maps.Marker({
      position: latLng,
      icon: appleImage,
      map: map
    });
  }
  //create store markers
  var storeImage = {
    url: 'https://cdn3.iconfinder.com/data/icons/map-markers-1/512/supermarket-512.png',
    scaledSize: new google.maps.Size(30, 30)
  };
  for (var j = 0; j < results.stores.length; j++) {
    var storeLat = parseFloat(results.stores[j].lat);
    var storeLong = parseFloat(results.stores[j].long);
    var latLngStore = new google.maps.LatLng(storeLat,storeLong);
    var markerStore = new google.maps.Marker({
      position: latLngStore,
      icon: storeImage,
      map: map
    });
  }
}

var shortestStoreLocation;
var shortestTotalDistance = 100000000;
var shortestData;

//find all routes
function findRoutes(directionsService) {
  var result = []
  for (var i = 0; i < locationListings.stores.length; i++ ) {
    var storeLat = parseFloat(locationListings.stores[i].lat);
    var storeLong = parseFloat(locationListings.stores[i].long);
    var first = new google.maps.LatLng(storeLat,storeLong);
    var waypts = [{location: first, stopover: true}];
    // directionsService.route({
    //   origin: document.getElementById('startAddress').value,
    //   destination: document.getElementById('endAddress').value,
    //   waypoints: waypts,
    //   optimizeWaypoints: true,
    //   travelMode: 'DRIVING'
    // }, calculateRoute)

    result.push(new Promise((resolve, reject) => {
      directionsService.route({
        origin: document.getElementById('startAddress').value,
        destination: document.getElementById('endAddress').value,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
      }, (response, status) => {
        var route = response.routes[0];
        var totalDistance = 0;
        for (var i = 0; i < route.legs.length; i++) {
          totalDistance += parseFloat(route.legs[i].distance.text);
        }
        response.totalDistance = totalDistance
        resolve(response);
      })
    }))
  }

  //finds the shortest route to get to the store, returns store address
  Promise.all(result)
  .then(res => {
    //console.log(res[8].routes[0].legs[0].end_address);
    for (var i = 0; i < res.length; i++) {
      let totalDistance = 0;
      //console.log(res[i].totalDistance);
      totalDistance += parseFloat(res[i].totalDistance);
      //console.log('total distance', totalDistance);
      if (totalDistance < shortestTotalDistance) {
        shortestTotalDistance = totalDistance;
        shortestStoreLocation = res[i].routes[0].legs[0].end_address;
      }
    }
    //console.log(shortestTotalDistance, shortestStoreLocation);
    return shortestStoreLocation
  })
  .then(data => {
    console.log('in the second promise', data);
  })
}






function drawRoute(response, status) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    //console.log('status', status);
    //console.log('response', response);
      if (status === 'OK') {
        //console.log('here is the response', shortestData);
        //console.log(shortestData.routes[0].legs[0].end_address);
        directionsDisplay.setDirections(shortestData);
        // var route = response.routes[0];
        // var summaryPanel = document.getElementById('directions_panel');
        // summaryPanel.innerHTML = '';
        //console.log(route);
        // For each route, display summary information.
        // var totalDistance = 0;
        // for (var i = 0; i < route.legs.length; i++) {
        //   totalDistance += parseFloat(route.legs[i].distance.text);
        //   console.log(totalDistance);
        //   var routeSegment = i + 1;
        //   summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
        //       '</b><br>';
        //   summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        //   summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        //   summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        // }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
      //console.log('here is the shortest data:', storeLocation);
};




//calculate start to end, finding the closest school
// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//   for (var i = 0; i < locationListings.schools.length; i++ ) {
//     var schoolLat = parseFloat(locationListings.schools[i].lat);
//     var schoolLong = parseFloat(locationListings.schools[i].long);
//     var second = new google.maps.LatLng(schoolLat,schoolLong);
//
//     var waypts = [{location: second, stopover: true}];
//     var shortestTotalDistance = 100000000;
//     var shortestData;
//
//     directionsService.route({
//       origin: document.getElementById('startAddress').value,
//       destination: document.getElementById('endAddress').value,
//       waypoints: waypts,
//       optimizeWaypoints: true,
//       travelMode: 'DRIVING'
//     }, function(response, status) {
//       var route = response.routes[0];
//       var totalDistance = 0;
//       for (var i = 0; i < route.legs.length; i++) {
//         totalDistance += parseFloat(route.legs[i].distance.text);
//         //console.log('captured distances...', totalDistance);
//       }
//       //console.log('total distance before map display', totalDistance);
//       if (totalDistance < shortestTotalDistance) {
//         shortestTotalDistance = totalDistance;
//         shortestData = response;
//       }
//       //console.log('for real shortest distance', shortestTotalDistance, shortestData);
//
//       console.log(shortestData.routes[0].legs[0].end_address);
//       console.log(document.getElementById('endAddress'));
//       if (status === 'OK') {
//         //console.log('here is the response', shortestData);
//         //console.log(shortestData.routes[0].legs[0].end_address);
//         directionsDisplay.setDirections(shortestData);
//       } else {
//         window.alert('Directions request failed due to ' + status);
//       }
//     });
//   }
// }

function deleteMarkers(markersArray) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}
