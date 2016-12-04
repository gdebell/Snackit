//global variables
var map;
var shortestStoreLocation;
var shortestTotalDistance = 100000000;
var shortestData;
var shortestSchoolLocationEnd;
var shortestTotalDistanceEnd = 100000000;
var closestSchool;
var locationListings;
var shortestStoreName;
var shortestSchoolName;

//find all routes to grocery stories in db
function findRoutes(directionsService) {
  var result = [];
  //console.log(locationListings.stores[0].name);
  for (var i = 0; i < locationListings.stores.length; i++) {
    var storeLat = parseFloat(locationListings.stores[i].lat);
    var storeLong = parseFloat(locationListings.stores[i].long);
    var first = new google.maps.LatLng(storeLat, storeLong);
    var waypts = [{
      location: first,
      stopover: true
    }];
    result.push(new Promise((resolve, reject) => {
      var storeName = locationListings.stores[i].name;
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
        response.name = storeName;
        response.totalDistance = totalDistance;
        resolve(response);
      });
    }));
  }
  //finds the shortest route to get to the store, returns store address
  Promise.all(result)
    .then(res => {
      for (var i = 0; i < res.length; i++) {
        let totalDistance = 0;
        totalDistance += parseFloat(res[i].totalDistance);
        if (totalDistance < shortestTotalDistance) {
          shortestTotalDistance = totalDistance;
          shortestStoreLocation = res[i].routes[0].legs[0].end_address;
          shortestStoreName = res[i].name
        }
      }
      return shortestStoreLocation;
    })
    .then(data => {
      var directionsService = new google.maps.DirectionsService();
      findRoutesSchool(data, locationListings, directionsService);
    });
}

//find all routes to school in db
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
        var schoolName = locationListings.schools[i].name;
        directionsService.route({
          origin: storeLocal,
          destination: document.getElementById('endAddress').value,
          waypoints: waypts,
          optimizeWaypoints: true,
          travelMode: 'DRIVING'
        }, (response, status) => {
          //console.log(response, status);
          var route = response.routes[0];
          var totalDistance = 0;
          for (var i = 0; i < route.legs.length; i++) {
            totalDistance += parseFloat(route.legs[i].distance.text);
          }
          response.schoolName = schoolName;
          response.totalDistance = totalDistance;
          resolve(response);
        });
      }));
    }
    //finds the shortest school route
    Promise.all(result)
      .then(res => {
        for (var i = 0; i < res.length; i++) {
          let totalDistance = 0;
          totalDistance += parseFloat(res[i].totalDistance);
          if (totalDistance < shortestTotalDistanceEnd) {
            shortestTotalDistanceEnd = totalDistance;
            shortestSchoolLocationEnd = res[i].routes[0].legs[0].end_address;
            shortestSchoolName = res[i].schoolName;
          }
        }
        return shortestSchoolLocationEnd;
      })
      .then(schoolData => {
        closestSchool = schoolData;
        drawFinalRoute(shortestStoreLocation, closestSchool);
      });
  }, 10000);
}

//draws the final route on the map
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
  setTimeout(function() {
    var request = {
      origin: document.getElementById('startAddress').value,
      destination: document.getElementById('endAddress').value,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: 'DRIVING'
    };
    directionsService.route(request, function(result, status) {
      var drivingDirections = [];
      var routeTotalTime = 0;
      var originalRoute;
      if (status === 'OK') {
        for (var i = 0; i < result.routes[0].legs.length; i++ ) {
          for (var j = 0; j < result.routes[0].legs[i].steps.length; j++) {
            var step = result.routes[0].legs[i].steps[j].instructions;
            drivingDirections.push('<p>' + [j+1] + '. ' + step + '</p>' + '<br>');
          }
          routeTotalTime += parseFloat(result.routes[0].legs[i].duration.text);
        }
        //console.log('route total time', typeof routeTotalTime);
        //console.log('route original time', typeof originalRoute);
        //console.log(drivingDirections);
        // console.log(directionsDisplay.setDirections);
        setTimeout(function () {
          directionsService.route({
            origin: document.getElementById('startAddress').value,
            destination: document.getElementById('endAddress').value,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
          }, (response, status) => {
            //console.log('here is the information for just the reg route!!');
            //console.log(response, status);
            originalRoute = parseFloat(response.routes[0].legs[0].duration.text);
          });
        }, 1000);

        var extraTime = routeTotalTime - originalRoute;


        $("div.additionlTime").html('<p> Your delivery will only add ' + extraTime + ' minutes of drive time to your original route.  You will be stopping at ' + shortestStoreName + ' and ' + shortestSchoolName + '. Thank you!</p>');

        $("div.directions").html(drivingDirections);
        directionsDisplay.setDirections(result);

      } else {
        console.log('Error due to ', status);
      }
    });
  }, 1000);
}
