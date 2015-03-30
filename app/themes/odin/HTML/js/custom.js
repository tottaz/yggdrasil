/*

 QUEEN One Page Parallax Template
 made by
 VLAD HAIDUC
 artBreeze Studios
 http://themeforest.net/user/artbreeze

 */



/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* 1.Intro Height  */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

$(document).ready(function () {
    function introHeight() {
        var wh = $(window).height();
        $('#intro').css({height: wh});
    }

    introHeight();

    $(window).bind('resize',function () {

        //Update slider height on resize
        introHeight();
    });


    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /* 2.Owl Carousel Init  */
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

    "use strict";
    var owl = $("#owl-intro");

    owl.owlCarousel({
        // Most important owl features
        autoPlay: 3000,
        items : 1,
        itemsCustom : false,
        itemsDesktop : [1199,1],
        itemsDesktopSmall : [980,1],
        itemsTablet: [768,1],
        itemsTabletSmall: false,
        itemsMobile : [479,1],
        singleItem : true,
        itemsScaleUp : true,
        navigation:	false,
        pagination:	false,
        transitionStyle : "backSlide"


    });

//    $("#owl-about").owlCarousel({
//        singleItem:true,
//        navigation: true,
//        navigationText: [
//            "<i class='fa fa-angle-left fa-2x'></i>",
//            "<i class='fa fa-angle-right fa-2x'></i>"
//        ],
//        touchDrag:	false
//    });


    $("#owl-blogPost").owlCarousel({
        singleItem: true,
        navigation: true,
        pagination: false,
        navigationText: [
            "<i class='fa fa-angle-left fa-2x'></i>",
            "<i class='fa fa-angle-right fa-2x'></i>"
        ],
    });


//    $("#owl-team").owlCarousel({
//        items:4,
//        navigation: false,
//        temsCustom : false,
//        itemsDesktop : [1199,4],
//        itemsDesktopSmall : [980,3],
//        itemsTablet: [768,2],
//        itemsMobile : [479,1]
//    });


    $("#owl-clients").owlCarousel({
        items:4,
        navigation: false
    });



    $("#owl-testimonials").owlCarousel({
        singleItem:true
    });


    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        $( "#intro" ).css( "background-attachment", "scroll" );
        $( "#charts" ).css( "background-attachment", "scroll" );
        $( "#testimonials" ).css( "background-attachment", "scroll" );
        $( "#clients" ).css( "background-attachment", "scroll" );
        $( "#video" ).css( "background-attachment", "scroll" );
        $( "#textSeparator" ).css( "background-attachment", "scroll" );
    }

    else{
        $.stellar({
            responsive: true,
            horizontalOffset: 0,
            horizontalScrolling:false
        });

    }



    $('#charts').waypoint(function() {
        "use strict";
        // first timer
        $('.timer1').countTo({

            from: 0, // the number you want to start
            to: 250, // the number you want to reach
            speed: 250,
            refreshInterval: 1

        });

        // second timer
        $('.timer2').countTo({

            from: 0,// the number you want to start
            to: 70,// the number you want to reach
            speed: 250,
            refreshInterval: 1

        });


        // third timer
        $('.timer3').countTo({

            from: 0,// the number you want to start
            to: 120,// the number you want to reach
            speed: 250,
            refreshInterval: 1
        });


        // fourth timer
        $('.timer4').countTo({

            from: 0,// the number you want to start
            to: 101,// the number you want to reach
            speed: 250,
            refreshInterval: 1,
            onComplete: function(value) {
                $( '.timer' ).stop();
            }

        });


    }, { offset: 500 });


    var $container = $('.gallery').imagesLoaded( function() {
        $container.isotope({
            // options
        });
    });


    $('#filters').on( 'click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        $container.isotope({ filter: filterValue });
    });

    $container.isotope({
        filter: '*' // IF YOU WANT TO DISPLAY AT FIRST ONLY ONE FILTER, FOR EXAMPLE DESIGNS: SUBSTIUTE '*' WITH '.designs'
    });


    $('.gallery-inner').magnificPopup({
        delegate: ' .popup-link',
        gallery: {
            enabled: true, // set to true to enable gallery

            navigateByImgClick: true,

            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

            tPrev: 'Previous (Left arrow key)', // title for left button
            tNext: 'Next (Right arrow key)', // title for right button

        },
        type: 'image',
        mainClass: 'mfp-fade',
        // Info about options is in docs:
        // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

        tLoading: 'Loading...'
    });



    $('.featuredWork').magnificPopup({
        delegate: ' .popup-link',
        gallery: {
            enabled: true, // set to true to enable gallery

            navigateByImgClick: true,

            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

            tPrev: 'Previous (Left arrow key)', // title for left button
            tNext: 'Next (Right arrow key)', // title for right button

        },
        type: 'image',
        mainClass: 'mfp-fade',
        // Info about options is in docs:
        // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

        tLoading: 'Loading...'
    });


    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
        disableOn: 100,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,

        fixedContentPos: false
    });





