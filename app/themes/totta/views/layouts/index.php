<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
   <meta charset="utf-8">
   <!--[if IE]><meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'><![endif]-->

	<meta http-equiv="Content-Type" content="text/html" />	
   	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
	
	<title><?php echo $template['title']; ?></title>

	<meta name="description" content="">
	<meta name="keywords" content="">
	
	<link rel="shortcut icon" href="<?php echo site_url('favicon.ico'); ?>" />
	
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js"></script>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
	<script src="https://togetherjs.com/togetherjs-min.js"></script>

   <link href='http://fonts.googleapis.com/css?family=Oxygen:400,700' rel='stylesheet' type='text/css'>

	<script>
	apps = { 'lang' : {} };
	var APPPATH_URI		= "<?php echo APPPATH_URI;?>";
	var SITE_URL		= "<?php echo rtrim(site_url(), '/').'/';?>";
	var BASE_URL		= "<?php echo BASE_URL;?>";
	var BASE_URI		= "<?php echo BASE_URI;?>";
	var UPLOAD_PATH		= "<?php echo UPLOAD_PATH;?>";
	var DEFAULT_TITLE	= "<?php echo addslashes($this->settings->site_name); ?>";
	
	baseURL 					= '<?php echo substr((substr(site_url('ajax'), -1) == '/') ? site_url('ajax') : site_url('ajax').'/', 0, -5);?>';
	siteURL 					= '<?php echo rtrim(site_url(), '/');?>/';
	php_date_format 			= "<?php echo Settings::get('date_format');?>";
	datePickerFormat 			= "<?php echo get_date_picker_format();?>";
	storeTimeUrl 				= '<?php echo site_url('ajax/store_time');?>';
	submit_import_url			= '<?php echo site_url('admin/settings/submit_import/')?>';
	lang_loading_please_wait 	= '<?php echo addslashes(__('update:loadingpleasewait'));?>';
	apps.admin_theme_url		= "<?php echo BASE_URL . $this->admin_theme->path; ?>";
	apps.apppath_uri			= "<?php echo APPPATH_URI; ?>";
	apps.base_uri				= "<?php echo BASE_URI; ?>";
	apps.lang.remove			= "<?php echo lang('global:remove'); ?>";
	apps.lang.dialog_message	= "<?php echo lang('global:dialog:delete_message'); ?>";
	apps.csrf_cookie_name		= "<?php echo config_item('cookie_prefix').config_item('csrf_cookie_name'); ?>";
	apps.foreign_characters		= <?php echo json_encode(accented_characters()); ?>
	
	var globalSettings = {
		ajax_url: '<?php echo site_url('media/javascript/ajax_interface/')?>',
		javascript_url: '<?php echo site_url('media/javascript')?>/',
		expand_items: false,
		user: {
			id: <?php echo intval($current_user->id); ?>,
			username: '<?php echo $current_user->username; ?>'
		}
	}
	</script>

<?php
	Asset::css('style.css', array('media' => 'all'));
	Asset::css('bootstrap.css', array('media' => 'all'));
//	Asset::css('bootstrap-theme.css', array('media' => 'all'));
	Asset::css('custom.css', array('media' => 'all'));

    Asset::js('vendor/modernizr-2.6.2.min.js');
    Asset::js('vendor/jquery.touchSwipe.min.js');
	Asset::js('bootstrap/carousel.js');
	Asset::js('bootstrap/tab.js');
	Asset::js('bootstrap/collapse.js');
	Asset::js('bootstrap/transition.js');

//	<!--[if IE]><script type="text/javascript" src="js/vendor/excanvas.js"></script><![endif]-->

	Asset::js('vendor/jquery.knob.min.js');
	Asset::js('vendor/fastclick.min.js');
	Asset::js('vendor/jquery.stellar.min.js');

	Asset::js('vendor/jquery.mousewheel.js');
	Asset::js('vendor/perfect-scrollbar.min.js');

	Asset::js('vendor/isotope.pkgd.min.js');

	Asset::js('plugins.js');
	Asset::js('main.js');
	
	Asset::js('bootstrap.js');
	Asset::js('headroom/headroom.js');
	Asset::js('headroom/jQuery.headroom.js');
	Asset::js('jquery/jquery.cooki.js');
	Asset::js('custom.js');
	echo Asset::render();
	
	echo $template['metadata'];
	?>
