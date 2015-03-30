!function ($) {

  $(function(){

    // tooltip date
    $('.tooltip-date').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    })

    $('.tooltip-test').tooltip()
    $('.popover-test').popover()

    $('.bs-docs-navbar').tooltip({
      selector: "a[data-toggle=tooltip]",
      container: ".bs-docs-navbar .nav"
    })

    // popover demo
    $("[data-toggle=popover]")
      .popover()

})

}(jQuery);

/**
 * apps object
 *
 * The apps object is the foundation of all appsUI enhancements
 */
// It may already be defined in metadata partial
if (typeof(apps) == 'undefined') {
	var apps = {};
}

jQuery(function($) {

	// Set up an object for caching things
	apps.cache = {
		// set this up for the slug generator
		url_titles	: {}
	}

	// Is Mobile?
	apps.is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

	/**
	 * Overload the json converter to avoid error when json is null or empty.
	 */
	$.ajaxSetup({
		//allowEmpty: true,
		converters: {
			'text json': function(text) {
				var json = jQuery.parseJSON(text);
				if (!jQuery.ajaxSettings.allowEmpty == true && (json == null || jQuery.isEmptyObject(json)))
				{
					jQuery.error('The server is not responding correctly, please try again later.');
				}
				return json;
			}
		},
		data: {
			csrf_hash_name: $.cookie(apps.csrf_cookie_name)
		}
	});

	/**
	 * Hides admin header to avoid overlapping when CKEDITOR is maximized
	 */
	apps.init_ckeditor_maximize = function() {
		if (typeof CKEDITOR != 'undefined')
		{
			$.each(CKEDITOR.instances, function(instance) {
				CKEDITOR.instances[instance].on('maximize', function(e) {
					if(e.data == 1) //maximize
					{
						$('.hide-on-ckeditor-maximize').addClass('hidden');
						$('.cke_button__maximize').addClass('ckeditor-apps-logo');
					}
					else if(e.data == 2) //snap back
					{
						$('.hide-on-ckeditor-maximize').removeClass('hidden');
						$('.cke_button__maximize').removeClass('ckeditor-apps-logo');
					}
				});
			});
		}
	};

	/**
	 * This initializes all JS goodness
	 */
	apps.init = function() {

		// Select menu for smaller screens
		$("<select />").appendTo("nav#primary");

		// Create default option "Menu"
		$("<option />", {
   			"selected": "selected",
   			"value"   : "",
   			"text"    : "Menu"
		}).appendTo("nav#primary select");

		// Populate dropdown with menu items
		$("nav#primary a:not(.top-link)").each(function() {
		 	var el = $(this);
 			$("<option />", {
     			"value"   : el.attr("href"),
     			"text"    : el.text()
 			}).appendTo("nav#primary select");
		});

		$("nav#primary select").change(function() {
  			window.location = $(this).find("option:selected").val();
		});

		// Check all checkboxes in container table or grid
		$(".check-all").on('click', function () {
			var check_all		= $(this),
				all_checkbox	= $(this).is('.grid-check-all')
					? $(this).parents(".list-items").find(".grid input[type='checkbox']")
					: $(this).parents("table").find("tbody input[type='checkbox']");

			all_checkbox.each(function () {
				if (check_all.is(":checked") && ! $(this).is(':checked'))
				{
					$(this).click();
				}
				else if ( ! check_all.is(":checked") && $(this).is(':checked'))
				{
					$(this).click();
				}
			});

			// Check all?
			$(".table_action_buttons .btn").prop('disabled', false);
		});

		// Table action buttons start out as disabled
		$(".table_action_buttons .btn").prop('disabled', true);

		// Enable/Disable table action buttons
		$('input[name="action_to[]"], .check-all').on('click', function () {

			if( $('input[name="action_to[]"]:checked, .check-all:checked').length >= 1 ){
				$(".table_action_buttons .btn").prop('disabled', false);
			} else {
				$(".table_action_buttons .btn").prop('disabled', true);
			}
		});

		// Confirmation
		$('a.confirm').on('click', function(e){
			e.preventDefault();

			var href		= $(this).attr('href'),
				removemsg	= $(this).attr('title');

			if (confirm(removemsg || apps.lang.dialog_message))
			{
				$(this).trigger('click-confirmed');

				if ($.data(this, 'stop-click')){
					$.data(this, 'stop-click', false);
					return;
				}
				window.location.replace(href);
			}
		});

		//use a confirm dialog on "delete many" buttons
		$(':submit.confirm').on('click', function(e, confirmation){

			if (confirmation)
			{
				return true;
			}

			e.preventDefault();

			var removemsg = $(this).attr('title');

			if (confirm(removemsg || apps.lang.dialog_message))
			{
				$(this).trigger('click-confirmed');

				if ($(this).data('stop-click')){
					$(this).data('stop-click', false);
					return;
				}

				$(this).trigger('click', true);
			}
		});
	};

	apps.clear_notifications = function()
	{
		$('.alert .close').click();

		return apps;
	};

	apps.add_notification = function(notification, options, callback)
	{
		var defaults = {
			clear	: true,
			ref		: '#content-body',
			method	: 'prepend'
		}, opt;

		// extend options
		opt = $.isPlainObject(options) ? $.extend(defaults, options) : defaults;

		// clear old notifications
		opt.clear && apps.clear_notifications();

		// display current notifications
		$(opt.ref)[opt.method](notification);

		// call callback
		$(window).one('notification-complete', function(){
			callback && callback();
		});

		return apps;
	};

	// Used by Pages and Navigation and is available for third-party add-ons.
	// Module must load jquery/jquery.ui.nestedSortable.js and jquery/jquery.cooki.js
	apps.sort_tree = function($item_list, $url, $cookie, data_callback, post_sort_callback, sortable_opts)
	{
		// set options or create a empty object to merge with defaults
		sortable_opts = sortable_opts || {};
		
		// collapse all ordered lists but the top level
		$item_list.find('ul').children().hide();

		// this gets ran again after drop
		var refresh_tree = function() {

			// add the minus icon to all parent items that now have visible children
			$item_list.find('li:has(li:visible)').removeClass().addClass('minus');

			// add the plus icon to all parent items with hidden children
			$item_list.find('li:has(li:hidden)').removeClass().addClass('plus');
			
			// Remove any empty ul elements
			$('.plus, .minus').find('ul').not(':has(li)').remove();
			
			// remove the class if the child was removed
			$item_list.find("li:not(:has(ul li))").removeClass();

			// call the post sort callback
			post_sort_callback && post_sort_callback();
		}
		refresh_tree();

		// set the icons properly on parents restored from cookie
		$($.cookie($cookie)).has('ul').toggleClass('minus plus');

		// show the parents that were open on last visit
		$($.cookie($cookie)).children('ul').children().show();

		// show/hide the children when clicking on an <li>
		$item_list.find('li').on('click', function()
		{
			$(this).children('ul').children().slideToggle('fast');

			$(this).has('ul').toggleClass('minus plus');

			var items = [];

			// get all of the open parents
			$item_list.find('li.minus:visible').each(function(){ items.push('#' + this.id) });

			// save open parents in the cookie
			$.cookie($cookie, items.join(', '), { expires: 1 });

			 return false;
		});
		
		// Defaults for nestedSortable
		var default_opts = {
			delay: 100,
			disableNesting: 'no-nest',
			forcePlaceholderSize: true,
			handle: 'div',
			helper:	'clone',
			items: 'li',
			opacity: .4,
			placeholder: 'placeholder',
			tabSize: 25,
			listType: 'ul',
			tolerance: 'pointer',
			toleranceElement: '> div',
			update: function(event, ui) {

				post = {};
				// create the array using the toHierarchy method
				post.order = $item_list.nestedSortable('toHierarchy');

				// pass to third-party devs and let them return data to send along
				if (data_callback) {
					post.data = data_callback(event, ui);
				}

				// Refresh UI (no more timeout needed)
				refresh_tree();

				$.post(SITE_URL + $url, post );
			}
		};

		// init nestedSortable with options
		$item_list.nestedSortable($.extend({}, default_opts, sortable_opts));
	}

	apps.chosen = function()
	{
	}

	// Create a clean slug from whatever garbage is in the title field
	apps.generate_slug = function(input_form, output_form, space_character, disallow_dashes)
	{
		space_character = space_character || '-';

		$(input_form).slugify({ slug: output_form, type: space_character });
	}

	$(document).ajaxError(function(e, jqxhr, settings, exception) {
		if (exception != 'abort') {
			apps.add_notification($('<div class="alert error">'+exception+'</div>'));
		}
	});

	$(document).ready(function() {
		apps.init();
		apps.chosen();
		apps.init_ckeditor_maximize();
	});

	//close colorbox only when cancel button is clicked
	$('#cboxLoadedContent a.cancel').on('click', function(e) {
		e.preventDefault();
		$.colorbox.close();
	});


	// Title toggle
	$('a.toggle').click(function() {
	   $(this).parent().next('.item').slideToggle(500);
	});

	// Draggable / Droppable
	$("#sortable").sortable({
		placeholder : 'dropzone',
	    handle : '.draggable',
	    update : function () {
	      var order = $('#sortable').sortable('serialize');
	    }
	});

	//functions for codemirror
	$('.html_editor').each(function() {
		CodeMirror.fromTextArea(this, {
		    mode: 'text/html',
		    tabMode: 'indent',
			height : '500px',
			width : '500px',
		});
	});

	$('.css_editor').each(function() {
		CodeMirror.fromTextArea(this, {
		    mode: 'css',
		    tabMode: 'indent',
			height : '500px',
			width : '500px',
		});
	});

	$('.js_editor').each(function() {
		CodeMirror.fromTextArea(this, {
		    mode: 'javascript',
		    tabMode: 'indent',
			height : '500px',
			width : '500px',
		});
	});
});

$(".alert").alert();
window.setTimeout(function() {
     $(".alert").fadeTo(500, 0).slideUp(500, function(){
          $(this).remove(); 
     });
}, 5000);  

$("header").headroom({
  "tolerance": 5,
  "offset": 40,
  "classes": {
    "initial": "animated",
    "pinned": "slideDown",
    "unpinned": "slideUp"
  }
});

// to destroy
$("#header").headroom("destroy");