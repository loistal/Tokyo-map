var mMap;

var mFavPlaceNames = [

	{
        name: "Takeshita Dori",
        lat: 35.6715659,
        lng: 139.7031469
    },
    {
        name: "Asakusa Nakamise Street",
        lat: 35.7113873,
        lng: 139.794207
    },
    {
        name: "Yodobashi Multimedia Akiba",
        lat: 35.6995227,
        lng: 139.7734171
    },
    {
        name: "Meiji Jingu",
        lat: 35.6763976,
        lng: 139.6993259
    },
    {
        name: "Shibuya Crossing",
        lat: 35.6594087,
        lng: 139.6981677
    }

];

var mQueryInfo = {
    "near": "Tokyo",
    "client_id": "AG5MATDOQ5HAXLODDIV1YALJZA4IN3LS5XEUOPWQIGHG0BHL",
    "client_secret": "PPJYHED0SI5WLWC05LXGD1E3T1JDQI23EWNSTQLI2MO0WEAF",
    "version": "20170220"
};

function httpGet(url)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false ); 
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function getFavPlaceInfo(placeName) {
    
        var url = "https://api.foursquare.com/v2/venues/search?limit=1&near=" + mQueryInfo.near 
            + "&query=" + placeName 
            + "&v=" + mQueryInfo.version
            + "&client_id=" + mQueryInfo.client_id 
            + "&client_secret=" + mQueryInfo.client_secret;

    return httpGet(url);
}


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("map").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("map").style.marginLeft = "0";
}

function initMap() {

    var center = { lat: 35.6809814, lng: 139.7538745 };
    mMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: center
    });

    run();
}

//***********************
//*    VIEW MODEL       *
//***********************
// defines the data and behavior of the UI
function TokyoViewModel() {
	var self = this;

    // Editable data
    self.favPlaces = ko.observableArray([
        new Place("Steve", self.availableMeals[0]),
        new Place("Bert", self.availableMeals[0])
    ]);
}

function run() {

    // Get details of favorite places 
    var placeIndex;
    for(placeIndex = 0; placeIndex < mFavPlaceNames.length; placeIndex++) {
        var currentPlace = mFavPlaceNames[placeIndex];
        // Get fields to display in infoWindow
        var placeName = currentPlace.name;

        var contentString = placeName;

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var marker = new google.maps.Marker({
          position: { lat: currentPlace.lat, lng: currentPlace.lng},
          map: mMap,
          title: "Example"
        });

        // Use a closure to add listeners
        google.maps.event.addListener(marker, 'click', (function(marker, placeIndex) {
            return function() {
                infowindow.setContent(mFavPlaceNames[placeIndex].name);
                infowindow.open(map, marker);
            }
        })(marker, placeIndex));
    }

    // Activates knockout.js
   // ko.applyBindings(new TokyoViewModel());

}
