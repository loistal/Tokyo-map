var mFavPlaces = [

    {
        name: "Takeshita Street",
        lat: 35.6715659,
        lng: 139.7031469,
        imgSrc: "img/favPlaces/takeshita.jpg"
    }, {
        name: "Nakamise Street",
        lat: 35.7113873,
        lng: 139.794207,
        imgSrc: "img/favPlaces/asakusa.jpg"
    }, {
        name: "Yodobashi-Akiba",
        lat: 35.6995227,
        lng: 139.7734171,
        imgSrc: "img/favPlaces/akihabara.jpg"
    }, {
        name: "Meiji Jingu",
        lat: 35.6763976,
        lng: 139.6993259,
        imgSrc: "img/favPlaces/meiji.jpg"
    }, {
        name: "Shibuya Crossing",
        lat: 35.6594087,
        lng: 139.6981677,
        imgSrc: "img/favPlaces/shibuya.jpg"
    }

];

var mQueryInfo = {
    "near": "Tokyo",
    "client_id": "AG5MATDOQ5HAXLODDIV1YALJZA4IN3LS5XEUOPWQIGHG0BHL",
    "client_secret": "PPJYHED0SI5WLWC05LXGD1E3T1JDQI23EWNSTQLI2MO0WEAF",
    "version": "20170220"
};

function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
}

function httpGetAsync(theUrl, callback, infoWindow, placeIndex, marker) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText, infoWindow, placeIndex, marker);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function setFavPlaceInfo(placeName, infoWindow, placeIndex, marker) {
    var url = "https://api.foursquare.com/v2/venues/search?limit=1&near=" + mQueryInfo.near + "&query=" + placeName + "&v=" + mQueryInfo.version + "&client_id=" + mQueryInfo.client_id + "&client_secret=" + mQueryInfo.client_secret;
    httpGetAsync(url, setInfoWindowContent, infoWindow, placeIndex, marker);
}

function setInfoWindowContent(placeDetailsText, infoWindow, placeIndex, marker) {

    var placeDetails = JSON.parse(placeDetailsText);

    // Extract info to display in infoWindows
    var completeName = placeDetails.response.venues[0].name;
    var address = placeDetails.response.venues[0].location.address;
    var websiteUrl = placeDetails.response.venues[0].url;
    var numberCheckins = placeDetails.response.venues[0].stats.checkinsCount;

    var contentString = '<div class="infoWindow">' + '<img class="img-fluid img-thumbnail" src="' + mFavPlaces[placeIndex].imgSrc + '" style="margin-bottom:1rem;" alt="' + completeName + '" />' + '<h4>' + completeName + '</h4>' + '<b>Checkins: </b>' + numberCheckins + '<br>' + '<b>Website: </b> <a href="' + websiteUrl + '">' + websiteUrl + '</a>' + '<br>' + '<b>Address: </b> ' + address + '</div>';

    infoWindow.setContent(contentString);
    infoWindow.open(mMap, marker);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("map").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
}

// Object representation of a favorite place
var FavPlace = function(data) {
    this.name = data.name;
    this.imgSrc = data.imgSrc;
}

// View Model
var TokyoViewModel = function() {
    var self = this;

    // All the favorite places
    this.favPlaces = ko.observableArray([]);
    mFavPlaces.forEach(function(place) {
        self.favPlaces.push(new FavPlace(place));
    });

    // Place currently selected in the sidebar
    this.currentSidebarPlace = ko.observable(this.favPlaces()[0]);

    this.changeSidebarPlace = function(place) {
        self.currentSidebarPlace(place);
    };

}

// Initialize the map and adds markers with infoWindows
function initMap() {

    var center = { lat: 35.6809814, lng: 139.7538745 };
    mMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: center
    });

    // Get details of favorite places 
    var placeIndex;
    for (placeIndex = 0; placeIndex < mFavPlaces.length; placeIndex++) {
        var marker = new google.maps.Marker({
            position: { lat: mFavPlaces[placeIndex].lat, lng: mFavPlaces[placeIndex].lng },
            map: mMap,
        });
        var infowindow = new google.maps.InfoWindow({});

        // Use a closure to add listeners
        google.maps.event.addListener(marker, 'click', (function(marker, placeIndex) {
            return function() {
                // Set infoWindow's content
                setFavPlaceInfo(mFavPlaces[placeIndex].name, infowindow, placeIndex, marker);

            }
        })(marker, placeIndex));
    }



}

// Activates knockout.js
ko.applyBindings(new TokyoViewModel());
