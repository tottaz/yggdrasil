<div class="container">
<?php if ($setting_sections): ?>
	<?php echo form_open('admin/settings/edit', 'class="crud"'); ?>

      <ul id="myTab" class="nav nav-tabs">        
            <?php foreach ($setting_sections as $section_slug => $section_name): ?>
            <li>
                    <a href="#<?php echo $section_slug; ?>" title="<?php printf(lang('settings_section_title'), $section_name); ?>" data-toggle="tab">
                            <?php echo $section_name; ?>
                    </a>
            </li>
            <?php endforeach; ?>
      </ul>
      <div id="myTabContent" class="tab-content">
         <?php foreach ($setting_sections as $section_slug => $section_name): ?>

        <div class="tab-pane fade in" id="<?php echo $section_slug; ?>">
                <fieldset>
                        <?php $section_count = 1; foreach ($settings[$section_slug] as $setting): ?>
                            <div class="form-group">                         
                                <div id="<?php echo $setting -> slug; ?>" class="<?php echo $section_count++ % 2 == 0 ? 'even' : ''; ?>">
                                        <label for="<?php echo $setting -> slug; ?>">
                                                <h6><?php echo $setting -> title; ?></h6>
                                                <?php
												if ($setting -> description) : echo '<small>' . $setting -> description . '</small>';
												endif;
 ?>
                                        </label>

                                        <div class="input <?php echo 'type-' . $setting -> type; ?>">
                                                <?php echo $setting -> form_control; ?>
                                        </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                </fieldset>
        </div>
        <?php endforeach; ?>
      </div>
            <div class="buttons padding-top">
                    <?php $this->load->view('partials/buttons', array('buttons' => array('save'))); ?>
            </div>
	<?php echo form_close(); ?>
<?php else: ?>
	<div>
		<p><?php echo lang('settings_no_settings'); ?></p>
	</div>
<?php endif; ?>

</div>

</section>
<script type="text/javascript">
	$(document).ready(function () {
		$('#myTab a').click(function (e) {
			e.preventDefault()
			$(this).tab('show')
		});
			
	$('#myTab a:first').tab('show'); // Select first tab

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        e.target // activated tab
        e.relatedTarget // previous tab
    });
      
    $('.smtp, .gapps, .gmail, .sendmail, .secure_smtp').hide();
    $('.'+$('[name=email_server]').val()).show();
    
    $('[name=email_server]').change(function() {
	if ($('.smtp:visible, .secure_smtp:visible, .gapps:visible, .gmail:visible, .sendmail:visible').length > 0) {
	    $('.smtp:visible, .secure_smtp:visible, .gapps:visible, .gmail:visible, .sendmail:visible').slideUp(function() {
		$('.'+$('[name=email_server]').val()).slideDown();
	    });
	} else {
	    $('.'+$('[name=email_server]').val()).slideDown();
	}
	
    });
    
	$('.form_error').parent().find('input').addClass('error');
	
	$('#rss_type').change(function () {
		update_rss_link();
	});

	$('#rss_items').keyup(function () {
		update_rss_link();
	});

	function update_rss_link()
	{
		var type = $('#rss_type').val();
		var items = $('#rss_items').val();
		var password = $('#rss_password').val();

		var link = '<?php echo site_url('feeds'); ?>/'+type+'/'+items+'/'+password

		$('#rss_link_gen').html('<a href="'+link+'">'+link+'</a>');
	}
	update_rss_link();
	
	function random_string(string_length) {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
		var randomstring = '';
		for (var i=0; i<string_length; i++) {
			var rnum = Math.floor(Math.random() * chars.length);
			randomstring += chars.substring(rnum,rnum+1);
		}
		return randomstring;
	}
});
</script>