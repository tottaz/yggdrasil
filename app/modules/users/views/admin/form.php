<div class="container">

<div class="head-box">
	<h3 class="ttl ttl3">Edit User</h3>
</div><!-- /head-box end -->

<?php echo form_open("admin/users/edit/".$member->id, 'id="user-form"');?>

<fieldset>

	<div id="ananas-type-block" class="form">

		<div class="form-group">
		<label for="username">Username:</label>
		<?php echo form_input(array(
			'name'	=> 'username',
			'id'	=> 'username',
			'type'	=> 'text',
			'class'	=>	'txt',
			'disabled' => true,
			'value'	=> $member->username,
		));?>
		</div>

		<div class="form-group">
		<label for="email">Email:</label>
		<?php echo form_input(array(
			'name'	=> 'email',
			'id'	=> 'email',
			'type'	=> 'text',
			'class'	=>	'txt',
			'value'	=> $member->email,
		)); ?>
		</div>
		
		<div class="form-group">
		<label for="first_name">First Name:</label>
		<?php echo form_input(array(
			'name'	=> 'first_name',
			'id'	=> 'first_name',
			'type'	=> 'text',
			'value'	=> $member->first_name,
			'class'	=>	'txt',
		)); ?>
		</div>

		<div class="form-group">
		<label for="last_name">Last Name:</label>
		<?php echo form_input(array(
			'name'	=> 'last_name',
			'id'	=> 'last_name',
			'type'	=> 'text',
			'class'	=>	'txt',
			'value'	=> $member->last_name,
		));?>
		</div>
			
		<div class="form-group">
		<label for="password">Password:</label>
		<?php echo form_password(array(
			'name'	=> 'password',
			'id'	=> 'password',
			'type'	=> 'password',
			'class'	=>	'txt',
			'disabled'
		));?>
		</div>

		<div class="form-group">
		<label for="password_confirm">Confirm Password:</label>
		<?php echo form_password(array(
			'name'	=> 'password_confirm',
			'id'	=> 'password_confirm',
			'type'	=> 'password',
			'class'	=>	'txt',
		));?>
		</div>

		<div class="form-group">
		<label for="group_id">Group:</label>
		<div class="sel-item">
		<?php echo form_dropdown('group_id', $groups, $member->group_id);?>
		</div>
		</div>

		<div class="row">
		<a href="#" onclick="$('#user-form').submit()" class="btn btn-success btn-sm"><span><?php echo lang('global:save') ?></span></a>
		</div>
		</div>
	</fieldset>
<!--            <input type="submit" class="hidden-submit" /> -->
<?php echo form_close();?>
</div>