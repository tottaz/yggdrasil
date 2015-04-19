$(window).load(function() {
"use strict";
    setTimeout(function () {
        $('.loader-overlay').addClass('loaded');
    },300);

});
$(function() {
    
    $('#countdown').countdown('2015/06/01', function(event) {
        $(this).html(event.strftime('%w weeks %d days <br /> %H:%M:%S'));
    });

    $('.social-nav ul li').mouseover(function(){
        $(this).animate({'padding-top' : 130}, {queue: false, duration: 500});
    }).mouseleave(function(){
        $(this).animate({'padding-top' : 100}, {queue: false, duration: 500});
    });

    $('.main-nav ul li a, .content.show a').click(function(e) {
        e.preventDefault();
        var link = $(this).attr('href').substr(1);
        
        if ( !$('section.content.show, section#' + link).is(':animated') ) {
            $('.main-nav ul li a').removeClass('active'); //remove active
            $('section.content.show').addClass('show').animate({'opacity' : 0}, {queue: false, duration: 500,
                complete: function() {
                    $('section.content.show').hide();
                    $('a[href="#'+link+'"]').addClass('active'); // add active
                    $('section#' + link).show();
                    $('section#' + link).addClass('show').animate({'opacity' : 1}, {queue: false, duration: 500});    
                }
            });
        }
    });

});

/* GOOGLE MAPS */
$(document).ready(function() {
    if ($('#map').length) {
        comingMap();
    }
    else{
        /* Background Slide */
        $.backstretch([ "assets/images/gallery/login4.jpg", "assets/images/gallery/login3.jpg", "assets/images/gallery/login2.jpg", "assets/images/gallery/login.jpg"],{fade: 600, duration: 4000 
        });
    }
    map_height();
    $(window).resize(function() {
        map_height();
    });
});

function map_height(){
    $('#map').height('');
    var window_h = $(window).height();
    var html_h = $(document).height();
    $('#map').css({ 'height' : window_h });
}

function comingMap() {
  var myOptions = {
    zoom: 4,
    center: new google.maps.LatLng(25.7738889, -80.1938889),
    navigationControlOptions: {
      style: google.maps.NavigationControlStyle.NORMAL,
      position: google.maps.ControlPosition.RIGHT_TOP
    },
    streetViewControl: false,
    scrollwheel: false,
    zoomControl: false,
    panControl: false,
    zoomControlOptions: {
          style: google.maps.ZoomControlStyle.DEFAULT,
          position: google.maps.ControlPosition.RIGHT_TOP
      },
    mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT,
      mapTypeIds: ["ptMap"]
    }
  };
  
  map = new google.maps.Map(document.getElementById('map'), myOptions);
  var mapStyle = [
    { featureType: "administrative", elementType: "all", stylers: [ { visibility: "off" } ] },
    { featureType: 'landscape', elementType: 'all', stylers: [ { color: '#3C3C3C' }, { visibility: 'on' } ] },
    { featureType: "poi", elementType: "all", stylers: [ { visibility: "off" } ] },
    { featureType: "road", elementType: "all", stylers: [ { visibility: "on" }, { lightness: -30 } ] },
    { featureType: "transit", elementType: "all", stylers: [ { visibility: "off" } ] },
    { featureType: "water", elementType: "all", stylers: [ { color: '#232323' } ] }
  ];
    
  var styledMapOptions = {name: "Map"};
    var ptMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);
    map.mapTypes.set("ptMap", ptMapType);
    map.setMapTypeId("ptMap");  
  
  var circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillOpacity: 0.6,
      fillColor: '#319db5',
      strokeWeight: 0, 
      scale: 12
  };
  
  var marker = new MarkerWithLabel({
        position: map.getCenter(),
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0
        },
        map: map,
        draggable: true,
        labelAnchor: new google.maps.Point(10, 10),
        labelClass: 'pulse-label'
    });
  
}