</head>
<body class="menu-bar-opened menu-bar-ontop white-body">
     <script type="text/javascript">
         // Open page with hidden menu-bar on mobile screen less than 700px
         if(window.innerWidth < 738){
            var body_element = document.getElementsByTagName('body')[0];
            body_element.className = body_element.className.replace(/\bmenu-bar-opened\b/,'')
         }
      </script>
      <!--[if lt IE 9]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
      <![endif]-->

      <div id="wrapper">

		<topheader id="topheader">
			<div class="user-nav">
					<li>Welcome back <b><?php echo $current_user->username; ?> </b></li>
					<?php if (is_sadmin()) :?>
					<li><?php echo anchor('admin/apikey', __('global:apikey')); ?></li>
					<li><?php echo anchor('admin/settings', __('global:settings')); ?></li>
					<?php endif;?>
					<li><?php echo anchor('admin/users/logout', __('global:logout')); ?></li>
			</div>
		</topheader>

         <div id="menu-bar">
            <aside>
               <div class="mb-body">
                  <div class="mb-header hidden-xs">
					<a class="navbar-brand" href="<?php echo base_url();?>dashboard"><img src="<?php echo base_url();?>assets/img/yggdrasil.jpg" style='height:50px;' alt='App' /></a>
                  </div>
                  <div class="mb-content">
                     <nav>
                        <ul id="mb-main-menu">
                        <br>
							<?php if (is_sadmin() or isset($this->permissions['dashboard'])): ?>
								<li class=""> <?php echo anchor('dashboard', __('global:dashboard')); ?>
								</li>
							<?php endif ?>

					<?php if (is_sadmin() or isset($this->permissions['calendar'])): ?>
						<li><?php echo anchor('calendar', __('global:calendar')); ?> 
						</li>
					<?php endif ?>

					<?php if (is_sadmin() or isset($this->permissions['system'])): ?> 
						 <li class="menu-item-has-children">
							<a href="#"><?php echo lang('system:system'); ?></a>
	                          <a class="submenu-toggler" href="#"><i class="fa fa-plus"></i></a>
	                          <ul>
								<li><?php echo anchor('admin/system/cache', __('system:cache')); ?> </li>
								<li><?php echo anchor('admin/system/exporttables', __('system:export')); ?> </li>
								<li><?php echo anchor('admin/system/database', __('system:database')); ?></li>
								<li><?php echo anchor('admin/system/monitoring', __('system:serverstat')); ?> </li>
								<li class="divider"></li>
								<li><?php echo anchor('admin/system/logs', __('system:logs')); ?> </li>
								<li><?php echo anchor('admin/system/listapilogs', __('system:apilogs')); ?> </li>
								<li><?php echo anchor('admin/system/phpinfo', __('system:phpinfo')); ?> </li>
								<li class="divider"></li>
								<li><?php echo anchor('admin/modules', __('system:modules')); ?> </li>
							 </ul>
						</li>
						<?php endif ?>
						<?php if (is_sadmin() or isset($this->permissions['users'])): ?>
						<li>
							<?php echo anchor('admin/users', __('global:users')); ?>
						</li>

						<?php endif; ?>

						   <li><button class="btn btn-info" onclick="TogetherJS(this); return false;">Collaborate</button>
						   </li>
						   <br>
						   <li>
								<div class="progress">
								<?php if($percentageused < 80): ?>
									<div class="progress-bar" role="progressbar" aria-valuenow=<?php echo $percentageused ?> aria-valuemin="0" aria-valuemax="100" style="width: <?php echo $percentageused ?>">
									<?php echo $percentageused ?> <?php echo lang('system:diskspace');?>
									</div>
								<?php else: ?>
								    <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow=<?php echo $percentageused ?> aria-valuemin="0" aria-valuemax="100" style="width: <?php echo $percentageused ?>">
									<?php echo $percentageused ?> <?php echo lang('system:diskspace');?>
									</div>					    
								<?php endif; ?>
								</div>
							</li>
                        </ul>
                     </nav>
                  </div>
                  <div class="mb-footer">
                     <h4>About us</h4>
                     <p>Yggdrasil is based on Codeigniter 3.0</p>
                     <div class="mb-social">
                        <a href=""><i class="fa fa-twitter"></i></a>
                        <a href=""><i class="fa fa-facebook"></i></a>
                        <a href=""><i class="fa fa-google-plus"></i></a>
                        <a href=""><i class="fa fa-instagram"></i></a>
                        <a href=""><i class="fa fa-pinterest"></i></a>
                        <a href=""><i class="fa fa-tumblr"></i></a>
                     </div>
                  </div>
               </div> <!-- mb-body -->
               <a href="#" class="mb-toggler"><i class="fa fa-bars"></i></a>
            </aside>
         </div>


         <div id="main">

            <div id="header-mobile" class="visible-xs">
               <header>
                  <div class="m-header-body">
                     <a class="navbar-brand" href="<?php echo base_url();?>dashboard"><img src="<?php echo base_url();?>assets/img/yggdrasil.jpg" style='height:50px;' alt='App' /></a>
                  </div>
               </header>
            </div>

            <div id="header" class="hd-filters">
               <header>
                  <ul class="gallety-filters">
                     <li class="active"><a data-filter="home" href="#">Home</a></li>
                     <li><a data-filter="content" href="#">Content</a></li>
                     <li><a data-filter="growth" href="#">Growth</a></li>
                     <li><a data-filter="community" href="#">Community</a></li>
                     <li class="gf-underline"></li>
                  </ul>
               </header>
            </div>

	<?php if ($module != 'dashboard'): ?>
