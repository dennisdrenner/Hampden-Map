


/* ----------------------- MODEL ----------------------- */

//Constructor function for Location objects (i.e. locations in my neighborhood)

var Location = function (data) {
    var self = this; 
    this.name = data.name;
    this.city = "Baltimore"; 
    this.state = "Maryland";
    this.zipcode = 21211; 
    this.streetNumber = data.streetNumber;
    this.street = data.street;
    this.categories = data.categories;  //categories is an array 
    this.display = ko.observable(true); 
    this.latLng = {};
    this.marker = {};
    this.marker.setMap = '';
    this.summary = data.summary; 
    this.yelpId = data.yelpId;
    this.img_url = '';
    this.snippet_text = '';
    this.rating_img_url = '';
    this.icon = data.icon; // custom icon for Google map
    this.icon_selected = data.icon_selected;


    self.address = function () {
        return self.streetNumber + " " + self.street + " " +
        self.city + ", " + self.state + " " + self.zipcode;
    };

    //Marker animation. Bounce after click 
    self.bounce = function () {
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function () {
        self.marker.setAnimation(null);
      }, 1000);
    };

    self.openInfoWindow = function () {
      var infoDiv = document.getElementById("infoDiv");
      infoDiv.style.display = "block";
      googleMap.setCenter(self.latLng);
      infoDiv.innerHTML = "<p>" + self.name + "</p>"+
                      "<img src="+ '"' + self.img_url + '">' +
                      "<p>" + self.snippet_text + "</p>" + 
                      "<p>Yelp Review: <img src="+ '"' + self.rating_img_url + '"></p>';
      self.marker.setIcon(self.icon_selected);
    };   
};


//Initial location info (manually input)
var locations = [

 {
          name: "Fraziers",
          streetNumber: "1400",
          street: "W. 36th",
          categories: ["bar", "restaurant"],
          summary: "One of the oldest and friendliest neighborhood bars and restaurants",
          yelpId: "fraziers-on-the-avenue-baltimore",
          icon: "img/icons/restaurant.PNG",
          icon_selected:  "img/icons_selected/restaurant.PNG"
         
  },

 {
          name: "Milagros",
          streetNumber: "1005",
          street: "W. 36th",
          categories: ["shop"],
          summary: "Great international gifts",
          yelpId: "milagro-baltimore",
          icon: "img/icons/gifts.PNG",
          icon_selected:  "img/icons_selected/gifts.PNG"
         

  },

   {
          name: "Golden West Cafe",
          streetNumber: "1105",
          street: "W. 36th",
          categories: ["restaurant", "bar"], 
          summary: "Funky cafe run by surly hipsters",
          yelpId: "golden-west-cafe-baltimore-3",
          icon:  "img/icons/restaurant.PNG",
          icon_selected:  "img/icons_selected/restaurant.PNG"
        
  },

   {
          name: "Charm City Headshots",
          streetNumber: "3646",
          street: "Elm Avenue",
          categories: ["photographer"],
          summary: "Headshot photographer",
          yelpId: "charm-city-headshots-baltimore",
          icon:  "img/icons/photo.PNG",
          icon_selected:  "img/icons_selected/photo.PNG"

  },

     {
          name: "NV Salon Collective",
          streetNumber: "861",
          street: "W. 36th St",
          categories: ["salon"],
          summary: "Hair salon",
          yelpId: "nv-salon-collective-baltimore",
          icon: "img/icons/barber.PNG",
          icon_selected:  "img/icons_selected/barber.PNG"

  },

  {
          name: "Old Bank Barbers",
          streetNumber: "1100",
          street: "W. 36th St",
          categories: ["barber"],
          summary: "Barber shop",
          yelpId: "old-bank-barbers-baltimore",
          icon: "img/icons/barber.PNG",
          icon_selected:  "img/icons_selected/barber.PNG"

  },


  {
          name: "The Charmery",
          streetNumber: "801",
          street: "W. 36th Street",
          categories: ["other"],
          summary: "Ice Cream",
          yelpId: "the-charmery-baltimore",
          icon: "img/icons/icecream.PNG",
          icon_selected:  "img/icons_selected/icecream.PNG"

  },

];



