$(document).on('ready', () => {
  $('.route').on('submit', (eve)=> {
    eve.preventDefault();
    const start = $('#startAddress').val();
    const end = $('#endAddress').val();
    console.log(start);
    console.log(end);
    distanceMap(start, end);
    //calculateAndDisplayRoute();
  });
});

//creates a roadmap centered over Denver
var map;
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), {
  zoom: 12,
  center: new google.maps.LatLng(39.7033,-105.00),
  mapTypeId: 'roadmap'
});
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
}

//puts school and store markers on the map from database
var locationListings;
function  createMarkers (results) {
  locationListings = results;
  //create school markers
  var appleImage = {
    url: 'http://www.freeiconspng.com/uploads/apple-icon-19.png',
    scaledSize: new google.maps.Size(20, 20)
  };
  for (var i = 0; i < results.schools.length; i ++) {
    var lat = parseFloat(results.schools[i].lat);
    var long = parseFloat(results.schools[i].long);
    // console.log('lat', lat, 'long', long);
    var latLng = new google.maps.LatLng(lat,-long);
    var marker = new google.maps.Marker({
      position: latLng,
      icon: appleImage,
      map: map
    });
  }
  //create store markers
  var storeImage = {
    url: 'https://cdn3.iconfinder.com/data/icons/map-markers-1/512/supermarket-512.png',
    scaledSize: new google.maps.Size(20, 20)
  };
  //console.log('stores', results.stores);
  for (var j =0; j < results.stores.length; j ++) {
    var storeLat = parseFloat(results.stores[j].lat);
    var storeLong = parseFloat(results.stores[j].long);
    var latLng = new google.maps.LatLng(storeLat, -storeLong);
    var marker = new google.maps.Marker({
      position: latLng,
      icon: storeImage,
      map: map
    });
  }
}

function distanceMap(start, end) {
  console.log(locationListings.schools);
  var store = locationListings.schools;

  var bounds = new google.maps.LatLngBounds();
  var markersArray = [];
  var origin2 = start;
  var destinationA = end;

  var destinationIcon = 'https://chart.googleapis.com/chart?' +
           'chst=d_map_pin_letter&chld=D|FF0000|000000';
  var originIcon = 'https://chart.googleapis.com/chart?' +
           'chst=d_map_pin_letter&chld=O|FFFF00|000000';

  var geocoder = new google.maps.Geocoder();
  var service = new google.maps.DistanceMatrixService();

  service.getDistanceMatrix({
    origins: [origin2],
    destinations: [destinationA],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false
  }, function(response, status) {
    if (status !== 'OK') {
      console.log('Error was: ' + status);
    } else {
      var originList = response.originAddresses;
      var destinationList = response.destinationAddresses;
      var outputDiv = document.getElementById('output');
      outputDiv.innerHTML = '';
      deleteMarkers(markersArray);

      var showGeocodedAddressOnMap = function(asDestination) {
        var icon = asDestination ? destinationIcon : originIcon;
        return function(results, status) {
          if (status === 'OK') {
            map.fitBounds(bounds.extend(results[0].geometry.location));
            markersArray.push(new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              icon: icon
            }));
          } else {
            console.log('Geocode was not successful due to: ' + status);
          }
        };
      };

      for (var i = 0; i < originList.length; i++) {
        var results = response.rows[i].elements;
        geocoder.geocode({address: originList[i]}, showGeocodedAddressOnMap(false));
      for (var j = 0; j < results.length; j++) {
        geocoder.geocode({address: destinationList[j]},
        showGeocodedAddressOnMap(true));
        outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
        ': ' + results[j].distance.text + ' in ' + results[j].duration.text + '<br>';
       }
     }
   }
  });
 }


//start here with  waypoint directions
// function calculateAndDisplayRoute(directionsService, directionsDisplay) {
//   console.log('inside cal and display route function');
//   var waypts = [];
//   var checkboxArray = document.getElementById('waypoints');
//   for (var i = 0; i < checkboxArray.length; i++) {
//     if (checkboxArray.options[i].selected) {
//       waypts.push({
//         location: checkboxArray[i].value,
//         stopover: true
//       });
//     }
//   }
//
//   directionsService.route({
//     origin: document.getElementById('startAddress').value,
//     destination: document.getElementById('endAddress').value,
//     waypoints: waypts,
//     optimizeWaypoints: true,
//     travelMode: 'DRIVING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       directionsDisplay.setDirections(response);
//       var route = response.routes[0];
//       var summaryPanel = document.getElementById('directions-panel');
//       summaryPanel.innerHTML = '';
//       // For each route, display summary information.
//       for (var i = 0; i < route.legs.length; i++) {
//         var routeSegment = i + 1;
//         summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
//             '</b><br>';
//         summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
//         summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
//         summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
//       }
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// }


function deleteMarkers(markersArray) {
  for (var i = 0; i < markersArray.length; i++) {
    markersArray[i].setMap(null);
  }
  markersArray = [];
}
