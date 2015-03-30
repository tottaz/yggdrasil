(function($) {
"use strict";


$(document).ready(function()
{

   if(urlParams['960px'] != undefined) $('body').addClass('cont-960');

   $('#menu-bar').mental_menu_bar();

   $('#mb-main-menu').mental_menu();

   //  Start pie charts
   $(".knob").knob({
      draw : function () {
         // Add percents to value
         if(this.$.data('percents') == true) {
            $(this.i).val(this.cv + '%')
         }
      }
   });
   $(".knob").css({'font-size':'26px', 'color':'#444649'});

   // Init page animation if not on touch device
   if(!Modernizr.touch) animate_init();

   // Init Parallax - stellar.js
   $.stellar({
      responsive:true,
      horizontalScrolling: false
   });

   // Menu bar scrollbar
   $('.mb-body').css({position: 'relative', overflow: 'hidden'}).perfectScrollbar({
     wheelSpeed: 20,
     wheelPropagation: false,
     suppressScrollX: true
   });

   // Isotope Init
   if($.fn.isotope){
      init_blog_vertical_isotope();
      init_blog_masonry_isotope();
      init_gallery_isotope();
      init_gallery_w_preview();
      init_gallery_pinterest();
   }

   init_gallery_filters_underline();

   // Layerslider
   if($.fn.layerSlider){
      init_layer_slider();
   }

   // Menu
   if($.fn.mtmenu){ $().mtmenu();
      init_smooth_scrolling();
      init_fixed_topbar();
   }


   // Full height fix
   function resizeVideoJSHeight(){$('.container-fullheight').height(window.innerHeight);}
   $(window).resize(function(){resizeVideoJSHeight();});
   $(window).load(function(){resizeVideoJSHeight();});
   setTimeout(function() {resizeVideoJSHeight();}, 1);

   init_video_background();

   init_creative_mind();

   // Init Validation Engine
   if($.fn.validationEngine){
      $(".validation-engine").validationEngine();
   }

   init_ajax_forms();

   // Activate Fastclick (have to be loaded last)
   new FastClick(document.body);


}); // Document ready

















// ============================================================================
// Startup animations
// ============================================================================


function animate_init()
{

   // Add animate class where data-animate attribute is set
   var
      startTopOfWindow = $(window).scrollTop();

   $('[data-animate]').each(function(){
      if($(this).offset().top + $(this).height() > startTopOfWindow)
         $(this).addClass('animated');
   });

   // Remove style for progress bars on start
   $('.progress-bar.animate').each(function(){
      var $this = $(this);
      // Remove progress-bar class and return it on timeout fo cancel transition animation
      $this.removeClass('progress-bar').css('width','');
      setTimeout(function(){$this.addClass('progress-bar')},10);
   });

   // Animate on page start
   setTimeout(function(){animate_on_scroll()}, 50);

   // Anitame elements on scroll
   $(window).bind('scroll.vmanimate', function() {
      animate_on_scroll();
   });

   // Remove classes after animate is complete
   $('.animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      $(this).removeClass('animated').removeClass($(this).data('animate'));
   });

   function animate_on_scroll()
   {
      var topOfWindow = $(window).scrollTop();
      var bottomOfWindow = topOfWindow + $(window).height();
      var $elms = $('.animated, .animate').each(function(){
         var $this = $(this);
         if ($this.offset().top + 100 < bottomOfWindow)
         {
            if($this.hasClass('knob'))
               animate_knob($this);
            else if($this.hasClass('progress-bar'))
               animate_progress($this);
            else if($this.hasClass('animate-number'))
               animate_number($this);
            else
               $this.addClass($this.data('animate'));
         }
      });
      if($elms.length == 0) $(window).unbind('scroll.vmanimate');
   }

   function animate_knob($knob)
   {
      // Animate once
      $knob.removeClass('animate');
      var myVal = parseInt($knob.val());

      $({value: 0}).animate({value: myVal}, {
         duration: 1500,
         easing:'swing',
         step: function() {
            $knob.val(Math.ceil(this.value)).trigger('change');
         }
      });
   }

   function animate_progress($progress)
   {
      // Animate once
      $progress.removeClass('animate');

      var valStart = parseInt($progress.attr('aria-valuemin'));
      var myVal = parseInt($progress.attr('aria-valuenow'));
      var $value = $progress.parent().siblings('.value');

      // Transitions animation
      $progress.css({width: myVal+'%'});

      $({value: valStart}).animate({value: myVal}, {
         duration: 1500,
         easing:'swing',
         step: function() {
            $value.text(this.value.toFixed()+'%');
         }
      })
   }

   function animate_number($block)
   {
      // Animate once
      $block.removeClass('animate');

      var valStart = 0;
      var myVal = parseInt($block.text().replace(' ',''));

      $({value: valStart}).animate({value: myVal}, {
         duration: 1500,
         easing:'swing',
         step: function() {
            $block.text(this.value.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, " "));
         }
      })
   }

} // animate_init