<!-- main-container -->
    <div>
        <ul class="breadcrumb">
            <li>
				<?php echo $module_details['name'] ?>
            </li>
        </ul>
    </div>

	<div id="breadcrumb">
		<ul class="nav nav-tabs">
			<?php if ( ! empty($module_details['sections'][$active_section]['shortcuts'])): ?>
				<?php foreach ($module_details['sections'][$active_section]['shortcuts'] as $shortcut):
					$name 	= $shortcut['name'];
					$uri	= $shortcut['uri'];
					unset($shortcut['name']);
					unset($shortcut['uri']); ?>
					<li><a <?php foreach($shortcut AS $attr => $value) echo $attr.'="'.$value.'"'; echo 'href="' . site_url($uri) . '"><span>' . lang($name) . '</span></a>'; ?></li>
				<?php endforeach; ?>
			<?php endif; ?>	
			<?php if ( ! empty($module_details['shortcuts'])): ?>
				<?php foreach ($module_details['shortcuts'] as $shortcut):
					$name 	= $shortcut['name'];
					$uri	= $shortcut['uri'];
					unset($shortcut['name']);
					unset($shortcut['uri']); ?>
					<li><a <?php foreach($shortcut AS $attr => $value) echo $attr.'="'.$value.'"'; echo 'href="' . site_url($uri) . '"><span>' . lang($name) . '</span></a>'; ?></li>
				<?php endforeach; ?>
			<?php endif; ?>
		</ul>
	</div><!-- /shortcuts -->
	<?php endif ?>

	<div class="section">
	   <section>
	      <div class="container">

		<?php echo $template['partials']['notifications']; ?>
		<?php echo $template['body']; ?>

		<?php  if ($module !== 'dashboard') { ?>

		<!-- end main-container -->
          </div> <!-- container -->
       </section>
    </div> <!-- section -->

	<!-- footer -->
	<footer id="footer">
		<div class="footer-inner">
			<div id="footer-wrap" class="container">
				<div class="col-md-4">
					<?php echo __('global:allrelatedmediacopyright', array(COPYRIGHT_YEAR, '<a href="http://torbjornzetterlund.com/">Yggdrisil</a>')); ?>
				</div>
				<div class="col-md-4">
					<p>Version <?php echo APP_VERSION; ?> &nbsp; -- &nbsp; Rendered in {elapsed_time} sec. using {memory_usage}.</p>
				</div>
				<div class="col-md-4">
<!--
					<ul id="lang">
						<form action="<?php echo current_url(); ?>" id="change_language" method="get">
							<select class="chzn" name="lang" onchange="this.form.submit();">
								<?php foreach($this->config->item('supported_languages') as $key => $lang): ?>
								<option value="<?php echo $key; ?>" <?php echo CURRENT_LANGUAGE == $key ? 'selected="selected"' : ''; ?>>
								<?php echo $lang['name']; ?>
								</option>
								<?php endforeach; ?>
							</select>
						</form>
					</ul>
-->
				</div>
			</div>
		</div>
	</footer>
	<!-- end footer -->
	<div class="scrollTop">
		<a href="javascript:void(0);">Scroll to Top</a>
	</div>
	<?php
	} 
	?>
     </div> <!-- main -->
  </div> <!-- wrapper -->

  <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
  <script>
     // (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
     // function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
     // e=o.createElement(i);r=o.getElementsByTagName(i)[0];
     // e.src='//www.google-analytics.com/analytics.js';
     // r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
     // ga('create','UA-XXXXX-X');ga('send','pageview');
  </script>
</body>
</html>