//    /contact form


    $("#submit_btn").click(function() {
        //get input field values
        var user_name       = $('input[name=name]').val();
        var user_email      = $('input[name=email]').val();
        var user_phone      = $('input[name=phone]').val();
        var user_message    = $('textarea[name=message]').val();

        //simple validation at client's end
        //we simply change border color to red if empty field using .css()
        var proceed = true;
        if(user_name==""){
            $('input[name=name]').css('border-color','red');
            proceed = false;
        }
        if(user_email==""){
            $('input[name=email]').css('border-color','red');
            proceed = false;
        }
        if(user_phone=="") {
            $('input[name=phone]').css('border-color','red');
            proceed = false;
        }
        if(user_message=="") {
            $('textarea[name=message]').css('border-color','red');
            proceed = false;
        }

        //everything looks good! proceed...
        if(proceed)
        {
            //data to be sent to server
            post_data = {'userName':user_name, 'userEmail':user_email, 'userPhone':user_phone, 'userMessage':user_message};

            //Ajax post data to server
            $.post('contact_me.php', post_data, function(response){    /* change your email and subject in contact_me.php */

                //load json data from server and output message
                if(response.type == 'error')
                {
                    output = '<div class="error">'+response.text+'</div>';
                }else{

                    output = '<div class="success">'+response.text+'</div>';

                    //reset values in all input fields
                    $('#contact_form input').val('');
                    $('#contact_form textarea').val('');
                }

                $("#result").hide().html(output).slideDown();
            }, 'json');

        }
    });

    //reset previously set border colors and hide all message on .keyup()
    $("#contact_form input, #contact_form textarea").keyup(function() {
        $("#contact_form input, #contact_form textarea").css('border-color','');
        $("#result").slideUp();
    });




    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    /* 8. Google Map Init */
    /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


    function initialize() {
        var map_canvas = document.getElementById('googleMap');

        var map_options = {
            center: new google.maps.LatLng(44.434596, 26.080533),
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false
        };

        var map = new google.maps.Map(map_canvas, map_options);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(44.434596, 26.080533),
            map: map,
            title: 'Hello World!'
        });
        var styles = [
            {
                "stylers": [
                    { "saturation": -56 },
                    { "color": "#838080" },
                    { "lightness": -45 }
                ]
            },{
                "featureType": "landscape",
                "stylers": [
                    { "color": "#938080" }
                ]
            },{
                "featureType": "landscape.man_made",
                "elementType": "geometry",
                "stylers": [
                    { "color": "#868483" },
                    { "saturation": -72 },
                    { "lightness": -35 }
                ]
            },{
                "featureType": "landscape.man_made",
                "elementType": "labels.text",
                "stylers": [
                    { "color": "#808080" },
                    { "saturation": -88 },
                    { "lightness": 100 },
                    { "weight": 0.1 }
                ]
            },{
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    { "saturation": -88 },
                    { "lightness": 100 },
                    { "weight": 0.1 }
                ]
            },{
                "featureType": "road.highway",
                "stylers": [
                    { "color": "#c99f6c" },
                    { "saturation": -40 }
                ]
            },{
                "featureType": "road.arterial",
                "stylers": [
                    { "color": "#c99f6c" },
                    { "saturation": -85 },
                    { "lightness": 41 }
                ]
            },{
                "featureType": "road.local",
                "stylers": [
                    { "color": "#c99f6c" },
                    { "saturation": -86 },
                    { "lightness": -49 }
                ]
            },{
                "featureType": "road",
                "elementType": "labels",
                "stylers": [
                    { "lightness": 100 },
                    { "weight": 0.1 }
                ]
            },{
                "featureType": "landscape",
                "elementType": "labels",
                "stylers": [
                    { "color": "#ae8080" },
                    { "lightness": 100 }
                ]
            },{
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    { "color": "#558080" },
                    { "lightness": 100 },
                    { "weight": 0.1 }
                ]
            },{
                "featureType": "poi",
                "elementType": "labels.icon",
                "stylers": [
                    { "color": "#d18080" },
                    { "visibility": "off" }
                ]
            },{
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [
                    { "color": "#958080" },
                    { "lightness": 100 }
                ]
            },{
            }
        ]
        map.setOptions({styles: styles});
    }
    google.maps.event.addDomListener(window, 'load', initialize);




    smoothScroll.init({
        speed: 1000, // Integer. How fast to complete the scroll in milliseconds
        easing: 'easeInOutCubic', // Easing pattern to use
        updateURL: false, // Boolean. Whether or not to update the URL with the anchor hash on scroll
        offset: 0, // Integer. How far to offset the scrolling anchor location in pixels
        callbackBefore: function ( toggle, anchor ) {}, // Function to run before scrolling
        callbackAfter: function ( toggle, anchor ) {} // Function to run after scrolling
    });


    $('#filters .btn').tooltip();

    $("body").fitVids();





});




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* 12. Preloader */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