// ============================================================================
// Layer Slider
// ============================================================================

function init_layer_slider()
{
   // Onepage 100% height
   $('.ls-fullheight').height(window.innerHeight);
   // Usual slider
   $('#layerslider').layerSlider({
      sublayerContainer : 1170,
      skin: 'mental',
      skinsPath: 'assets/plugins/layerslider/skins/',
      showBarTimer        : true,
      showCircleTimer     : false,
      pauseOnHover: false
   });

   // Single Work style 1
   $('#layerslider-singlework1').layerSlider({
      skin: 'mental',
      skinsPath: 'assets/plugins/layerslider/skins/',
      showBarTimer        : true,
      showCircleTimer     : false,
      pauseOnHover: false,
      autoStart: false,
      cbAnimStart: function(data){
         $('#lsmb-title').text(data.nextLayer.data('title'));
      }
   });

   // Single Work style 2
   $('#layerslider-singlework2').layerSlider({
      sublayerContainer : 1170,
      skin: 'mental',
      skinsPath: 'assets/plugins/layerslider/skins/',
      showBarTimer        : true,
      showCircleTimer     : false,
      pauseOnHover: false,
      autoStart: false,
      cbAnimStart: function(data){
         $('.ls-mn-counter').html('<em>'+pad(data.nextLayerIndex, 2)+'</em>/'+pad(data.layersNum, 2));
      }
   });
   $('.ls-mn-prev').click(function(e){e.preventDefault(); $('#layerslider-singlework2').layerSlider('prev');});
   $('.ls-mn-next').click(function(e){e.preventDefault(); $('#layerslider-singlework2').layerSlider('next');});

   function pad (str, max) {
      str = str.toString();
      return str.length < max ? pad("0" + str, max) : str;
   }

   // Single Work with thumbnails
   $('#layerslider-singlework-thumbs').layerSlider({
      sublayerContainer : 1170,
      skin: 'mental',
      skinsPath: 'assets/plugins/layerslider/skins/',
      showBarTimer        : true,
      showCircleTimer     : false,
      pauseOnHover: false,
      autoStart: false,
      thumbnailNavigation: 'always',
      tnWidth: 170,
      tnHeight: 110,
      tnActiveOpacity: 100,
      tnInactiveOpacity: 40,
      tnContainerWidth: '80%',
      cbAnimStart: function(data){
         $('#lsmb-title').text(data.nextLayer.data('title'));
      }
   });

   // Onepage - Scroll under slider on click on round white arrow
   $('.ls-mental-scrollunder').click(function(e){
      e.preventDefault();
      $('html, body').animate({
            scrollTop: $('#layerslider').outerHeight(true)+40
         }, 1000);
   });
}


// ============================================================================
// Isotope Gallery
// ============================================================================

