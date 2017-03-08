var mFavPlaces = [

    {
        name: "Takeshita Street",
        lat: 35.6715659,
        lng: 139.7031469,
        imgSrc: "img/favPlaces/takeshita.jpg",
    }, {
        name: "Nakamise Street",
        lat: 35.7113873,
        lng: 139.794207,
        imgSrc: "img/favPlaces/asakusa.jpg",
    }, {
        name: "Yodobashi-Akiba",
        lat: 35.6995227,
        lng: 139.7734171,
        imgSrc: "img/favPlaces/akihabara.jpg",
    }, {
        name: "Meiji Jingu",
        lat: 35.6763976,
        lng: 139.6993259,
        imgSrc: "img/favPlaces/meiji.jpg",
    }, {
        name: "Shibuya Crossing",
        lat: 35.6594087,
        lng: 139.6981677,
        imgSrc: "img/favPlaces/shibuya.jpg",
    }

];

// Stores the Google maps markers for the favPlaces
var mMarkers = {};

var mQueryInfo = {
    "near": "Tokyo",
    "client_id": "AG5MATDOQ5HAXLODDIV1YALJZA4IN3LS5XEUOPWQIGHG0BHL",
    "client_secret": "PPJYHED0SI5WLWC05LXGD1E3T1JDQI23EWNSTQLI2MO0WEAF",
    "version": "20170220"
};

function httpGetAsync(theUrl, callback, infoWindow, placeIndex, marker) {
    $.ajax({
        url: theUrl,
        success: function(data) {
            callback(data, infoWindow, placeIndex, marker);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error(textStatus);
            alert("Connection problem. Please check your connection and reload the page!");
        }
    });
}

function setFavPlaceInfo(placeName, infoWindow, placeIndex, marker) {
    var url = "https://api.foursquare.com/v2/venues/search?limit=1&near=" + mQueryInfo.near + "&query=" + placeName + "&v=" + mQueryInfo.version + "&client_id=" + mQueryInfo.client_id + "&client_secret=" + mQueryInfo.client_secret;
    httpGetAsync(url, setInfoWindowContent, infoWindow, placeIndex, marker);
}

function setInfoWindowContent(placeDetails, infoWindow, placeIndex, marker) {

    var noDataErrMsg = "No data available";

    var websiteUrl;
    placeDetails.response.venues[0].url ? websiteUrl = placeDetails.response.venues[0].url : websiteUrl = noDataErrMsg;

    var completeName;
    placeDetails.response.venues[0].name ? completeName = placeDetails.response.venues[0].name : completeName = noDataErrMsg;

    var address;
    placeDetails.response.venues[0].location.address ? address = placeDetails.response.venues[0].location.address : address = noDataErrMsg;

    var numberCheckins;
    placeDetails.response.venues[0].stats.checkinsCount ? numberCheckins = placeDetails.response.venues[0].stats.checkinsCount : numberCheckins = noDataErrMsg;

    var contentString = '<div class="infoWindow">' + '<img class="img-fluid img-thumbnail" src="' + mFavPlaces[placeIndex].imgSrc + '" style="margin-bottom:1rem;" alt="' + completeName + '" />' + '<h4>' + completeName + '</h4>' + '<b>Checkins: </b>' + numberCheckins + '<br>' + '<b>Website: </b> <a href="' + websiteUrl + '">' + websiteUrl + '</a>' + '<br>' + '<b>Address: </b> ' + address + '</div>';

    infoWindow.setContent(contentString);
    infoWindow.open(mMap, marker);
}

function myFunction() {
    // Declare variables
    var input, filter, ul, li, a, i;
    input = document.getElementById('categoryInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Object representation of a favorite place
var FavPlace = function(data) {

    var self = this;

    this.name = ko.observable(data.name);
    this.imgSrc = ko.observable(data.imgSrc);
}

// search function associated with the search field
var Search = function(value) {
    for (var i in mFavPlaces) {
        var currentFavPlace = mFavPlaces[i];
        if (currentFavPlace.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
            var marker = mMarkers[currentFavPlace.name];
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
        } else {
            var marker = mMarkers[currentFavPlace.name];
            marker.setIcon('img/transparent-marker.png');
        }
    }
}

// View Model
var TokyoViewModel = function() {
    var self = this;

    // All the favorite places
    this.favPlaces = ko.observableArray([]);
    mFavPlaces.forEach(function(place) {
        self.favPlaces.push(new FavPlace(place));
    });

    // All the places selected by the current filter
    this.filteredPlaces = ko.observableArray([]);
    mFavPlaces.forEach(function(place) {
        self.filteredPlaces.push(new FavPlace(place));
    });

    // Open the infoWindow corresponding to the given place
    this.openInfoWindow = function(favPlace) {
        var marker = mMarkers[favPlace.name()];
        google.maps.event.trigger(marker, 'click');
    }

    this.query = ko.observable('');
    this.query.subscribe(Search);
}

// Initialize the map and adds markers with infoWindows
function initMap() {

    var center = { lat: 35.6809814, lng: 139.7538745 };
    mMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: center
    });

    // Get details of favorite places 
    var placeIndex;
    for (placeIndex = 0; placeIndex < mFavPlaces.length; placeIndex++) {
        var marker = new google.maps.Marker({
            position: { lat: mFavPlaces[placeIndex].lat, lng: mFavPlaces[placeIndex].lng },
            map: mMap,
        });

        marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');

        var infowindow = new google.maps.InfoWindow({});

        // Use a closure to add listeners
        google.maps.event.addListener(marker, 'click', (function(marker, placeIndex) {
            return function() {
                // Set infoWindow's content
                setFavPlaceInfo(mFavPlaces[placeIndex].name, infowindow, placeIndex, marker);

                // Set marker animation (lasts for 1 cycle == 750ms)
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() { marker.setAnimation(null); }, 750);

            }
        })(marker, placeIndex));

        // Store the marker
        mMarkers[mFavPlaces[placeIndex].name] = marker;
    }


}

// Activates knockout.js
ko.applyBindings(new TokyoViewModel());
