(function($) {
   "use strict";

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());






// ============================================================================
// Mental menu-bar plugin
// ============================================================================

(function($, window, document, undefined) {

   var pluginName = 'mental_menu_bar';
   var defaults = {
      always_show_after_threshold: !$('body').hasClass('menu-bar-ontop'),
      container_960_threshold: 1300,   // Menubar is always opened if screen width more than 1300px (960px container)
      container_1170_threshold: 1600,  // Menubar is always opened if screen width more than 1600px (1170px container)
      load_closed_belov: 768,          // Close menubar on load if screen width less than 768px
      main_block: '#main'              // By default menuber pushes main block when opens
   };

   function Plugin(element, options) {
      this._name = pluginName;
      this.element = element;
      this.options = $.extend({}, defaults, options);

      this.$element = $(element);
      this.$main_block = $(this.options.main_block);

      this.init();
   }

   Plugin.prototype = {
      init: function() {
         var 
            that = this;

         // Determine menubar opening threshold based on max conianter width (query string ?960px)
         this.current_threshold = urlParams['960px'] != undefined ? 
         this.options.container_960_threshold : this.options.container_1170_threshold;

         // Shod menubar on hover (and hide on mouseout)
         this.$element.hover(
            function() {
               that.show();
            }, function() {
               if(window.innerWidth < that.current_threshold)
                  that.hide();
            }
         );

         // Hide menubar on #main hover
         $('#main').hover(function(){
            if(!that.options.always_show_after_threshold || window.innerWidth < that.current_threshold)
               that.hide();
         });

         // Toggle menubar on mb-toggler click
         this.$element.find('.mb-toggler').click(function(e){
            e.preventDefault();
            that.toggle();
         });

         // Show/hide menubar based on window width when resizing
         if(this.options.always_show_after_threshold){
            $(window).resize(function() {
               if(window.innerWidth < that.current_threshold && that.is_opened()) that.hide();
               else if(window.innerWidth > that.current_threshold && !that.is_opened()) that.show();
            });
         }

         // Hide on click elsewhere
         $(document).click(function(e)
         {
            var container = that.$element;
            if (!container.is(e.target) // if the target of the click isn't the container...
               && container.has(e.target).length === 0 // ... nor a descendant of the container
               && !$('.mb-toggler').is(e.target)
               && $('.mb-toggler').has(e.target).length === 0
              )
            {
               // Hide only if screen width less than screen_width_threshold when menu is alsways shown
               if(!that.options.always_show_after_threshold || window.innerWidth < that.current_threshold)
                 that.hide();
            }
         });

         // Hide menu with delay if touch screen
         $(window).load(function(){
            if(Modernizr.touch)
               setTimeout(function(){
                  that.hide();
                  //start = false;
               }, 1000);
         });

         // Hide instantly w/o animation if screen width is less than load_closed_belov
         if(window.innerWidth < this.options.load_closed_belov && this.is_opened()){
            this.sw_off_transitions();
            that.hide();
            setTimeout(function(){
               that.sw_on_transitions();
            }, 500);
         }

      }, // init
      hide: function(){
         $('body').removeClass('menu-bar-opened');
      },
      show: function(){
         $('body').addClass('menu-bar-opened');
      },
      toggle: function(){
         $('body').toggleClass('menu-bar-opened');
      },
      sw_off_transitions: function(){
         this.$main_block.css({'transition-property':'none', '-moz-transition-property':'none', '-webkit-transition-property':'none', '-o-transition-property':'none'})
         this.$element.css({'transition-property':'none', '-moz-transition-property':'none', '-webkit-transition-property':'none', '-o-transition-property':'none'})
      },
      sw_on_transitions: function(){
         this.$main_block.css({'transition-property':'', '-moz-transition-property':'', '-webkit-transition-property':'', '-o-transition-property':''})
         this.$element.css({'transition-property':'', '-moz-transition-property':'', '-webkit-transition-property':'', '-o-transition-property':''})
      },
      is_opened: function(){
         return $('body').hasClass('menu-bar-opened');
      }
   } // Plugin.prototype

   $.fn[pluginName] = function(options) {
      var args = [].slice.call(arguments, 1);
      return this.each(function() {
         if (!$.data(this, 'plugin_' + pluginName))
            $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
         else if ($.isFunction(Plugin.prototype[options]))
            $.data(this, 'plugin_' + pluginName)[options].apply($.data(this, 'plugin_' + pluginName), args);
      });
   }
})(jQuery, window, document);




// ============================================================================
// mental_menu plugin
// ============================================================================

(function($, window, document, undefined) {

    var pluginName = 'mental_menu';
    var defaults = {
      easing: 'easeOutBack',
      speed: 'slow'
    };

    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);
        this.options = $.extend({}, defaults, options);
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
         init: function() {
            var that = this;

            // Bind toggler button
            this.$element.find('.submenu-toggler').click(function(e){
               e.preventDefault();
               that.toggle_sub($(this).siblings('ul'), $(this).find('i.fa'))
            });

         },
         toggle_sub: function($sub_ul, $icon){
            if($icon.hasClass('fa-plus')) $icon.removeClass('fa-plus').addClass('fa-minus');
            else $icon.removeClass('fa-minus').addClass('fa-plus');
            $sub_ul.slideToggle(this.options.speed, this.options.easing);

           
         }
    } // Plugin.prototype

    $.fn[pluginName] = function(options) {
        var args = [].slice.call(arguments, 1);
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName))
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            else if ($.isFunction(Plugin.prototype[options]))
                $.data(this, 'plugin_' + pluginName)[options].apply($.data(this, 'plugin_' + pluginName), args);
        });
    }
})(jQuery, window, document);







// ============================================================================
// Helpers
// ============================================================================


(window.onpopstate = function () {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = window.location.search.substring(1);

    window.urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();




})(jQuery);