/* ------------------------ GOOGLE MAP INITIAL SET UP -----------------------*/

  //Set up data for google map object defined below 
  var mapOptions = {
    center: { lat: 39.328198, lng: -76.634553},  
    zoom: 16,
    mapTypeControl: false,
    };

 var googleMap = new google.maps.Map(document.getElementById('hampdenMap'), mapOptions);

// google.maps.event.addListenerOnce(googleMap,"projection_changed", function() {
//    alert("projection:"+googleMap.getProjection());


/* ----------------------- VIEW MODEL ----------------------- */


function AppViewModel() {

   var self = this; 

    //List of all locations in the locations array in the model
   self.locationObjList = ko.observableArray([]);


     //Utility function to iterate through locationObjList and set all icons to the unselected version
    self.resetMarkerIcons = function () {
      for (var i=0; i<self.locationObjList().length;i++) {
        self.locationObjList()[i].marker.setIcon(self.locationObjList()[i].icon);
      }
    };
    
    //Iterate through locations array (from the Model), creating new location objects and 
    //adding them to the locationObjList observable array
    locations.forEach(function(locationObj) {
        locationObj.resetMarkerIcons = self.resetMarkerIcons;
        self.locationObjList.push(new Location(locationObj));
    }); 

   //Categories of locations 
   self.availableCategories = ko.observableArray(["all", "bar", "restaurant", "shop", "photographer", "salon", "barber", "other"]);
   
   //Categories chosen by user 
   self.chosenCategories = ko.observableArray(["all"]);

   //An array to hold location objects corresponding to chosenCategories
   self.matches = ko.observableArray([]);

    //Iterate through locationObjList and retrieve info from Yelp (if available)
    self.locationObjList().forEach(function(locationObj) {
        getYelpData(locationObj);
    });

    //search field for searching locations 
    self.searchBox =  ko.observable("Search Hampden Map");

    //create a list of location names from the location object list to be used
    //in the autocomplete widget on the searchField
    self.options = self.locationObjList().map(function(locationObj) {
      return { 
        label: locationObj.name,
        value: locationObj.name,
        object: locationObj
      };
    });

    //CUSTOM BINDING FOR AUTOCOMPLETE 

    ko.bindingHandlers.autoComplete = {
    // Only using init event because the 
    // Jquery.UI.AutoComplete widget will take care of the update callbacks
      init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
          // valueAccessor = { selected: mySelectedOptionObservable, options: myArrayOfLabelValuePairs }

          var settings = ko.unwrap(valueAccessor());

          var selectedOption = settings.selected;

          var options = settings.options;

          var updateElementValueWithLabel = function (event, ui) {
              // Stop the default behavior
              event.preventDefault();

              // Update the value of the html element with the label 
              // of the activated option in the list (ui.item)
              $(element).val(ui.item.label);

              // Update our SelectedOption observable
              if(typeof ui.item !== "undefined") {
                  // ui.item - id|label|...
                  self.searchBox(ui.item.label);
              }
          };

          $(element).autocomplete({
              source: options,
              select: function (event, ui) {
                  updateElementValueWithLabel(event, ui);
                  //self.searchBox(ui.item.label);
              },
              focus: function (event, ui) {
                  updateElementValueWithLabel(event, ui);
              },
              change: function (event, ui) {
                  updateElementValueWithLabel(event, ui);
              }
            //Check for enter key (keyCode 13) and submit any text in the searchField
            //This allows us to enter text not suggested by autocomplete 
            }).keydown(function(e){
                  if (e.keyCode === 13) {
                  $("#searchField").trigger('submit');
                  self.searchBox($('#searchField').val());
                  } 
               });
      },
     
    };

    //an array to hold locations which match category and/or searchBox entries
    self.filteredMatches = []; 

    //Clear infoDiv when doing a new search and zoom the map back out and recenter in init position
    self.clearInfoDiv = function () {
      var infoDiv = document.getElementById("infoDiv");
      infoDiv.innerHTML = "";
      infoDiv.style.display = 'none'; 
      self.map.setZoom(15);
      self.map.setCenter(mapOptions.center);

    };

   //The this.showMatches function adds location objects which match chosenCategories and/or the searchBox entry
  //to the self.matches array, and then updates the markers on the map
  //the listview is updated by knockout data-bindings with the 'matches' observable array 

   this.showMatches = ko.computed(function() {
      //First reset previous matches from array 
        self.matches([]);

      //Reset filteredMatches array to empty 
        self.filteredMatches = [];
        
      //Iterate through the locations and find locations which match chosenCategories
      //Nested loops needed as some locations have more than one category 
        var locations = self.locationObjList();
        var choices = self.chosenCategories();
        for (var i=0; i<locations.length;i++) {
          for (var j=0; j<choices.length; j++) {
            for (var k = 0; k<locations[i].categories.length; k++) {
              if (choices[j] == locations[i].categories[k]) {
                self.matches.push(locations[i]);
              }
            } 
          }
        }

        //If user selects "all", add all of the location objects to the array  
        if (self.chosenCategories()[0] == "all") { 
          self.matches(self.locationObjList());
        }

        //Now we will filter the matches array further by selecting only locations which match the 
        //search box entry 
        
        self.mapFilter = function () {
          for (i=0; i<self.locationObjList().length; i++) {
            //remove all markers from map
            //if statement is necessary because marker.setMap does not exist until the mapMaker function (below) runs
            if (self.locationObjList()[i].marker.setMap) {self.locationObjList()[i].marker.setMap(null);} 
          }
          //set markers on map for matched locations
          for (i=0; i<self.matches().length; i++) {
             //if statement is necessary because marker.setMap does not exist until the mapMaker function (below) runs
            if (self.matches()[i].marker.setMap) {self.matches()[i].marker.setMap(self.map);}
          }
        };  //end of mapFilter()

        //If no entry in searchBox, just return category matches and exit out of the function 
        if (self.searchBox() === "" || self.searchBox() == "Search Hampden Map") {
          self.mapFilter(); 
          
        //Else if there is relevant text in the searchBox,  add matching locations to the array filteredMatches 
        } else {
           
            for (i=0; i<self.matches().length;i++) {
                if (self.matches()[i].name.toLowerCase().search(self.searchBox().toLowerCase()) !== -1) {
                  self.filteredMatches.push(self.matches()[i]);
                }
            }
            //update matches array to only contain locations which match the category search and 
            //the text in the search box
            self.matches(self.filteredMatches);
            self.mapFilter(); 
        }
    });  //End of this.showMatches function 
  



    //Define a new google map object 
    self.map = googleMap; 

    //Add an event listener to resize map when user changes browser window size
    google.maps.event.addDomListener(window, "resize", function() {
     var center = self.map.getCenter();
     google.maps.event.trigger(self.map, "resize");
     self.map.setCenter(center); 
    });
    

    //Iterate through locationObjList (array of all location objects), pull out the addresses and use these
    //to calculate latLng info from Google, create a new map marker, and add latLng and marker as properties
    //to the location object 

    function mapMaker() {
      var infoDiv = document.getElementById("infoDiv");

      for (var x = 0; x < self.locationObjList().length; x++) {
  
        //By calling $.getJSON this way (function(x) { ...} (x)  we lock the current value of x into a closure
        (function (x) {
          $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+self.locationObjList()[x].address()+
                '&sensor=false', null, function (data) {
                  var p = data.results[0].geometry.location;
                  var latLng = new google.maps.LatLng(p.lat, p.lng);
                  var marker = 
                    new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        icon: self.locationObjList()[x].icon,
                        //icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        position: latLng,
                        map: self.map, 
                  });

                  //Event listener on marker injects info on the location into the infoDiv
                  //Also sets selected marker to green after changing all markers to red 
                  //(to remove old green markers from previously selected locations)

                  marker.addListener('click', function() {
                    self.map.setCenter(self.locationObjList()[x].latLng); 
                    self.map.setZoom(17);
                    infoDiv.style.display = "block";
                    infoDiv.innerHTML = "<p>" + self.locationObjList()[x].name + "</p>"+
                      "<img src="+ '"' + self.locationObjList()[x].img_url + '">' +
                      "<p>" + self.locationObjList()[x].snippet_text + "</p>" + 
                      "<p>Yelp Review: <img src="+ '"' + self.locationObjList()[x].rating_img_url + '"></p>';

                    //Change all icons to unselected version
                    self.resetMarkerIcons(); 
                
                    //Change marker to selected version
                    marker.setIcon(self.locationObjList()[x].icon_selected);

                    //toggle slide-active class on the slidemenu when clicking on the marker
                    //this will slide the slide menu back into the frame if it wasn't already activated
                    $('#slidemenu').stop().animate({left: '0px'});
                    $('#navbar-height-col').stop().animate({left: '0px'});
                    $('#slidemenu, body, #page-content, .navbar-toggle').toggleClass('slide-active', true); 

                    //Marker will bounce for 1 second when clicked             
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    window.setTimeout(function () {
                      marker.setAnimation(null);
                    }, 1000);   

                  });  //end of marker.addListener
                 
                  //attach latLng and marker to location objects as properties
                  self.locationObjList()[x].latLng = latLng;
                  self.locationObjList()[x].marker = marker;
                })

        //Notify of failure in mapMaker (jQuery default is to fail silently)
            .fail(function() {
            alert("FAILURE IN MAPMAKER FUNCTION");
          });

          }(x));
      }
    }  //end of mapMaker function 
 mapMaker();
}

