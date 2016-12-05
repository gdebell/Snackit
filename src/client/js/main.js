//global variables
var map;
var shortestStoreLocation;
var shortestTotalDistance = 100000000;
var shortestData;
var shortestSchoolLocationEnd;
var shortestTotalDistanceEnd = 100000000;
var closestSchool;
var shortestStoreName;
var shortestSchoolName;
var databaseLocation;

//find all routes to grocery stories in db
function findRoutes(directionsService) {
  var result = [];
  //console.log(databaseLocation.stores[0].name);
  for (var i = 0; i < databaseLocation.stores.length; i++) {
    var storeLat = parseFloat(databaseLocation.stores[i].lat);
    var storeLong = parseFloat(databaseLocation.stores[i].long);
    var first = new google.maps.LatLng(storeLat, storeLong);
    var waypts = [{
      location: first,
      stopover: true
    }];
    result.push(new Promise((resolve, reject) => {
      var storeName = databaseLocation.stores[i].name;
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
      console.log('data', data, 'location listing', databaseLocation);
      var directionsService = new google.maps.DirectionsService();
      findRoutesSchool(data, databaseLocation, directionsService);
      return data;
    });
}

//find all routes to school in db
function findRoutesSchool(storeLocal, databaseLocation, directionsService) {
  setTimeout(function() {
    var result = [];
    for (var i = 0; i < databaseLocation.schools.length; i++) {
      var schoolLat = parseFloat(databaseLocation.schools[i].lat);
      var schoolLong = parseFloat(databaseLocation.schools[i].long);
      var second = new google.maps.LatLng(schoolLat, schoolLong);
      var waypts = [{
        location: second,
        stopover: true
      }];
      result.push(new Promise((resolve, reject) => {
        var schoolName = databaseLocation.schools[i].name;
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
  var drivingDirections = [];
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
        setTimeout(function () {
          directionsService.route({
            origin: document.getElementById('startAddress').value,
            destination: document.getElementById('endAddress').value,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
          }, (response, status) => {
            originalRoute = parseFloat(response.routes[0].legs[0].duration.text);
            $("div.directions").html(drivingDirections);
            $("#orange").removeClass("animated infinite tada");
            $("#orange").css("opacity", 0);
            $("#orangeText").css("opacity", 0);
            directionsDisplay.setDirections(result);
            displayInfo(routeTotalTime, originalRoute);
          });
        }, 1000);
      } else {
        console.log('Error due to ', status);
      }
    });
  }, 1000);
}

function displayInfo (extra, original) {
  var extraTime = extra - original;
  $("div.additionlTime").html('<h6 id="informUser"> Your delivery will add ' + extraTime + ' minutes of drive time to your original route. ' + ' You will be stopping at ' + shortestStoreName + ' and ' + shortestSchoolName +  '. <br> Scroll to the bottom for directions!</h6>');
}
