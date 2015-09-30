


/* ----------------------- MODEL ----------------------- */

//Constructor function for Location objects (i.e. locations in Hampden)

var Location = function (data) {

    var self = this; 

    this.name = data.name;
    //this.imgSrc = ko.observable(data.imgSrc);
    this.city = "Baltimore"; 
    this.state = "Maryland";
    this.zipcode = 21211; 
    this.streetNumber = data.streetNumber;
    this.street = data.street;
    this.categories = data.categories;  //categories is an array 
    this.display = ko.observable(true); 
    //this.placeName = '';
    this.latLng = {};
    this.marker = {};
    this.marker.setMap = '';
    this.summary = data.summary; 

    self.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + ", " + self.state + " " + self.zipcode;
    };

    self.bounce = function () {
      //console.log('bouncing');
      self.marker.setAnimation(google.maps.Animation.BOUNCE);
      window.setTimeout(function () {
        self.marker.setAnimation(null);
      }, 2000);
    }

    // //return a URL which will search the Flickr api for a photo matching self.placeName
    // self.flickrURL = function () {
    //   var URL = "https://api.flickr.com/services/rest/?method=flickr.photos.search" + 
    //   "&api_key=757b8b4527c93ac33eb36984d673ce93" +
    //   "&tags=" + self.placeName + "%2Cbaltimore" +
    //   "&safe_search=1&content_type=1&per_page=1&format=json&nojsoncallback=1" 
    //   //"&auth_token=72157659226565246-57e3dceb871c1352" +
    //   //"&api_sig=0e6fe25b75dd75a44b023abf07728298";
    //   //console.log("PLACE name -- " , self.placeName);
    //   return URL; 
    // };

            // marker.setAnimation(google.maps.Animation.BOUNCE);
            //         window.setTimeout(function () {
            //           marker.setAnimation(null);
            //         }, 2000);

   
};

//Initial location info to be manually input 

var locations = [

 {
          name: "Fraziers",
          streetNumber: "1400",
          street: "W. 36th",
          categories: ["bar", "restaurant"],
          summary: "One of the oldest and friendliest neighborhood bars and restaurants"
         

  },

 {
          name: "Milagros",
          streetNumber: "1005",
          street: "W. 36th",
          categories: ["shop"],
          summary: "Great international gifts"
         

  },

   {
          name: "Milagros Neighbor",
          streetNumber: "1009",
          street: "W. 36th",
          categories: ["shop"], 
          summary: "Wierd neighbor. Smells of cats"
        
  },

   {
          name: "Charm City Headshots",
          streetNumber: "3646",
          street: "Elm Avenue",
          categories: ["photographer"],
          summary: "Headshot photographer."

  },

  {
          name: "Random House",
          streetNumber: "3600",
          street: "Falls Road",
          categories: ["home"],
          summary: "Potential meth lab"

  },
]



/* ----------------------- VIEW MODEL ----------------------- */

