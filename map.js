// Created by Christopher. 
// Certain functions have been USED DIRECTLY from Samples on Google Maps JavaScript API

//  Shows map of particular place (Default)
var map = new google.maps.Map(document.getElementById("map"), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 5});
var markArray = new Array;

// Calls the function which prints the top 10 Earthquake in USA
topEarthquakes();
// Pull mapinput element for Autocomplete search box
var input =document.getElementById('mapinput');

// You can set control options to change the default position or style of many
// of the map controls.
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

var infowindow = new google.maps.InfoWindow();

// Autocomplete 
var autocomplete = new google.maps.places.Autocomplete(input);
autocomplete.bindTo('bounds',map);

// Event Listener which executes when user select from the drop down list
autocomplete.addListener('place_changed', function(){
    var place = autocomplete.getPlace();
    if (!place.geometry) {
        window.alert("Autocomplete's returned place contains no geometry");
        return;
    }
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
        map.setZoom(7);
    }
    // Removing Marker for the new search
    deleteMarker();
  
    //Setting the bounds
    var data = {
      	'north': map.getBounds().getNorthEast().lat(),
        'south': map.getBounds().getSouthWest().lat(),
        'east': map.getBounds().getNorthEast().lng(),
        'west': map.getBounds().getSouthWest().lng(),
        };
        console.log(data);
        var url= "http://api.geonames.org/earthquakesJSON?"+"&username=chris64";
        $.ajax({
            url:url,
            type:'GET',
            dataType:'json',
            data:data
        })
        .done(function(result){                
            //passing result into contentString function
            var location = result['earthquakes'];
            for (var i =0; i<location.length;i++){
                setMarker(location[i]);
                //contentString(location[i]);
                console.log(location[i]);
            }            
        })
        .fail(function(){
            console.log('error');
        });
});

//  Setting the marker
var setMarker = function(info){
    var location = {'lat':info.lat,'lng':info.lng};
    // Adding a Marker
    var marker =new google.maps.Marker({
        position:location,
        map:map,
    });
    markArray.push(marker);
    
    //  The <div id=content> element below specifies what is displayed when the Marker is Clicked
    var content ='<div id = "content">DateTime : ' + info.datetime +'<br>Depth : ' + info.depth+'<br>Magnitute : ' + info.magnitude + '</div>';
    marker.addListener('click',function(){
        infowindow.setContent(content);
        infowindow.open(map,marker);
    });
};

// Sets the map on all markers in the array.
var setMapOnAll = function(map){
    for(var i=0; i<markArray.length; i++){
        markArray[i].setMap(map);
    }
};

// Deletes all markers in the array by removing references to them.
var deleteMarker = function(){
    setMapOnAll(null);
    markArray=[];
};

// Top Earthquakes in USA
function topEarthquakes(){
    // Parameters to be send to api.geonames.org
    
    // NOTE : COULD NOT set search for only last year since there was no option for that in api's
    var data = {
        'east':-62.5,
    	'west':-125.4,
    	'north':52.1,
    	'south':24.7,
        'minMagnitude':6.0,
        'maxRows':10,
    };
    var url= "http://api.geonames.org/earthquakesJSON?"+"&username=chris64";
    //console.log(url);
    $.ajax({
        url:url,
        type:'GET',
        dataType:'json',
        data:data
    })
    .done(function(result){
        console.log(result['earthquakes']);
        var location = result['earthquakes'];
        for (var i =0; i<location.length;i++){
            $('.list').append('<div><em>DateTime : </em>'+ location[i].datetime + '<br><em>Depth : </em>'+ location[i].depth+'<br><em>Magnitude : </em>'+location[i].magnitude+'</div>');
            }
    })
    .fail(function(){
            console.log('error');
    });
}