function init_gallery_isotope()
{
   var $gallery = $('#gallery');
   if($gallery.length == 0) return;

   // Isotope
   $gallery.isotope({
      itemSelector: '.gl-item',
      resizable: false,
      layoutMode: 'masonry'
   });

   // Remove min-height for gl-item when image loaded on home page
   process_images_load();

   // Filter items
   $('.gallety-filters').on( 'click', '> li > a', function(e) {
      e.preventDefault();

      $('.gallety-filters > li').removeClass('active');
      $(this).closest('li').addClass('active');

      var filterValue = $(this).attr('data-filter');
      var that = this;
      $gallery.isotope({
         filter: function() {
            if(filterValue == '*') return true;
            return $.inArray(filterValue, $(this).data('category').split(/[\s,]+/)) != -1;
         }
      });
   });


   // Load more
   $('.footer-loadmore').on( 'click', function(e) {
      e.preventDefault();
      var $this = $(this).hide();
      var $spinner = $(this).siblings('.loading-spinner').show();

      $.ajax({
         type: "POST",
         url: 'ajax/gallery.html',
         data: JSON.stringify({
            active_category: $('.gallety-filters li.active a').data('filter'),
            offset: $gallery.find('.gl-item').length,
            somedata: 'some data'
         }),
         success: function (data) {
            // Get elements from request
            var $elems = $('<div>'+data+'</div>').find('.gl-item');
            // append elements to container
            $gallery.append( $elems )
               // add and lay out newly appended elements
               .isotope( 'appended', $elems );
               
            process_images_load();
         },
         complete: function () {
            $spinner.hide();
         },
         error: function (jqXHR, textStatus) {
            console.log(textStatus);
         }
      });

   });

   function process_images_load(){
      // Remove min-height for gl-item when image loaded on home page
      $gallery.find('.gl-loading img').one('load', function() {
         $(this).closest('.gl-loading').removeClass('gl-loading');;
         $gallery.isotope();
      }).each(function(){if(this.complete) $(this).load();});
   }

   $('#menu-bar').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
       $gallery.isotope('layout');
   });

}



// ============================================================================
// Isotope Gallery with expanding previews
// ============================================================================

