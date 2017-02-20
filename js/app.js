var mFavPlaceNames = [

	"Akihabara",
	"Asakusa",
	"Harajuku",
	"Shibuya",
	"Ginza",
	"Yodobashi-Akiba",
	"Sensoji"

];

var mQueryInfo = {
    "near": "Tokyo",
    "client_id": "AG5MATDOQ5HAXLODDIV1YALJZA4IN3LS5XEUOPWQIGHG0BHL",
    "client_secret": "PPJYHED0SI5WLWC05LXGD1E3T1JDQI23EWNSTQLI2MO0WEAF",
    "version": "20170220"
};

var mFavPlacesDetails = null;

function getFavPlacesInfo(favPlaceNames) {
    var i;
    for(i = 0; i < mFavPlaceNames.length; i++) {
        var url = "https://api.foursquare.com/v2/venues/search?limit=1&near=" + mQueryInfo.near 
            + "&query=" + mFavPlaceNames[i] 
            + "&v=" + mQueryInfo.version
            + "&client_id=" + mQueryInfo.client_id 
            + "&client_secret=" + mQueryInfo.client_secret;

        $.get(url, function(data, status){
            console.log(data);
        });
    }
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
    var uluru = { lat: 35.6895, lng: 139.6917 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: uluru
    });
    var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
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

    getFavPlacesInfo(mFavPlaceNames);

    // Activates knockout.js
    ko.applyBindings(new TokyoViewModel());

}

run();