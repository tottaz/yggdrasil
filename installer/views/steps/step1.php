<h2>Step 1: Making sure we have the right environment.</h2>
<table cellspacing="0" class="listtable">
	<thead>
	<tr>
		<th width="10%">Status</th>
		<th>Requirement</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td><span class="<?php echo $php_version ? 'pass' : 'fail'; ?>"><?php echo $php_version ? 'PASS' : 'FAIL'; ?></span></td>
		<td>Server must have PHP version 5.2 or greater installed.</td>
	</tr>
	<tr>
		<td><span class="<?php echo $curl_installed ? 'pass' : 'fail'; ?>"><?php echo $curl_installed ? 'PASS' : 'FAIL'; ?></span></td>
		<td>The Curl PHP extension must be installed.</td>
	</tr>
	<tr>
		<td><span class="<?php echo $config_writable ? 'pass' : 'fail'; ?>"><?php echo $config_writable ? 'PASS' : 'FAIL</span>'; ?></span></td>
		<td>The app/config folder must be writable.</td>
	</tr>
	<tr>
		<td><span class="<?php echo $upload_writable ? 'pass' : 'fail'; ?>"><?php echo $upload_writable ? 'PASS' : 'FAIL'; ?></span></td>
		<td>The uploads directory must be writable.</td>
	</tr>
	</tbody>
</table>
<?php if ($can_continue): ?>
	<p class="center"><a href="<?php echo site_url('wizard/step2'); ?>" class="button">Step 2: Start Configuring</a></p>
<?php else: ?>
	<p class="center fail">Cannot Continue.  Please fix the above errors and refresh to re-check.</p>
<?php endif; ?>