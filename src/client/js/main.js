//creates a roadmap centered over Denver
var map;

function initMap() {
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: new google.maps.LatLng(39.7033, -105.00),
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
  $('.route').on('submit', (eve) => {
    eve.preventDefault();
    const start = $('#startAddress').val();
    const end = $('#endAddress').val();
    findRoutes(directionsService);
  });
}

//puts school and store markers on the map from database
var locationListings;

function createMarkers(results) {
  locationListings = results;
  //create school markers
  var appleImage = {
    url: 'http://www.freeiconspng.com/uploads/apple-icon-19.png',
    scaledSize: new google.maps.Size(30, 30)
  };
  for (var i = 0; i < results.schools.length; i++) {
    var lat = parseFloat(results.schools[i].lat);
    var long = parseFloat(results.schools[i].long);
    var latLng = new google.maps.LatLng(lat, long);
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
    var latLngStore = new google.maps.LatLng(storeLat, storeLong);
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
var shortestSchoolLocationEnd;
var shortestTotalDistanceEnd = 100000000;
var closestSchool;

//find all routes to grocery stories in db
function findRoutes(directionsService) {
  var result = [];
  for (var i = 0; i < locationListings.stores.length; i++) {
    var storeLat = parseFloat(locationListings.stores[i].lat);
    var storeLong = parseFloat(locationListings.stores[i].long);
    var first = new google.maps.LatLng(storeLat, storeLong);
    var waypts = [{
      location: first,
      stopover: true
    }];

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
        response.totalDistance = totalDistance;
        resolve(response);
      });
    }));
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
      return shortestStoreLocation;
    })
    .then(data => {
      //console.log('shortest store location:', data);
      var directionsService = new google.maps.DirectionsService();
      findRoutesSchool(data, locationListings, directionsService);
    });
}

function findRoutesSchool(storeLocal, locationListings, directionsService) {
  setTimeout(function() {
    var result = [];
    for (var i = 0; i < locationListings.schools.length; i++) {
      var schoolLat = parseFloat(locationListings.schools[i].lat);
      var schoolLong = parseFloat(locationListings.schools[i].long);
      var second = new google.maps.LatLng(schoolLat, schoolLong);
      var waypts = [{
        location: second,
        stopover: true
      }];

      result.push(new Promise((resolve, reject) => {
        //console.log('start(store) location', storeLocal);
        //console.log('end localtion',document.getElementById('endAddress').value);
        directionsService.route({
          origin: storeLocal,
          destination: document.getElementById('endAddress').value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, (response, status) => {
          //console.log('response', response);
          //console.log('status', status);
          var route = response.routes[0];
          var totalDistance = 0;
          for (var i = 0; i < route.legs.length; i++) {
            totalDistance += parseFloat(route.legs[i].distance.text);
          }
          //console.log('after for looooooop');
          response.totalDistance = totalDistance;
          //console.log('response:', response);
          //console.log('respinse.totalDistance', response.totalDistance);
          resolve(response);
        });
      }));
    }
    //console.log('before promise dot all');
    Promise.all(result)
      .then(res => {
        //console.log('inside the school promise.all function');
        for (var i = 0; i < res.length; i++) {
          let totalDistance = 0;
          //console.log(res[i].totalDistance);
          totalDistance += parseFloat(res[i].totalDistance);
          //console.log('total distance', totalDistance);
          if (totalDistance < shortestTotalDistanceEnd) {
            shortestTotalDistanceEnd = totalDistance;
            shortestSchoolLocationEnd = res[i].routes[0].legs[0].end_address;
          }
        }
        //console.log(shortestTotalDistanceEnd, shortestSchoolLocationEnd);
        return shortestSchoolLocationEnd;
      })
      .then(schoolData => {
        //console.log('in the second promise', schoolData);
        //console.log('AT AT AT AT AT AT AT AT AT');
        closestSchool = schoolData;
        //console.log('closest school', closestSchool);
        //console.log('cloasest store', shortestStoreLocation);
        drawFinalRoute(shortestStoreLocation, closestSchool);
      });
  }, 10000);
}

function drawFinalRoute(store, school) {
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  directionsDisplay.setMap(map);
  var waypts = [{
    location: store,
    stopover: true
  }, {
    location: school,
    stopover: true
  }];
  //console.log('closest store in final function!!', school);
  //console.log('closest store in final function !!!', store);

  setTimeout(function() {
    var request = {
      origin: document.getElementById('startAddress').value,
      destination: document.getElementById('endAddress').value,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      if (status === 'OK') {
        console.log(status, request, result);
        // console.log(directionsDisplay);
        // console.log(directionsDisplay.setDirections);
        directionsDisplay.setDirections(result);
      } else {
        console.log('Error due to ', status);
      }
    });
  }, 2000);
}

function deleteMarkers(markersArray) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}
