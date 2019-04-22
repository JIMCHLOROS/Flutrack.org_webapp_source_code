var map;

/**
 * The service workers registration.
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./js/sw.js').then(function (registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

/**
 * This method open json file and loop to parse json's content
 * and add the markers. ALso adds a info windows that is
 * displayed when you click on a marker
 */
function getLocalJSON() {
    var infowindow = new google.maps.InfoWindow();

    $.getJSON('./results.json', function (data) {
        for (const i in data) {
            let current = parseInt(data[i].aggravation);

            marker = new google.maps.Marker({
                position: new google.maps.LatLng(parseFloat(data[i].latitude), parseFloat(data[i].longitude)), // parsing coordinates
                map: map,
                icon: "./img/point.png",
                animation: google.maps.Animation.DROP // Drop new icons after refresh.
            });

            google.maps.event.addListener(marker, 'click',
                (function (marker, i) {
                    return function () {
                        infowindow.setContent(data[i].user_name + data[i].tweet_text); // infowindow displayed content.
                        infowindow.open(map, marker);
                    }
                })(marker, i));	// parameters
        }
    });
}

/**
 * This method called on Google maps API request.
 * Here we initialize our mapView.
 */
function initMap() {
    // New map element
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 39.6166642, lng: 19.916663},
        zoom: 8
    });
    // Listen for click on map to add a marker
    google.maps.event.addListener(map, 'click', function (event) {
        addMarker({coords: event.latLng});
    });

    locateUser();
    getLocalJSON();

}

/**
 * If we have access to location this
 * method will center the map there
 * and put a mark there
 */
function locateUser() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            initialLocation.content = "Your Location";
            // Center the map
            map.setCenter(initialLocation);
            //addMarker();
        });
    }
}

/**
 * Add Marker Function.
 * With custom icon.
 */
function addMarker(props) {
    const marker = new google.maps.Marker({
        position: new google.maps.LatLng(props.la, props.lo),
        map: map,
        icon: "./img/point.png"
    });

    // Check if there is any content
    if (props.content) {
        // put a text to the marker
        var infoWindow = new google.maps.InfoWindow({
            content: props.content
        });

        // Display it with a click using a listener
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
    }
}

/**
 * Here we get a Json Object through a GET request at a specific url.
 *
 * @param url the target url
 * @param callback the callback function
 */
/*
function getJSON({url, callback}) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
  xhr.responseType = 'json';
  xhr.onload = function () {
    console.log(xhr.responseText);
    const status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
}
*/
/**
 * Get JSON.
 *
 * @returns {Promise<void>}
 */
/*
async function getMarkers() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Access-Control-Allow-Origin', 'http://localhost:63342');
    headers.append('Access-Control-Allow-Credentials', 'true');

    const url = "http://flutrack.org/results.json";
    const re = await fetch(url)
        .then(response => response.text())
        .then(contents => console.log(contents))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));

    const json = await re.json();

    jQuery.parseJSON(json).forEach(function (element) {
        console.log(element);
    });
}

*/