function init_gallery_w_preview()
{
   // =========== Variables

   var $gallery = $('#gallery-w-preview');
   if($gallery.length == 0) return false;

   var $last_clicked_item = $();
   var screen_sm = 768;
   var screen_md = 992;
   var screen_lg = 1200;

   var $gallery = $('.gallery');
   var $gl_items = $();
   refresh_items_order_data();
   var columns = calc_columns();

   // Isotope
   $gallery.isotope({
      itemSelector: '.gl-item',
      resizable: false,
      layoutMode: 'masonry',
      sortBy: 'origorder',
      getSortData: {
          origorder: function( itemElem ) {
            return $(itemElem).data('order');
          }
        }
   });

   // Remove min-height for gl-item when image loaded on home page
   process_images_load();

   // Filter items
   $('.gallety-filters').on( 'click', '> li > a', function(e) {
      e.preventDefault();
      remove_preview();
      $gl_items = $gallery.find('.gl-item:not(.gl-preview):visible');

      $('.gallety-filters > li').removeClass('active');
      $(this).closest('li').addClass('active');
      var filterValue = $(this).attr('data-filter');
      var that = this;
      $gallery.isotope({
         filter: function() {
            if(filterValue == '*') return true;
            return $.inArray(filterValue, $(this).data('category').split(/[\s,]+/)) != -1;
         }
      });
   });

   // Load more
   $('.footer-loadmore').on( 'click', function(e) {
      e.preventDefault();
      remove_preview();
      var $this = $(this).hide();
      var $spinner = $(this).siblings('.loading-spinner').show();

      $.ajax({
         type: "POST",
         url: 'ajax/gallery-previews.html',
         data: JSON.stringify({
            active_category: $('.gallety-filters li.active a').data('filter'),
            offset: $gallery.find('.gl-item').length,
            somedata: 'some data'
         }),
         success: function (data) {
            // Get elements from request
            var $elems = $('<div>'+data+'</div>').find('.gl-item');
            // append elements to container
            $gallery.append( $elems )
               // add and lay out newly appended elements
               refresh_items_order_data();
            $gallery.isotope( 'appended', $elems );
               
            process_images_load();
            
         },
         complete: function () {
            $spinner.hide();
         },
         error: function (jqXHR, textStatus) {
            console.log(textStatus);
         }
      });
   });

   function process_images_load(){
      // Remove min-height for gl-item when image loaded on home page
      $gallery.find('.gl-loading img').one('load', function() {
         $(this).closest('.gl-loading').removeClass('gl-loading');;
         $gallery.isotope();
      }).each(function(){if(this.complete) $(this).load();});
   }

   function refresh_items_order_data(){
      $gl_items = $gallery.find('.gl-item:visible').each(function(){ $(this).attr('data-order', ($(this).index()+1)*10); })
   }

   $('#menu-bar').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
       $gallery.isotope('layout');
   });

   // =================================  Preview Part

   // ==== On item Click
   $gallery.on('click', '.gl-item:not(.gl-preview) > a', function(e){
      e.preventDefault();
      var $this = $(this).parent();

      remove_preview();

      if(!$last_clicked_item.is($this)) show_preview($this);
      else $last_clicked_item = $();

   });

   // Close button
   $gallery.on('click', '.glp-close', function(e){
      e.preventDefault();
      remove_preview();
      $last_clicked_item = $();
   });

   // Zoom In image
   $gallery.on('click', '.glp-zoom', function(e){
      e.preventDefault();
      var $img = $(this).siblings('img');
      $img.attr('orig-src',$img.attr('src'));
      $img.addClass('glp-zoomed').attr('src',$(this).attr('href'));
   });

   // Zoom Out image
   $gallery.on('click', '.glp-zoomed', function(e){
      $(this).removeClass('glp-zoomed').attr('src', $(this).attr('orig-src'));
   });

   // Zoomed image moving
   $gallery.on('mousemove', '.glp-zoomed', function(e){
      var $this = $(this);
      var ratio = (e.pageY-$(window).scrollTop())/(window.innerHeight);
      $this.css({top: -Math.ceil(ratio*($this.height()-window.innerHeight))+'px'});
   });



   // === On window resize
   $(window).resize(function(){
      remove_preview();
      columns = calc_columns();
      $last_clicked_item = $();
   });


   // ======= Functions

   function calc_columns()
   {
      var columns = window.innerWidth < screen_sm ? 1
            : window.innerWidth < screen_md ? 2
            : window.innerWidth < screen_lg ? 3
            :    $gallery.hasClass('gl-cols-3') ? 3 
               : $gallery.hasClass('gl-cols-4') ? 4
               : $gallery.hasClass('gl-cols-5') ? 5 
               : 4;
      return columns;
   }

   function scroll_to_preview($preview)
   {
      setTimeout(function() {
         $('html, body').animate({
            scrollTop: $preview.offset().top - (window.innerHeight - $preview.outerHeight(true))/2 - 25
         }, 500);
      }, 300);

   }

   function remove_preview()
   {
      var $preview = $gallery.find('> .gl-preview');
      if($preview.length) $gallery.isotope('remove', $preview).isotope('layout');
   }

   function show_preview($item)
   {
      var item_index = $item.siblings(":visible").andSelf().index($item);
      var $preview = $item.find('.gl-preview');
      var $temp_preview = insert_preview($item, item_index, $preview);

      set_arrow(item_index, $temp_preview);
      setTimeout(function(){$gallery.isotope('layout');},10);
      scroll_to_preview($temp_preview);
      // Fix bootstrap caorusel, set unique ids
      carousel_fix($temp_preview.find('.carousel'));
      $last_clicked_item = $item;
   }

   function insert_preview($item, item_index, $preview)
   {
      var row_index = Math.floor(item_index / columns);
      var last_in_row_index = (row_index+1)*columns;
      var $gl_items_visible = $gallery.find('.gl-item:not(.gl-preview):visible');
      if(last_in_row_index > $gl_items_visible.length-1) // If bigger that items count, set last item
         last_in_row_index = $gl_items_visible.length;
      var last_in_row_order = $gl_items_visible.eq(last_in_row_index-1).data('order');
      var preview_order = last_in_row_order+1;

      var $temp_preview = $('<li class="gl-item gl-preview" data-category="'+$item.data('category')+'" data-order="'+preview_order+'">'+$preview.html()+'</li>');
      
      $gallery.append($temp_preview.show());
      $gallery.isotope('insert', $temp_preview);

      // Reyalout when image is loaded
      $temp_preview.find('img').one('load', function() {$gallery.isotope('layout');});

      return $temp_preview;
   }

   function set_arrow(item_index, $temp_preview)
   {
      var row_index = Math.floor(item_index / columns);
      var row_item_index = item_index - ((row_index+1)*columns - columns);
      $temp_preview.find('.glp-arrow').css({left: ((row_item_index+1)*(100/columns))-(100/columns/2)+'%' });
   }

   function carousel_fix($carousel)
   {
      var new_id = $carousel.attr('id')+'-a';
      $carousel.attr('id', new_id);
      $carousel.find('.carousel-control').attr('href', '#' + new_id);
      $carousel.find('.carousel-indicators li').attr('data-target', '#' + new_id);

      $carousel.carousel();
   }

} // init_gallery_w_preview



// ============================================================================
// Isotope for Gallery Pinterest style
// ============================================================================

