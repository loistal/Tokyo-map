var favPlaceNames = [

	"Akihabara",
	"Asakusa",
	"Harajuku",
	"Shibuya",
	"Ginza",
	"Yodobashi-Akiba",
	"Sensoji"

];

// Contains Yelp reviews of all the favorite places
var favPlacesYelp = [


];

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

	self.favPlaces = favPlacesYelp;
}

// Activates knockout.js
ko.applyBindings(new TokyoViewModel());
