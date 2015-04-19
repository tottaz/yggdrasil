var topnav      = $('.topnav'),
    topnavHeight   = topnav.height();
/* ----------------------------- 
Pre Loader
----------------------------- */
$(window).load(function() {
    'use strict';
    setTimeout(function() {
        $('.loader-overlay').addClass('loaded');
        $('body > section').animate({
            opacity: 1,
        }, 400);
    }, 500);
});

function navbarScroll(topnav, topnavHeight) {
    var topScroll = $(window).scrollTop();
    if (topnav.length > 0) {
        if(topScroll >= topnavHeight) {
            topnav.removeClass('topnav-top');
        } else {
            topnav.addClass('topnav-top');
        }
    }
};

navbarScroll(topnav, topnavHeight);


/* ----------------------------- 
Backgroung slider
----------------------------- */
$(window).scroll(function() {
    var windowPos = $(window).scrollTop();
    navbarScroll(topnav, topnavHeight);
});
$(window).ready(function() {
    'use strict';
    var windowHeight = $(window).height();
    
    /* Background Slider */
    $('.bg-slider').height(windowHeight);
    $('.bg-slider').backstretch(["app/modules/frontpage/img/bg-slider/bg-1.jpg","app/modules/frontpage/img/bg-slider/bg-2.jpg","app/modules/frontpage/img/bg-slider/bg-3.jpg"],
    {
        fade: 600,
        duration: 4000
    });

    /* Scroll into viewPort Animation */
    $('.animated').appear(function() {
        var element = $(this),
            animation = element.data('animation'),
            animationDelay = element.data('animation-delay');
        if (animationDelay) {
            setTimeout(function() {
                element.addClass(animation + " visible");
            }, animationDelay);
        } else {
            element.addClass(animation + " visible");
        }
    });

    /* NiceScroll */
    $("html").niceScroll({
        cursorcolor: '#319db5',
        cursoropacitymin: '1',
        cursorborder: '0px',
        cursorborderradius: '0px',
        cursorwidth: '8px',
        cursorminheight: 60,
        horizrailenabled: false,
        zindex: 1000
    });
    
    /* Project Gallery Sortable */
    if($(".project-wrapper").length){
        $(".project-wrapper").mixItUp();
    }

    /* IE 9 Placeholder fix */
    $('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();

    /* One Page Main navigation */
    $('.nav').onePageNav({
        currentClass: 'current',
        scrollSpeed: 1000,
        easing: 'easeInOutQuint'
    });
    $('.go-down').on('click', function(){
        $('html, body').animate({
            scrollTop: $("#section-services").offset().top
        }, 1000);
    });
    $(window).bind('scroll', function(e) {
        var scrollPos = $(window).scrollTop();
        scrollPos > 220 ? $('.sticky-section').addClass('nav-bg') : $('.sticky-section').removeClass('nav-bg');
    });

    if ($('.project-wrapper').length && $.fn.magnificPopup) {
        imageZoom();
    }

    $('.color-toggle').on('click', function(){
        $('#color-chooser').toggleClass('show');
    });     
    $('#color-chooser').on('click', '.color', function(){
        var color = $(this).attr('data-theme');
        $('#theme-color').attr('href', 'css/themes/' + color + '.css');
    }); 
    $('.close-color').on('click', function(){
        $('#color-chooser').toggleClass('show');
    });

});

function imageZoom(){
    $('.project-wrapper').magnificPopup({
      type: 'image',
       delegate: '.magnific',
       gallery:{enabled:true} 
    });
}