function init_gallery_pinterest()
{
   var $gallery = $('#gallery_pinterest');
   if($gallery.length == 0) return;

   // Isotope
   $gallery.isotope({
      itemSelector: '.gl-item',
      resizable: false,
      layoutMode: 'masonry'
   });

   // Remove min-height for gl-item when image is loaded on home page
   process_images_load();

   // Filter items
   $('.gallety-filters').on( 'click', '> li > a', function(e) {
      e.preventDefault();

      $('.gallety-filters > li').removeClass('active');
      $(this).closest('li').addClass('active');

      var filterValue = $(this).attr('data-filter');
      var that = this;
      $gallery.isotope({
         filter: function() {
            if(filterValue == '*') return true;
            return $.inArray(filterValue, $(this).data('category').split(/[\s,]+/)) != -1;
         }
      });
   });

   // Load more
   $('.footer-loadmore').on( 'click', function(e) {
      e.preventDefault();
      var $this = $(this).hide();
      var $spinner = $(this).siblings('.loading-spinner').show();

      // ===== Demo code, just clones current items, needs to be replaced by actual one =====
         var $elems = $('.gl-item').clone(true).slice(0,12);
         setTimeout(function(){
            // append elements to container
            $gallery.append( $elems )
               // add and lay out newly appended elements
               .isotope( 'appended', $elems );
            $spinner.hide();
            $this.show();
         }, 500);
      // End Demo code

      $.ajax({
         type: "POST",
         url: 'ajax/gallery-pinterest.html',
         data: JSON.stringify({
            active_category: $('.gallety-filters li.active a').data('filter'),
            offset: $gallery.find('.gl-item').length,
            somedata: 'some data'
         }),
         success: function (data) {
            // Get elements from request
            var $elems = $('<div>'+data+'</div>').find('.gl-item');
            // append elements to container
            $gallery.append( $elems )
               // add and lay out newly appended elements
               .isotope( 'appended', $elems );
               
            process_images_load();
         },
         complete: function () {
            $spinner.hide();
         },
         error: function (jqXHR, textStatus) {
            console.log(textStatus);
         }
      });

   });

   function process_images_load(){
      // Remove min-height for gl-item when image loaded on home page
      $gallery.find('.gl-loading img').one('load', function() {
         $(this).closest('.gl-loading').removeClass('gl-loading');;
         $gallery.isotope();
      }).each(function(){if(this.complete) $(this).load();});
   }

   $('#menu-bar').on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function() {
       $gallery.isotope('layout');
   });
}



// ============================================================================
// Isotope for usual Blog
// ============================================================================

function init_blog_vertical_isotope()
{
   // Isotope
   $('.isotope-vertical').isotope({
      itemSelector: '.isotope-item',
      resizable: false,
      layoutMode: 'vertical',
      vertical: { horizontalAlignment: 0.5 }
   });

   // Redo isotope when image loaded
   $('.isotope-vertical img').one('load', function() {
      $('.isotope-vertical').isotope();
   }).each(function(){if(this.complete) $(this).load();});

   // Load more
   $('.footer-loadmore').on( 'click', function(e) {
      e.preventDefault();
      var $this = $(this).hide();
      var $spinner = $(this).siblings('.loading-spinner').show();

      // ===== Demo code, just clones current items, needs to be replaced by actual one =====
         var $elems = $('.isotope-item').clone(true).slice(0,12);
         setTimeout(function(){
            // append elements to container
            $('.isotope-vertical').append( $elems )
               // add and lay out newly appended elements
               .isotope( 'appended', $elems );
            $spinner.hide();
            $this.show();
         }, 500);
      // End Demo code
   });
}


// ============================================================================
// Isotope for masonry Blog
// ============================================================================

function init_blog_masonry_isotope()
{
   // Isotope
   $('.isotope-masonry').isotope({
      itemSelector: '.isotope-item',
      resizable: false,
      layoutMode: 'masonry'
   });

   // Redo isotope when image loaded
   $('.isotope-masonry img').one('load', function() {
      $('.isotope-masonry').isotope();
   }).each(function(){if(this.complete) $(this).load();});

   // Load more
   $('.footer-loadmore').on( 'click', function(e) {
      e.preventDefault();
      var $this = $(this).hide();
      var $spinner = $(this).siblings('.loading-spinner').show();

      // ===== Demo code, just clones current items, needs to be replaced by actual one =====
         var $elems = $('.isotope-item').clone(true).slice(0,12);
         setTimeout(function(){
            // append elements to container
            $('.isotope-masonry').append( $elems )
               // add and lay out newly appended elements
               .isotope( 'appended', $elems );
            $spinner.hide();
            $this.show();
         }, 500);
      // Edn Demo code
   });
}



