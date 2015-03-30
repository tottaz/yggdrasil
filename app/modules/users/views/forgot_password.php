<div class="ananas-block">
	<div id="login-box">
	<?php echo form_open("admin/users/forgot_password", 'id="forgot-password-form"');?>
	<fieldset>
	<p><?php echo lang('login:forgotinstructions') ?></p>

		<div class="row">
			<label for="email"><?php echo lang('login:email') ?>:</label>
      		<?php echo form_input(array(
				'name'	=> 'email',
				'id'	=> 'email',
				'type'	=> 'text',
				'class'	=> 'txt',
				'value' => set_value('email'),
			));?>
      </div>

      <div class="row">
			
			<p><a href="#" class="asc-button small green" onclick="document.getElementById('forgot-password-form').submit();"><span><?php echo lang('login:reset') ?></span></a> </p>
			
	  </div>
	
		<div id="cancel">
<p style="clear:both; margin:30px 0 0 0"><?php echo anchor('admin/',  lang('login:cancel'), 'id="cancel"'); ?> </p> 
		</div><!-- /cancel -->
<input type="submit" class="hidden-submit" />
<?php echo form_close();?>