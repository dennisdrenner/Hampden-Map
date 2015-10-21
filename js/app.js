


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

    self.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + ", " + self.state + " " + self.zipcode;
    };

    //Marker animation. Bounce after click 
    self.bounce = function () {
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function () {
        self.marker.setAnimation(null);
      }, 1000);
    }   
};

//Initial location info (manually input)

var locations = [

 {
          name: "Fraziers",
          streetNumber: "1400",
          street: "W. 36th",
          categories: ["bar", "restaurant"],
          summary: "One of the oldest and friendliest neighborhood bars and restaurants",
          yelpId: "fraziers-on-the-avenue-baltimore"
         
  },

 {
          name: "Milagros",
          streetNumber: "1005",
          street: "W. 36th",
          categories: ["shop", "restaurant"],
          summary: "Great international gifts",
          yelpId: "milagro-baltimore"
         

  },

   {
          name: "Milagros Neighbor",
          streetNumber: "1009",
          street: "W. 36th",
          categories: ["shop"], 
          summary: "Wierd neighbor. Smells of cats",
          yelpId: ""
        
  },

   {
          name: "Charm City Headshots",
          streetNumber: "3646",
          street: "Elm Avenue",
          categories: ["photographer"],
          summary: "Headshot photographer",
          yelpId: "charm-city-headshots-baltimore"

  },

  {
          name: "Old Bank Barbers",
          streetNumber: "1100",
          street: "W. 36th St",
          categories: ["barber"],
          summary: "Barber shop",
          yelpId: "old-bank-barbers-baltimore"

  },


  {
          name: "The Charmery",
          streetNumber: "801",
          street: "W. 36th Street",
          categories: ["other"],
          summary: "Ice Cream",
          yelpId: "the-charmery-baltimore"

  },

]



/* ----------------------- VIEW MODEL ----------------------- */

function AppViewModel() {

   var self = this; 

    //List of all locations in the model
   self.locationObjList = ko.observableArray([]);

    //Iterate through locations array (from the Model), creating new location objects and 
    //adding them to the locationObjList observable array
    locations.forEach(function(locationObj) {
        self.locationObjList.push(new Location(locationObj));
    }); 

   //Categories of locations 
   self.availableCategories = ko.observableArray(["all", "bar", "restaurant", "shop", "photographer", "other"]);
   
   //Categories chosen by user 
   self.chosenCategories = ko.observableArray(["all"]);

   //An array to hold location objects corresponding to chosenCategories
   self.matches = ko.observableArray([]);


    //Iterate through locationObjList and retrieve info from Yelp (if available)
    self.locationObjList().forEach(function(locationObj) {
        getYelpData(locationObj);
    });

    this.searchBox =  ko.observable("Search Hampden Map");
    self.filteredMatches = []; 

   //This function adds location objects which match chosenCategories to the self.matches array 
   this.showMatches = ko.computed(function() {
      //First reset previous matches from array 
        self.matches([]);

      //Reset filteredMatches array to empty 
        self.filteredMatches = [];
       

      //Iterate through the locations and find locations which match chosenCategories
      //Nested loops needed as some locations have more than one category 
        var locations = self.locationObjList();
        var choices = self.chosenCategories();
        for (i=0; i<locations.length;i++) {
          for (j=0; j<choices.length; j++) {
            for (k = 0; k<locations[i].categories.length; k++) {
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


        //If no entry in searchBox, just return category matches and exit out of the function 
        //console.log("SEARCHBOX", self.searchBox());
        if (self.searchBox() == "" | self.searchBox() == "Search Hampden Map") {
          return;

        //Else if there is relevant text in the searchBox,  add matching locations to the array filteredMatches 
        } else {

            for (i=0; i<self.matches().length;i++) {
                if (self.matches()[i].name.search(self.searchBox()) !== -1) {
                  self.filteredMatches.push(self.matches()[i]);
                  //console.log("FILT MATCHES--", self.filteredMatches);
                  //marker.setMap does not exist when map is first initialized, so we run this check to 
                  //avoid errors, and then add the marker for the search matched location to the map 
              //    if (self.matches()[i].marker.setMap) { self.matches()[i].marker.setMap(map); }
                

            //else if the location does not match, set display = false and remove marker from the map
            //} 

            // else { 
            //   self.matches()[i].display(false);
            //   if (self.matches()[i].marker.setMap) { self.matches()[i].marker.setMap(null); }
            // } 
                }
            }
            //update matches array to only contain locations which match the category search and 
            //the text in the search box
            self.matches(self.filteredMatches);
            console.log('matches-', self.matches());
        }

    });  //End of this.showMatches function 


   
    //Find locations which are a match for input search text 
   // self.filterLocations = function (categoryMatches) {

   // });
      

    //Set up data for google map object defined below 
    var mapOptions = {
      center: { lat: 39.332769, lng: -76.635661},
      zoom: 16
      };

    //Define a new google map object 
    var map = new google.maps.Map(document.getElementById('hampdenMap'), mapOptions);
    

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
                        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        position: latLng,
                        map: map, 
                  });

                  //Event listener on marker injects info on the location into the infoDiv
                  //Also sets selected marker to green after changing all markers to red 
                  //(to remove old green markers from previously selected locations)

                  marker.addListener('click', function() {
                    infoDiv.innerHTML = "<p>" + self.locationObjList()[x].name + "</p>"+
                      "<img src="+ '"' + self.locationObjList()[x].img_url + '">' +
                      "<p>" + self.locationObjList()[x].snippet_text + "</p>" + 
                      "<p>Yelp Review: <img src="+ '"' + self.locationObjList()[x].rating_img_url + '"></p>';

                    //Change all icons to red 
                    for (i=0; i<self.locationObjList().length; i++) {
                      self.locationObjList()[i].marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
                    }

                    //Change color of selected marker to green 
                    marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');  
                    
                    //Marker will bounce for 1 seconds when clicked             
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    window.setTimeout(function () {
                      marker.setAnimation(null);
                    }, 1000);                  
                  });
                 
                  //attach latLng and marker to location objects as properties
                  self.locationObjList()[x].latLng = latLng;
                  self.locationObjList()[x].marker = marker;
                });
          }(x));
      };
    }
    
    mapMaker();

    };