// ============================================================================
// Smooth scrolling while scrolling to element ID
// ============================================================================

function init_smooth_scrolling()
{
   //if('#'+$(this.hash).length == 0) return;
   var fixed_topbar_height = $('body').data('offset')-5;
   $("li > a[href^='#']").on('click', function(e) {
      // prevent default anchor click behavior
      e.preventDefault();
      // add hash to url
      history.pushState(null,null,this.hash);
      // animate
      $('html, body').animate({
          scrollTop: $(this.hash).offset().top - fixed_topbar_height
      }, 1000);
   });
}



// ============================================================================
// Fixed top Menu Bar
// ============================================================================

function init_fixed_topbar()
{
   var offset = 0;
   var $top_menu = $('.top-menu.tm-fixonscroll');
   if(!$top_menu.length) return;
   var top_menu_offset = $top_menu.offset();

   $(window).scroll(function () {
      if ($(window).scrollTop() > top_menu_offset.top+offset) {
         $top_menu.addClass('tm-fixed');
      } else {
         $top_menu.removeClass('tm-fixed');
      }
    });
}



// ============================================================================
// Gallery filters moving on hover underline
// ============================================================================

function init_gallery_filters_underline()
{
   $('.gallety-filters >li:not(.gf-underline)').hover(function(){
      go_to_item($(this));
   },function(){
      go_to_item($(this).siblings('.active'));
   });

   function go_to_item($item)
   {
      if($item.length == 0) return;
      var parent_left = $item.parent().length ? $item.parent().offset().left : 0;
      var offset = $item.offset().left - parent_left;
      $item.siblings('.gf-underline').css({left: offset, width: $item.width()});
   }
}





// ============================================================================
// Video background
// ============================================================================

function init_video_background()
{

   var $video_container = $('.st-video-background');
   var $video = $video_container.find('video');

   var vid_w_orig = parseInt($video.attr('width'));
   var vid_h_orig = parseInt($video.attr('height'));

   $(window).resize(function () { resizeToCover(); });
   resizeToCover();

   function resizeToCover() {
      // use largest scale factor of horizontal/vertical
      var scale_h = $video_container.width() / vid_w_orig;
      var scale_v = $video_container.height() / vid_h_orig;
      var scale = scale_h > scale_v ? scale_h : scale_v;
      // scale the video
      $video.width(scale * vid_w_orig);
      $video.height(scale * vid_h_orig);
      // center it by scrolling the video viewport
      $video_container.scrollLeft(($video.width() - $(window).width()) / 2);
      $video_container.scrollTop(($video.height() - $(window).height()) / 2);
   }

   // Firefox fix: play in loop
   $video.bind('ended', function(){
      this.play();
   });
}





// ============================================================================
// Creative Mind Block
// ============================================================================

function init_creative_mind()
{
   $('.cm-item').hover(function(){
      var $this = $(this);
      var $creative_minds = $this.closest('.creative-minds');
      $creative_minds.find('.col-cm').removeClass('active');
      $this.closest('.col-cm').addClass('active');

      // $title = $creative_minds.find('.cm-title');
      // $descr = $creative_minds.find('.cm-descr');
      // $title.text($this.data('title'));
      // $descr.text($this.data('descr'));
   });
}


// ============================================================================
// Send form using Ajax
// ============================================================================

function init_ajax_forms()
{
   $('.ajax-send').submit(function(e){
      e.preventDefault();
      var $this = $(this);
      var action = $this.attr('action');

      if(!$this.validationEngine('validate')) return false;

      var $spinner = $this.find('.loading-spinner').show();

      $.ajax({
         type: "POST",
         url: 'formmail.php',
         data: $this.serialize(), // serializes the form's elements.
         success: function(data){
            $this.find('input[type=text], input[type=email], textarea').val(''); // Clear form
            $this.prepend('<div class="alert alert-success">Your message was sent!</div>'); // Show success message
         },
         complete: function(jqXHR, textStatus){
            $spinner.hide();
         },
         error: function(jqXHR, textStatus, errorMessage) {
            console.log(errorMessage);
         }
      });

   });
}




})(jQuery);