//TO DO: Get this to work, center marker depending on map canvas, keep marker from being hidden by infoDiv  
//Calculate Pixel location from LatLng on Google map (to aid in centering)

// var fromLatLngToPixel = function (position) {
//   var scale = Math.pow(2, googleMap.getZoom());
//   var proj = googleMap.getProjection();
//   console.log("PROJ--", proj);
//   console.log("GOOGLE MAP", googleMap);
//   var bounds = googleMap.getBounds();

//   var nw = proj.fromLatLngToPoint(
//     new google.maps.LatLng(
//       bounds.getNorthEast().lat(),
//       bounds.getSouthWest().lng()
//     ));
//   var point = proj.fromLatLngToPoint(position);

//   return new google.maps.Point(
//     Math.floor((point.x - nw.x) * scale),
//     Math.floor((point.y - nw.y) * scale));
// }

// console.log("POSITION-", fromLatLngToPixel((mapOptions.center)));


ko.applyBindings(new AppViewModel());


/* ----------------------- OAuth Signature Generation for Yelp ----------------------- */
          

 //Generates a random number and returns it as a string for OAuthentication

function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

//Access YELP API for all locations on the map which have a Yelpid. Parse the results and add img_url, 
//snippet_text and rating_img_url to the locationObj as attributes. 

