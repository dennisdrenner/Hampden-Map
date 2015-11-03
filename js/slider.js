$(document).ready(function () {

    //stick in the fixed 100% height behind the navbar but don't wrap it
    $('#slide-nav.navbar .container').append($('<div id="navbar-height-col"></div>'));

    // Enter your ids or classes
    var toggler = '.navbar-toggle';
    var pagewrapper = '#mapWrapper';//'#page-content';
    var navigationwrapper = '#searchBox' //'.navbar-header';
    var menuwidth = '100%'; // the menu inside the slide menu itself
    var slidewidth = '60%';
    var menuneg = '-110%';
    var slideneg = '-80%';


    //This function toggles the 'slide-active' class on and off on all page elements when 
    //the toggler (hamburger menu) is clicked   
    $("#slide-nav").on("click", toggler, function (e) {

        var selected = $(this).hasClass('slide-active');  //true if slide-active class is present on toggler 

        //The next four functions trigger 'animation' of slidemenu when clicking toggler  
        $('#slidemenu').stop().animate({
            left: selected ? menuneg : '0px'
        });

        $('#navbar-height-col').stop().animate({
            left: selected ? slideneg : '0px'
        });

        //Uncommenting the code below will make the map move to the right as the slidemenu moves in
        //otherwise map will stay put and slidemenu will just move over top of it 

        // $(pagewrapper).stop().animate({
        //     left: selected ? '0px' : slidewidth
        // });


        // $(navigationwrapper).stop().animate({
        //     left: selected ? '0px' : slidewidth
        // });

        $(this).toggleClass('slide-active', !selected);

        $('#slidemenu').toggleClass('slide-active');

        $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');


    });

    
    //Reset slidemenu when resizing viewport when viewport size > 767 px
    // var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';

    // $(window).on("resize", function () {

    //     if ($(window).width() > 767 && $('.navbar-toggle').is(':hidden')) {
    //         $(selected).removeClass('slide-active');
    //     }

    // });


});