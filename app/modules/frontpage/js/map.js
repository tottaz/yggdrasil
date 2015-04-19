$(window).ready(function() {
    'use strict';   
    var map;

    /* FULL MAP */

    var google_maps_circle_color = '#319db5';

    if ($('#full-map').length){
        map_height();
        fullMap();
    } 
    
    $(window).resize(function() {
        map_height();
    });

    function map_height() {
        $('#full-map').height('');
        var window_h = $(window).height();
        var html_h = $(document).height();
        $('#full-map').css({
            'height': window_h
        });
    }

    function fullMap() {
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

        map = new google.maps.Map(document.getElementById('full-map'), myOptions);

        var mapStyle = [
            {
                featureType: "administrative",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: 'landscape',
                elementType: 'all',
                stylers: [{
                    color: "#3C3C3C"
                }, {
                    visibility: 'on'
                }]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "road",
                elementType: "all",
                stylers: [{
                    visibility: "on"
                }, {
                    lightness: -30
                }]
            },
            {
                featureType: "transit",
                elementType: "all",
                stylers: [{
                    visibility: "off"
                }]
            },
            {
                featureType: "water",
                elementType: "all",
                stylers: [{
                    color: "#232323"
                }]
            }
          ];
        var styledMapOptions = {
            name: "Map"
        };
        var ptMapType = new google.maps.StyledMapType(mapStyle, styledMapOptions);
        map.mapTypes.set("ptMap", ptMapType);
        map.setMapTypeId("ptMap");
        var circle = {
            path: google.maps.SymbolPath.CIRCLE,
            fillOpacity: 0.6,
            fillColor: google_maps_circle_color,
            strokeWeight: 0,
            scale: 12
        };
        var markerFull = new MarkerWithLabel({
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


});