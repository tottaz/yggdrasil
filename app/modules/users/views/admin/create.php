<div class="container">

	<div id="ajax_container"></div>

	<?php echo form_open("admin/users/create", 'id="user-form"');?>

	<fieldset>

		<div id="ananas-type-block" class="form">
			
			<div class="form-group">
				<p>Please enter the users information below.</p>
			</div>
			
			<div class="form-group">
			<label for="username">Username:</label>
			<?php echo form_input(array(
				'name'	=> 'username',
				'id'	=> 'username',
				'type'	=> 'text',
				'class'	=>	'txt',
				'value'	=> set_value('username'),
			));?>
			</div>

			<div class="form-group">
			<label for="email">Email:</label>
			<?php echo form_input(array(
				'name'	=> 'email',
				'id'	=> 'email',
				'type'	=> 'text',
				'class'	=>	'txt',
				'value'	=> set_value('email'),
			)); ?>
			</div>
			
			<div class="form-group">
			<label for="first_name">First Name:</label>
			<?php echo form_input(array(
				'name'	=> 'first_name',
				'id'	=> 'first_name',
				'type'	=> 'text',
				'value'	=> set_value('first_name'),
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
				'value'	=> set_value('last_name'),
			));?>
			</div>

			<div class="form-group">
			<label for="password">Password:</label>
			<?php echo form_password(array(
				'name'	=> 'password',
				'id'	=> 'password',
				'type'	=> 'password',
				'class'	=>	'txt',
				'value'	=> set_value('password'),
			));?>
			</div>

			<div class="form-group">
			<label for="password_confirm">Confirm Password:</label>
			<?php echo form_password(array(
				'name'	=> 'password_confirm',
				'id'	=> 'password_confirm',
				'type'	=> 'password',
				'class'	=>	'txt',
				'value'	=> set_value('password_confirm'),
			));?>
			</div>

			<div class="form-group">
			<label for="group">Group:</label>
			<div class="sel-item">
			<?php echo form_dropdown('group', $groups, set_value('group'), '');?>
			</div>
			</div>


			<div class="row">
			<a href="#" onclick="$('#user-form').submit()" class="btn btn-success btn-sm"><span>Create User</span></a>
			</div>
		</div>
	</fieldset>
	<!--            <input type="submit" class="hidden-submit" /> -->
	<?php echo form_close();?>
</div>