function getYelpData (locationObj) {

//TO DO: HIDE THIS INFO
  var YELP_KEY = 'a0d6iLsmo3UQwIFD3vQy4g'; 
  var YELP_TOKEN = 'Af0MT-f7yuN1H1SHnecbpbZtYb9nOaIB';
  var YELP_KEY_SECRET = '8-2woIQShndzD2NkVim2ji_VXck';
  var YELP_TOKEN_SECRET = 'yXv1Uc7SeI4eAEw4xUqaq_ncDI0';

//If no Yelp ID exists, exit out of the function. Yelp ID is manually input, not all locations have a presence on Yelp
   if (locationObj.yelpId === "") { 
    return;
   }

//Construct URL for Yelp API call.  OAuth library will add signature to this later
  var yelp_url = 'https://api.yelp.com/v2/business/' + locationObj.yelpId;

  var parameters = {
    oauth_consumer_key: YELP_KEY,
    oauth_token: YELP_TOKEN,
    oauth_nonce: nonce_generate(),
    oauth_timestamp: Math.floor(Date.now()/1000),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version : '1.0',
    callback: 'cb'    // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
  };

//Use oauth-signature.js library to create encoded signature. 
  var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
  parameters.oauth_signature = encodedSignature;

  var settings = {
    url: yelp_url,
    data: parameters,
    cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
    dataType: 'jsonp',
    success: function(results) {  //Results is the object passed back by Yelp after the API call. Log it to see
      //other useful info you can use in your map. 
      //console.log(results);   
      locationObj.img_url = results.image_url; 
      locationObj.snippet_text = results.snippet_text;
      locationObj.rating_img_url = results.rating_img_url; 
    },
    error: function(response) {
      alert("THERE WAS AN ERROR in GET YELP DATA: ", response);
    }

    
  };

  // Send AJAX query via jQuery library.
  $.ajax(settings);

}  //End of getYelpData Function 
