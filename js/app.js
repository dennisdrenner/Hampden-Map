


/* ----------------------- MODEL ----------------------- */

//Constructor function for pointOfInterest object (i.e. locations in Hampden)

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

    self.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + ", " + self.state + " " + self.zipcode;
    }

    // this.level = ko.computed(function() {
    //     var level; 
    //     if (this.clickCount() < 10) {return level = 'infant'};
    //     if (this.clickCount() < 20) {return level = 'teen'};
    //     if (this.clickCount() < 30) {return level = 'adult'};
    //     if (this.clickCount() >= 30) {return level = 'cryptkeeper'}; 
    //     console.log(level);
    // }, this);

};

var locations = [

 {
          name: "Fraziers",
          streetNumber: "1400",
          street: "W. 36th",
          categories: ["bar", "restaurant"] 

  },

 {
          name: "Milagros",
          streetNumber: "1005",
          street: "W. 36th",
          categories: ["shop"] 

  },

   {
          name: "Charm City Headshots",
          streetNumber: "3646",
          street: "Elm Avenue",
          categories: ["photographer"] 

  },
]



// var ViewModel = function () {
//     var self = this; 

//     self.locationList = ko.observableArray([]);

//     locations.forEach(function(locationObj) {
//         self.locationList.push(new Location(locationObj));
//     });

//     self.currentCat = ko.observable(self.catList()[1]);

//     setCurrentCat = function (cat) {
//        self.currentCat(cat);
//     };


/* ----------------------- VIEW MODEL ----------------------- */

function AppViewModel() {

    var self = this; 

    this.searchBox =  ko.observable("Enter search text");

    //List of all locations in the model
    self.locationList = ko.observableArray([]);

    //Iterate through locations array, creating new location objects and 
    //adding them to the locationList observable array
    locations.forEach(function(locationObj) {
        self.locationList.push(new Location(locationObj));
        //console.log("LL:", self.locationList());
    });    

    //List of addresses only for use in the calculating Google map markers 
    self.addressList = ko.observableArray([]);

    //Iterate through locationList, adding addresses to address list 
    self.locationList().forEach(function(locationObj) {
        self.addressList.push(locationObj.address());
    });    
 
    //Array of search results (subset of locationList)
   //self.searchList = ko.observableArray([]);

    //Iterate through locationList and find matches for search box entry 
    //self.searchLocations = ko.computed(function() {
     // self.searchList([]); 


    self.displayLocation = ko.computed(function() {
      for (i=0; i<self.locationList().length;i++){
        //if searchBox text is a match for part of the name, set display == true on location object
        if (self.locationList()[i].name.search(self.searchBox()) !== -1) {
          self.locationList()[i].display(true); 
          //console.log(self.locationList()[i].display(), self.locationList()[i].name);
        }
        //else set display = false 
        else { 
          self.locationList()[i].display(false); 
          //console.log(self.locationList()[i].display(), self.locationList()[i].name);
        } 
     //     self.searchList.push(self.locationList()[i]);
        }
    });
      
// return self.searchList; 
     
    

    // ko.bindingHandlers.mapBinding = {
    //   init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    //       // This will be called when the binding is first applied to an element
    //       // Set up any initial state, event handlers, etc. here
    //   },
    //   update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
    //       // This will be called once when the binding is first applied to an element,
    //       // and again whenever any observables/computeds that are accessed change
    //       // Update the DOM element based on the supplied values here.
    //   }
    // };

    var mapOptions = {
    center: { lat: 39.331280, lng: -76.631524},
    zoom: 16
    };
    var map = new google.maps.Map(document.getElementById('hampdenMap'), mapOptions);

    function mapMaker(addresses) {
      for (var x = 0; x < addresses.length; x++) {
          $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+
            '&sensor=false', null, function (data) {
              var p = data.results[0].geometry.location;
              var latlng = new google.maps.LatLng(p.lat, p.lng);
              var placeName = data.results[0].address_components[0].long_name;

              new google.maps.Marker({
                  animation: google.maps.Animation.DROP,
                  position: latlng,
                  map: map,
                  title: placeName,
              });
          });
      } 
    };

    mapMaker(self.addressList());

}

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
     
     


