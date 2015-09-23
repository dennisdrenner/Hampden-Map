


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
    this.latlng = '';
    this.placeName = '';

    self.address = function () {
        return self.streetNumber + " " + self.street + " " 
        + self.city + ", " + self.state + " " + self.zipcode;
    }

  
};

var locations = [

 {
          name: "Fraziers",
          streetNumber: "1400",
          street: "W. 36th",
          categories: ["bar", "restaurant"],
          latLng : {}

  },

 {
          name: "Milagros",
          streetNumber: "1005",
          street: "W. 36th",
          categories: ["shop"] ,
          latLng : {}

  },

   {
          name: "Milagros Neighbor",
          streetNumber: "1009",
          street: "W. 36th",
          categories: ["shop"] ,
          latLng : {} 

  },

   {
          name: "Charm City Headshots",
          streetNumber: "3646",
          street: "Elm Avenue",
          categories: ["photographer"] ,
          latLng : {}

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
    self.addressList = ko.observableArray([]);

    //Iterate through locationList, adding addresses to address list 
    self.locationObjList().forEach(function(locationObj) {
        self.addressList.push(locationObj.address());
    });    

    self.displayLocation = ko.computed(function() {
      for (i=0; i<self.locationObjList().length;i++){
        //if searchBox text is a match for part of the name, set display == true on location object
        if (self.locationObjList()[i].name.search(self.searchBox()) !== -1) {
          self.locationObjList()[i].display(true); 
        }
        //else set display = false 
        else { 
          self.locationObjList()[i].display(false); 
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

  
    //Iterate through locationObjList (array of all location objects), calculate latlng and placeNames based on their
    //addresses, and create map markers -- adding all of these as properties to the object 
   

    function mapMaker() {
      for (var x = 0; x < self.locationObjList().length; x++) {
      
      $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?address='+self.locationObjList()[x].address()+
            '&sensor=false', null, function (data) {
              var p = data.results[0].geometry.location;
              var newLatLng = new google.maps.LatLng(p.lat, p.lng);

              //this line prints '4' every time, not 0,1,2,3 as i'd expect 
              console.log(x);

              //line below throws an error 
             // self.locationObjList()[x].latlng(newLatng);
          
              var marker = 
                new google.maps.Marker({
                    animation: google.maps.Animation.DROP,
                    position: newLatLng,
                    map: map,
                   
                });

            });        

          };
 
      };
       mapMaker();

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
     
     


