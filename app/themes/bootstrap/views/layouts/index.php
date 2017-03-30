<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
	<title><?php echo $template['title']; ?></title>
	
	<link rel="shortcut icon" href="<?php echo site_url('favicon.ico'); ?>" />

	<!-- This is a check to  to select which items should be shown for different groups - emily groups --> 	
	<?php if(ci()->current_user->group === "onboardadmin" or ci()->current_user->group === "onboardstaff") { ?>

		<?php
			Asset::css('bootstrap.css', array('media' => 'all'));
			Asset::css('bootstrap-theme.css', array('media' => 'all'));
			Asset::css('custom.css', array('media' => 'all'));

			Asset::js('jquery/jquery-1.10.2.js');
			Asset::js('jquery/jquery-ui.min-1.11.1.js');
			Asset::js('bootstrap.js');
			Asset::js('headroom/headroom.js');
			Asset::js('headroom/jQuery.headroom.js');
			Asset::js('jquery/jquery.cooki.js');
			Asset::js('custom.js');
			echo Asset::render();
			?>
	<?php } else { ?>
	
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js"></script>
		<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.1/jquery-ui.min.js"></script>
		<script src="https://togetherjs.com/togetherjs-min.js"></script>

		<?php
			Asset::css('bootstrap.css', array('media' => 'all'));
			Asset::css('bootstrap-theme.css', array('media' => 'all'));
			Asset::css('custom.css', array('media' => 'all'));
			
			Asset::js('bootstrap.js');
			Asset::js('headroom/headroom.js');
			Asset::js('headroom/jQuery.headroom.js');
			Asset::js('jquery/jquery.cooki.js');
			Asset::js('custom.js');
			echo Asset::render();
			?>
	<?php } ?>

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
		echo $template['metadata'];
	?>
</head>

<body class="<?php echo (isset($iframe)) ? ($iframe ? 'iframe' : '') : '';?>"> 
	<!-- top header -->
	<header id="header">		
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
		<nav class="navbar navbar-default" role="navigation">
			<!-- Brand and toggle get grouped for better mobile display -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="<?php echo base_url();?>dashboard"><img src="<?php echo base_url();?>assets/img/yggdrasil.jpg" style='height:50px;' alt='App' /></a>
			</div>

			<!-- Collect the nav links, forms, and other content for toggling -->
			<div class="collapse navbar-collapse" id="bs-navbar-collapse-1">
				<ul class="nav navbar-nav">
					<?php if (is_sadmin() or isset($this->permissions['dashboard'])): ?>
					<li class=""> <?php echo anchor('dashboard', __('global:dashboard')); ?>
					</li>
					<?php endif ?>
				
				<?php if (is_sadmin() or isset($this->permissions['calendar'])): ?>
					<li><?php echo anchor('calendar', __('global:calendar')); ?> 
					</li>
				<?php endif ?>

				<?php if (is_sadmin() or isset($this->permissions['newssearch'])): ?>
					<li><?php echo anchor('newssearch', __('global:newssearch')); ?> 
					</li>
				<?php endif ?>

				<?php if (is_sadmin() or isset($this->permissions['itreports'])): ?>
					<li><?php echo anchor('itreports', __('global:itreports')); ?> 
					</li>
				<?php endif ?>

				<?php if (is_sadmin() or isset($this->permissions['maps'])): ?>
					<li><?php echo anchor('maps', __('global:maps')); ?> 
					</li>
				<?php endif ?>

				<?php if (is_sadmin() or isset($this->permissions['system'])): ?> 
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown"><?php echo lang('system:system'); ?> <b class="caret"></b></a>
						<ul class="dropdown-menu">
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
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown"><?php echo lang('global:users'); ?> <b class="caret"></b></a>
						<ul class="dropdown-menu">
							<li class=""><?php echo anchor('admin/users', __('global:users')); ?></li>
							<li><?php echo anchor('admin/groups', __('global:groups')); ?> </li>
						 </ul>
					</li>
					<?php endif; ?>		

					<?php if (is_sadmin()): ?>
						<li>
							<button class="btn btn-info" onclick="TogetherJS(this); return false;">Collaborate</button>
						</li>
					<?php endif; ?>
				</ul>
				<br>
				<?php if (is_sadmin()): ?>			
					<ul class="">
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
					</ul>
				<?php endif; ?>
			</div>
		</nav>
	</header>
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

<?php echo $template['partials']['notifications']; ?>
<?php echo $template['body']; ?>

<?php  if ($module !== 'dashboard') { ?>

<!-- end main-container -->
	<!-- footer -->
	<footer id="footer">
		<div class="footer-inner">
			<div id="footer-wrap" class="container">
				<div class="col-md-4">
					<?php echo __('global:allrelatedmediacopyright', array(COPYRIGHT_YEAR, '<a href="http://greenpeace.org/">Greenpeace.org</a>')); ?>
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
</body>
</html>