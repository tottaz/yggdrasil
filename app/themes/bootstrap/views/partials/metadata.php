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