$(window).load(function() {    // makes sure the whole site is loaded
    "use strict";
    $('#status').fadeOut(); // will first fade out the loading animation
    $('#preloader').delay(100).fadeOut('slow'); // will fade out the white DIV that covers the website.
    $('body').delay(100).css({'overflow':'visible'});
})




//
///** Used Only For Touch Devices **/
//$( function( window ) {
//
//    // for touch devices: add class cs-hover to the figures when touching the items
//    if( Modernizr.touch ) {
//
//        // classie.js https://github.com/desandro/classie/blob/master/classie.js
//        // class helper functions from bonzo https://github.com/ded/bonzo
//
//        function classReg( className ) {
//            return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
//        }
//
//        // classList support for class management
//        // altho to be fair, the api sucks because it won't accept multiple classes at once
//        var hasClass, addClass, removeClass;
//
//        if ( 'classList' in document.documentElement ) {
//            hasClass = function( elem, c ) {
//                return elem.classList.contains( c );
//            };
//            addClass = function( elem, c ) {
//                elem.classList.add( c );
//            };
//            removeClass = function( elem, c ) {
//                elem.classList.remove( c );
//            };
//        }
//        else {
//            hasClass = function( elem, c ) {
//                return classReg( c ).test( elem.className );
//            };
//            addClass = function( elem, c ) {
//                if ( !hasClass( elem, c ) ) {
//                    elem.className = elem.className + ' ' + c;
//                }
//            };
//            removeClass = function( elem, c ) {
//                elem.className = elem.className.replace( classReg( c ), ' ' );
//            };
//        }
//
//        function toggleClass( elem, c ) {
//            var fn = hasClass( elem, c ) ? removeClass : addClass;
//            fn( elem, c );
//        }
//
//        var classie = {
//            // full names
//            hasClass: hasClass,
//            addClass: addClass,
//            removeClass: removeClass,
//            toggleClass: toggleClass,
//            // short names
//            has: hasClass,
//            add: addClass,
//            remove: removeClass,
//            toggle: toggleClass
//        };
//
//        // transport
//        if ( typeof define === 'function' && define.amd ) {
//            // AMD
//            define( classie );
//        } else {
//            // browser global
//            window.classie = classie;
//        }
//
//        [].slice.call( document.querySelectorAll( 'ul.grid > li > figure' ) ).forEach( function( el, i ) {
//            el.querySelector( 'figcaption > a' ).addEventListener( 'touchstart', function(e) {
//                e.stopPropagation();
//            }, false );
//            el.addEventListener( 'touchstart', function(e) {
//                classie.toggle( this, 'cs-hover' );
//            }, false );
//        } );
//
//    }
//
//});




/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/* Mobile bug fixes  */
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/* LOAD animations.css only on desktop */



if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/animate.css') );
    var wow = new WOW(
        {
            boxClass:     'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset:       150,          // distance to the element when triggering the animation (default is 0)
            mobile:       false        // trigger animations on mobile devices (true is default)
        }
    );
    wow.init();
}




if(Modernizr.touch){
    $('.caption .valign').css("top","40px");
}

$('.gallery-inner').bind('touchstart', function() {
    $(this).addClass('.caption');
});

$('.gallery-inner').bind('touchend', function() {
    $(this).removeClass('.caption');
});


$('.featuredWork').bind('touchstart', function() {
    $(this).addClass('.caption');
});

$('.featuredWork').bind('touchend', function() {
    $(this).removeClass('.caption');
});



