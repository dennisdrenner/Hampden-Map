


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
    this.placeName = '';
    this.latLng = {};
    this.marker = {};
    this.marker.setMap = '';
    this.summary = data.summary; 

    self.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + ", " + self.state + " " + self.zipcode;
    }

  
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

    //List of addresses only for use in the calculating Google map markers 
    //self.addressList = ko.observableArray([]);

    //Iterate through locationList, adding addresses to address list 
    // self.locationObjList().forEach(function(locationObj) {
    //     self.addressList.push(locationObj.address());
    // });    


    //Find locations which are a match for input search text 
    self.displayLocation = ko.computed(function() {
      for (i=0; i<self.locationObjList().length;i++){
        //if searchBox text is a match for part of the name, set display == true on location object
        if (self.locationObjList()[i].name.search(self.searchBox()) !== -1) {
          self.locationObjList()[i].display(true); 
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
      center: { lat: 39.331280, lng: -76.631524},
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

                
                  var infowindow = new google.maps.InfoWindow({
                    content: "<p>" + self.locationObjList()[x].summary + "</p>"
                  });

                  marker.addListener('click', function() {
                    infowindow.open(map, marker);
                  });
                
                  //console.log(x);
                  //setLatLng(self.locationObjList()[x],latLng, marker, x);
                  //setLatLngFactory(self.locationObjList()[x],latLng, marker, x);

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
          


var addresses = ['3646 Elm Ave, Baltimore, MD', '3400 Falls Road, Baltimore, MD',
   '1005 W. 36th Street, Baltimore, MD'];







// mapMaker(); 
      // $(document).ready(function() {
      //       mapMaker();
      //   })
     
     


