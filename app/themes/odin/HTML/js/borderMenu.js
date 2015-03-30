
(function() {
    var triggerBttn = document.getElementById( 'trigger-overlay' ),
        overlay = document.querySelector( 'div.overlay' ),
        menuItem = document.querySelector( 'div.overlay nav ul li:first-child' ),
        menuItem2 = document.querySelector( 'div.overlay nav ul li:nth-child(2)' ),
        menuItem3 = document.querySelector( 'div.overlay nav ul li:nth-child(3)' ),
        menuItem4 = document.querySelector( 'div.overlay nav ul li:nth-child(4)' ),
        menuItem5 = document.querySelector( 'div.overlay nav ul li:nth-child(5)' ),
        menuItem6 = document.querySelector( 'div.overlay nav ul li:nth-child(6)' ),

        closeBttn = overlay.querySelector( 'a.overlay-close' );
    transEndEventNames = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'msTransition': 'MSTransitionEnd',
        'transition': 'transitionend'
    },
        transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
        support = { transitions : Modernizr.csstransitions };

    function toggleOverlay() {
        if( classie.has( overlay, 'open' ) ) {
            classie.remove( overlay, 'open' );
            classie.add( overlay, 'close' );
            var onEndTransitionFn = function( ev ) {
                if( support.transitions ) {
                    if( ev.propertyName !== 'visibility' ) return;
                    this.removeEventListener( transEndEventName, onEndTransitionFn );
                }
                classie.remove( overlay, 'close' );
            };
            if( support.transitions ) {
                overlay.addEventListener( transEndEventName, onEndTransitionFn );
            }
            else {
                onEndTransitionFn();
            }
        }
        else if( !classie.has( overlay, 'close' ) ) {
            classie.add( overlay, 'open' );
        }
    }


    triggerBttn.addEventListener( 'click', toggleOverlay );
    closeBttn.addEventListener( 'click', toggleOverlay );
    menuItem.addEventListener('click', toggleOverlay);
    menuItem2.addEventListener('click', toggleOverlay);
    menuItem3.addEventListener('click', toggleOverlay);
    menuItem4.addEventListener('click', toggleOverlay);
    menuItem5.addEventListener('click', toggleOverlay);
    menuItem6.addEventListener('click', toggleOverlay);


})();