function AppViewModel() {

    var self = this; 

    this.searchBox =  ko.observable("Enter search text");

    //List of all locations in the model
    self.locationObjList = ko.observableArray([]);

    //Iterate through locations array, creating new location objects and 
    //adding them to the locationObjList observable array
    locations.forEach(function(locationObj) {
        self.locationObjList.push(new Location(locationObj));
    });    


    //Interate through locationObjList and calculate URL
    // for searching Flickr API for photos of location (returns info for one image as JSON)
    //Attach this URL to the location object.
    self.locationObjList().forEach(function (locationObj) {
        var flickrURL = 
        "https://api.flickr.com/services/rest/?method=flickr.photos.search" + 
        "&api_key=757b8b4527c93ac33eb36984d673ce93" +
        "&tags=" + locationObj.name + 
        "&safe_search=1&content_type=1&per_page=1&format=json&nojsoncallback=1";


        //Get pictureURL from Flickr and attach to location object 
        $.getJSON(flickrURL, function(data) {
          locationObj.photoURL = "https://farm" + data['photos']['photo'][0].farm + 
          ".staticflickr.com/" + data['photos']['photo'][0].server + "/" + data['photos']['photo'][0].id +
          "_" + data['photos']['photo'][0].secret + ".jpg";
          console.log(flickrURL, locationObj, locationObj.photoURL);
        });

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
        // "_" + data['photos']['photo'][0].secret + ".jpg";


    });

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


    //Find locations which are a match for input search text 
    self.displayLocation = ko.computed(function() {
      for (i=0; i<self.locationObjList().length;i++){
        //console.log(self.locationObjList()[i].flickrURL());

        //if searchBox text is a match for part of the name, set display == true on location object
        if (self.locationObjList()[i].name.search(self.searchBox()) !== -1) {
          self.locationObjList()[i].display(true); 
          //marker.setMap does not exist when map is first initialized, so we run this check to 
          //avoid errors, 
           if (self.locationObjList()[i].marker.setMap) { self.locationObjList()[i].marker.setMap(map); }

        }
        //else set display = false and remove marker from the map 
        else { 
          self.locationObjList()[i].display(false);
            if (self.locationObjList()[i].marker.setMap) { self.locationObjList()[i].marker.setMap(null); }
        } 
      }
    });
      

    //set up data for google map object defined below 
    var mapOptions = {
      center: { lat: 39.332769, lng: -76.635661},
      zoom: 16
      };

    //define new google map object 
    var map = new google.maps.Map(document.getElementById('hampdenMap'), mapOptions);


  
    // //helper function for mapMaker function. create closure for setLatLng function
    // function setLatLngFactory (locationObj, latLng, marker, x) {
    //   return function () {
    //       setLatLng(locationObj, latLng, marker);
    //   };
    // }
    
    //Iterate through locationObjList (array of all location objects), pull out the addresses and use these
    //to calculate latLng info from Google, create a new map marker, and add latLng and marker as properties
    // to the location object 

    function mapMaker() {

      // //helper function for mapMaker function to set latLng and marker on location object
      // function setLatLng (locationObj, latLng, marker) {
      //     //console.log(locationObj, latLng, marker, x);
      //     locationObj.latLng = latLng; 
      //     locationObj.marker = marker; 
      // }

      //var markerList = [];

      // function closeWindows () {
      //   markerList.forEach(function (marker) {
      //     marker.infowindow.close();
      //   });
      // }

      // var globalWindow = new google.maps.InfoWindow({
      //               content: "GLOBAL INFO WINDOW",
      //               maxWidth: 250,
      //             });

      var infoDiv = document.getElementById("infoDiv");

      for (var x = 0; x < self.locationObjList().length; x++) {

        (function (x) {
          $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+self.locationObjList()[x].address()+
                '&sensor=false', null, function (data) {
                  var p = data.results[0].geometry.location;
                  var latLng = new google.maps.LatLng(p.lat, p.lng);
                  var marker = 
                    new google.maps.Marker({
                        animation: google.maps.Animation.DROP,
                        position: latLng,
                        map: map, 
                  });

                  // var infoWindow = new google.maps.InfoWindow({
                  //   content: "<div id='infoWindow2'><p>" + self.locationObjList()[x].summary + "</p></div>",
                  //   maxWidth: 250,
                  // });




                  marker.addListener('click', function() {
                    //closeWindows(); 
                    //globalWindow.content = self.locationObjList()[x].summary
                    //globalWindow.open(map, marker);


                    infoDiv.innerHTML = "<p> SUMMARY: " + self.locationObjList()[x].summary + "</p";
                   // console.log(self.locationObjList()[x].summary);
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                    window.setTimeout(function () {
                      marker.setAnimation(null);
                    }, 2000);
                 
                  
                  });

                  //markerList.push(marker);
                 
                  //attach latLng and marker to location objects as properties
                  self.locationObjList()[x].latLng = latLng;
                  self.locationObjList()[x].marker = marker;
                });
          }(x));
      };
    }


    // TO DO: Use forEach instead of loop to implement mapMaker function 

    // self.locationObjList().forEach(function (x) {
    //       $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+self.locationObjList()[x].address()+
    //             '&sensor=false', null, function (data) {
    //               var p = data.results[0].geometry.location;
    //               var latLng = new google.maps.LatLng(p.lat, p.lng);
    //                 var marker = 
    //                   new google.maps.Marker({
    //                       animation: google.maps.Animation.DROP,
    //                       position: latLng,
    //                       map: map, 
    //                 });
                
    //               //console.log(x);
    //               //setLatLng(self.locationObjList()[x],latLng, marker, x);
    //               //setLatLngFactory(self.locationObjList()[x],latLng, marker, x);

    //               //attach latLng and marker to location objects as properties
    //               self.locationObjList()[x].latLng = latLng;
    //               self.locationObjList()[x].marker = marker;
    //         });
    //   });

    


    
    mapMaker();
    //console.log(self.locationObjList());
    
    };

   




// Activates knockout.js
ko.applyBindings(new AppViewModel());

/// ...


/* ----------------------- GOOGLE MAP MAKER ----------------------- */
          


// var addresses = ['3646 Elm Ave, Baltimore, MD', '3400 Falls Road, Baltimore, MD',
//    '1005 W. 36th Street, Baltimore, MD'];







// mapMaker(); 
      // $(document).ready(function() {
      //       mapMaker();
      //   })
     
     