// Activates knockout.js
ko.applyBindings(new AppViewModel());

/// ...


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
   if (locationObj.yelpId == "") { 
    return;
   };

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
      console.log("THERE WAS AN ERROR!", response);
    }

    
  };

  // Send AJAX query via jQuery library.
  $.ajax(settings);

}  //End of getYelpData Function 



   //Interate through locationObjList and calculate URL
    // for searching Flickr API for photos of location (returns info for one image as JSON)
    //Attach this URL to the location object.
//     self.locationObjList().forEach(function (locationObj) {
//         var flickrURL = 
//         "https://api.flickr.com/services/rest/?method=flickr.photos.search" + 
//         "&api_key=757b8b4527c93ac33eb36984d673ce93" +
//         "&tags=" + locationObj.name + 
//         "&safe_search=1&content_type=1&per_page=1&format=json&nojsoncallback=1";
//         //console.log("FURL--", flickrURL);


//         //Get pictureURL from Flickr and attach to location object 
//         $.getJSON(flickrURL, function(data) {
//           console.log(data);
//           // locationObj.photoURL = "https://farm" + data['photos']['photo'][0].farm + 
//           // ".staticflickr.com/" + data['photos']['photo'][0].server + "/" + data['photos']['photo'][0].id +
//           // "_" + data['photos']['photo'][0].secret + ".jpg";
//           //console.log('helloooo', flickrURL, locationObj, locationObj.photoURL);
//         })
//         .fail(function( jqxhr, textStatus, error ) {
//     var err = textStatus + ", " + error;
//     console.log( "Request Failed: " + err );
// })

//         // .fail(function() {
//         //   console.log("ERROR!!");
//         // })
//         .always(function() {
//           console.log("Request completed");
//         });

        // var response = $.ajax(flickrURL);

        // for (i = 0; i < response.length; i++) {
        //   console.log(response[i])
        // };

        // console.log(response);
        // console.log($.ajax(flickrURL));
        // console.log($.ajax(flickrURL));

        //console.log(locationObj, locationObj.photoURL);


        // var photoURL = "https://farm" + data['photos']['photo'][0].farm + 
        // ".staticflickr.com/" + data['photos']['photo'][0].server + "/" + "data['photos']['photo'][0].id" +
    //     // "_" + data['photos']['photo'][0].secret + ".jpg";


    // });

       // $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+self.locationObjList()[x].address()+
       //          '&sensor=false', null, function (data) {
       //            var p = data.results[0].geometry.location;
       //            var latLng = new google.maps.LatLng(p.lat, p.lng);
       //            var marker = 
       //              new google.maps.Marker({
       //                  animation: google.maps.Animation.DROP,
       //                  position: latLng,
       //                  map: map, 
       //            });


    // //return a URL which will search the Flickr api for a photo matching self.placeName
    // self.flickrURL = function () {
      // var URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search" + 
      // "&api_key=757b8b4527c93ac33eb36984d673ce93" +
      // "&tags=" + self.placeName + "%2Cbaltimore" +
      // "&safe_search=1&content_type=1&per_page=1&format=json&nojsoncallback=1" 
      //"&auth_token=72157659226565246-57e3dceb871c1352" +
      //"&api_sig=0e6fe25b75dd75a44b023abf07728298";
    //   //console.log("PLACE name -- " , self.placeName);
    //   return URL; 
    // };

    //List of addresses only for use in the calculating Google map markers 
    //self.addressList = ko.observableArray([]);

    //Iterate through locationList, adding addresses to address list 
    // self.locationObjList().forEach(function(locationObj) {
    //     self.addressList.push(locationObj.address());
    // });    

