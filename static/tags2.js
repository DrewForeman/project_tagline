<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
    <meta charset="utf-8">
    <title>Directions service</title>
    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }
      #map {
        height: 100%;
      }
      // #floating-panel {
      //   position: absolute;
      //   top: 10px;
      //   left: 25%;
      //   z-index: 5;
      //   background-color: #fff;
      //   padding: 5px;
      //   border: 1px solid #999;
      //   text-align: center;
      //   font-family: 'Roboto','sans-serif';
      //   line-height: 30px;
      //   padding-left: 10px;
      // }
    </style>
  </head>
  <body>
    // <div id="floating-panel">
    // <b>Start: </b>
    // <select id="start">
    //   <option value="chicago, il">Chicago</option>
    //   <option value="st louis, mo">St Louis</option>
    //   <option value="joplin, mo">Joplin, MO</option>
    //   <option value="oklahoma city, ok">Oklahoma City</option>
    //   <option value="amarillo, tx">Amarillo</option>
    //   <option value="gallup, nm">Gallup, NM</option>
    //   <option value="flagstaff, az">Flagstaff, AZ</option>
    //   <option value="winona, az">Winona</option>
    //   <option value="kingman, az">Kingman</option>
    //   <option value="barstow, ca">Barstow</option>
    //   <option value="san bernardino, ca">San Bernardino</option>
    //   <option value="los angeles, ca">Los Angeles</option>
    // </select>
    // <b>End: </b>
    // <select id="end">
    //   <option value="chicago, il">Chicago</option>
    //   <option value="st louis, mo">St Louis</option>
    //   <option value="joplin, mo">Joplin, MO</option>
    //   <option value="oklahoma city, ok">Oklahoma City</option>
    //   <option value="amarillo, tx">Amarillo</option>
    //   <option value="gallup, nm">Gallup, NM</option>
    //   <option value="flagstaff, az">Flagstaff, AZ</option>
    //   <option value="winona, az">Winona</option>
    //   <option value="kingman, az">Kingman</option>
    //   <option value="barstow, ca">Barstow</option>
    //   <option value="san bernardino, ca">San Bernardino</option>
    //   <option value="los angeles, ca">Los Angeles</option>
    // </select>

    <form action="/tags" method="POST" id="directions-search">
      <label for="starting-point">Origin:</label>
      <input type="text", name="origin", id="starting-point"/>
      <label for="end-point">Destination:</label>
      <input type="text", name="destination", id="end-point"/>
      <input type="submit" value="Go"/>
    </form>

    </div>
    <div id="map"></div>


<script>

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;

  // Placeholder center of map: (this will eventually be the user's current geolocation)
  var myLatLng = {lat: 37.7749, lng: -122.4194};

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('tag-map'), {
    center: myLatLng,
    scrollwheel: true,
    zoom: 13,
    zoomControl: true,
    panControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    styles: MAPSTYLES,
    mapTypeId: google.maps.MapTypeId.ROADS
  });
  directionsDisplay.setMap(map);

  var onSubmitHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };
  document.getElementById('directions-search').addEventListener('submit', onSubmitHandler)

}


function calcAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById("origin").value;
    destination: document.getElementById("destination").value;
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

    </script>
    <script async defer
    src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCFNx1XR2QaQmZ8H-1qqwxLfE1vx2e5X5Q&callback=initMap">
    </script>
  </body>
</html>