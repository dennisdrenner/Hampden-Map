
  // var addresses = ['3646 Elm Ave, Baltimore, MD', '3400 Falls Road, Baltimore, MD',
  // '1005 W. 36th Street, Baltimore, MD'];




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

    this.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + "," + self.state + " " + self.zipcode;
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

    //Iterate through locations array, adding location objects to locationList observable array
    locations.forEach(function(locationObj) {
        self.locationList.push(new Location(locationObj));
    });    

 
    //Array of search results (subset of locationList)
    self.searchList = ko.observableArray([]);

    //Iterate through locationList and find matches for search box entry 
    self.searchLocations = ko.computed(function() {
      self.searchList([]); 
      for (i=0; i<self.locationList().length;i++){
        console.log(self.searchBox());
        if (self.locationList()[i].name.search(self.searchBox()) !== -1) {
          self.searchList.push(self.locationList()[i]);
        }
      }
      return self.searchList; 
    });


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
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

/// ...



 
/* ----------------------- GOOGLE MAP MAKER ----------------------- */
          

      
            
function mapMaker() {

  // , 'Medellin, Colombia', 'Phnom Penh, Cambodia','Hamburg, Germany', 'Mannheim, Germany', 'Islamabad, Pakistan', 'Istanbul, Turkey', 'Crete, Greece', 'Tegucigalpa, Honduras', 'Bello Horizonte, Brazil', 'Santiago, Chile', 'North Dakota', 'Key West, FL', 'Nimes, France', 'Sienna, Italy', 'Cartagena, Colombia', 'New York, NY', 'Los Angeles, CA', 'San Diego, CA', 'Tulum, Mexico', 'Esmeraldas, Ecuador', 'Riobamba, Ecuador', 'Sheffield, England', 'Mostar, Bosnia', 'Sarajevo, Bosnia', 'Bucharest, Romania', 'Karachi, Pakistan', 'Quetta, Pakistan', 'Peshawar, Pakistan', 'Chitral, Pakistan','Shanghai, China'];

  var mapOptions = {
    center: { lat: 39.331280, lng: -76.631524},
    zoom: 16
  };
  var map = new google.maps.Map(document.getElementById('hampdenMap'), mapOptions);

  for (var x = 0; x < addresses.length; x++) {
      $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+addresses[x]+'&sensor=false', null, function (data) {
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


mapMaker(); 
      // $(document).ready(function() {
      //       mapMaker();
      //   })
     
     


