/** Copyright 2014, Codrops */
(function() {
		content = document.querySelector('.page-content'),
		openbtn = document.getElementById('open-canvas'),
		closebtn = document.getElementById('close-button'),
		isOpen = false;

	if(!openbtn) return;

	function init() {
		initEvents();
	}

	function initEvents() {
		openbtn.addEventListener('click', toggleMenu);
		if( closebtn ) {
			closebtn.addEventListener('click', toggleMenu);
		}

		// close the menu element if the target it´s not the menu element or one of its descendants..
		content.addEventListener('click', function(ev) {
			var target = ev.target;
			if( isOpen && target !== openbtn ) {
				toggleMenu();
			}
		} );
	}

	function toggleMenu() {
		if( isOpen ) {
			classie.remove(document.body, 'show-menu');
		}
		else {
			classie.add(document.body, 'show-menu');
		}
		isOpen = !isOpen;
	}

	init();

})();