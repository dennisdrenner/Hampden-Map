

// This is a simple *viewmodel*  working with Knockout.js

function AppViewModel() {
    this.searchBox =  ko.observable("Enter search text here");
    
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

