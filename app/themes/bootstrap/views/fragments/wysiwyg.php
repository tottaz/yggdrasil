<script type="text/javascript" src="<?php echo BASE_URL?>app/themes/bootstrap/js/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<?php echo BASE_URL?>app/themes/bootstrap/js/ckeditor/adapters/jquery.js"></script>
<script type="text/javascript">

	var instance;

	function update_instance()
	{
		instance = CKEDITOR.currentInstance;
	}

	(function($) {
		$(function(){

			apps.init_ckeditor = function(){
				<?php echo $this->parser->parse_string(Settings::get('ckeditor_config'), $this, TRUE); ?>
				apps.init_ckeditor_maximize();
			};
			apps.init_ckeditor();

		});
	})(jQuery);
</script>
