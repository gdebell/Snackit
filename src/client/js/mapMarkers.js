//creates a roadmap centered over Denver
function initMap() {
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
      createMarkers(data);
    })
    .fail((err) => {
      console.log(err);
    });
}

//on submit, gets the start/end location from DOM
$('.route').on('submit', (eve) => {
  var directionsService = new google.maps.DirectionsService();
  eve.preventDefault();
  const start = $('#startAddress').val();
  const end = $('#endAddress').val();
  findRoutes(directionsService);
  $("#orange").addClass("animated infinite tada");
  $('#orange').css("opacity", 1);
  $('#orangeLoad').css("opacity", 1);
});

//puts school and store markers on the map from database
function createMarkers(results) {
  databaseLocation = results;
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
