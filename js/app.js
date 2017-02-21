var mMap;

var mFavPlaceNames = [

	"Akihabara",
	"Asakusa",
	"Harajuku",
	"Shibuya",
	"Ginza",
	"Yodobashi-Akiba",
	"Senso-ji Temple"

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

function getFavPlacesInfo(favPlaceNames) {
    var favPlacesDetails = [];

    var i;
    for(i = 0; i < mFavPlaceNames.length; i++) {
        var url = "https://api.foursquare.com/v2/venues/search?limit=1&near=" + mQueryInfo.near 
            + "&query=" + mFavPlaceNames[i] 
            + "&v=" + mQueryInfo.version
            + "&client_id=" + mQueryInfo.client_id 
            + "&client_secret=" + mQueryInfo.client_secret;

            favPlacesDetails.push(httpGet(url));
    }

    return favPlacesDetails;
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
    var favPlacesDetails = getFavPlacesInfo(mFavPlaceNames);
    var placeIndex;
    for(placeIndex = 0; placeIndex < mFavPlaceNames.length; placeIndex++) {
        
        var contentString = 'Hello';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });

        var currentPlace = favPlacesDetails[placeIndex];
        console.log(currentPlace);
        var currentLoc = currentPlace.response.venues[0].location;
        var marker = new google.maps.Marker({
          position: { lat: currentLoc.lat, lng: currentLoc.lng},
          map: mMap,
          title: "Example"
        });
        marker.addListener('click', function() {
          infowindow.open(mMap, marker);
        });
    }

    // Activates knockout.js
   // ko.applyBindings(new TokyoViewModel());

}
