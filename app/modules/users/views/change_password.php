<div class="ananas-block">
		<ul class="btns-list">
			<li>&nbsp;</li>
		</ul><!-- /btns-list end -->

		<div id="ajax_container"></div>

		<div class="head-box">
			<h3 class="ttl ttl3">Change Password</h3>
		</div><!-- /head-box end -->
		
<?php echo form_open("admin/users/change_password", 'id="change-password"'); ?>
		<div class="row">
		<label for="old_password">Old Password:</label>
		<?php echo form_password(array(
			'name'	=> 'old_password',
			'id'	=> 'old_password',
			'type'	=> 'password',
			'class'	=> 'txt',
		)); ?>
		</div>

		<div class="row">
		<label for="new_password">New Password:</label>
		<?php echo form_password(array(
			'name'	=> 'new_password',
			'id'	=> 'new_password',
			'type'	=> 'password',
			'class'	=> 'txt',
		)); ?>
		</div>

		<div class="row">
		<label for="new_password_confirm">Confirm New:</label>
		<?php echo form_password(array(
			'name'	=> 'new_password_confirm',
			'id'	=> 'new_password_confirm',
			'type'	=> 'password',
			'class'	=> 'txt',
		)); ?>
		</div>

	<?php echo form_input(array(
		'name'	=> 'user_id',
		'id'	=> 'user_id',
		'type'	=> 'hidden',
		'value'	=> $user_id,
	)); ?>

	<p><a href="#" class="asc-button small green" onclick="$('#change-password').submit();"><span><?php echo __('Change Password'); ?>&rarr;</span></a></p>
        <input type="submit" class="hidden-submit" />
<?php echo form_close();?>
</div>