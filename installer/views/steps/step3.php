<?php echo form_open('wizard/step3'); ?>

  <input type="hidden" name="theme" value="emily" />

  <h2>Last step!</h2>
<p>Additional Yggdrasil configuration settings</p>
  <table style="width: 100%;">
	<tr>
	  <th class="col1"><label for="notify_email">Notify Email</label></th>
	  <td class="col2"><input name="notify_email" type="text" size="20" value="<?php echo set_value('notify_email'); ?>" /></td>
	  <td class="col3">Email to receive system notices.</td>
	</tr>

	<tr>
	  <th class="col1"><label for="username">Username</label></th>
	  <td class="col2"><input name="username" type="text" size="20" value="<?php echo set_value('username', 'admin'); ?>" /></td>
	  <td class="col3">What you want to login with.</td>
	</tr>

	<tr>
	  <th class="col1"><label for="password">Password</label></th>
	  <td class="col2"><input name="password" type="password" size="20" /></td>
	  <td class="col3">Choose a password.</td>
	</tr>

	<tr>
	  <th class="col1"><label for="password_confirm">Confirm Password</label></th>
	  <td class="col2"><input name="password_confirm" type="password" size="20" /></td>
	  <td class="col3">Confirm the password.</td>
	</tr>

	<tr>
	  <th class="col1"><label for="first_name">First Name</label></th>
	  <td class="col2"><input name="first_name" type="text" size="20" value="<?php echo set_value('first_name'); ?>" /></td>
	  <td class="col3">IE: Karen</td>
	</tr>

	<tr>
	  <th class="col1"><label for="last_name">Last Name</label></th>
	  <td class="col2"><input name="last_name" type="text" size="20" value="<?php echo set_value('last_name'); ?>" /></td>
	  <td class="col3">IE: Smith</td>
	</tr>

  </table><br />
<p class="center"><button type="submit" class="button">Install!</button></p>

<?php echo form_close(); ?>