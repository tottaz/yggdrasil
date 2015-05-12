
<div class="container">

<?php echo form_open_multipart('admin/apikey', 'id="settings-form"'); ?>
<!--api keys-->
    <div id="api_keys">
        <table class="table table-striped">
                <thead>
                <tr>	
                        <th><?php echo __('settings:api_note') ?></th>
                        <th><?php echo __('settings:api_key') ?></th>
                        <th><?php echo __('global:created') ?></th>
                        <th><?php echo __('global:remove') ?></th>
                </tr>
                </thead>
                <tbody>
                <?php foreach ($api_keys as $key): ?>
                        <tr>
                                <td><?php echo form_input(array(
                                        'name' => 'key_note['.$key->id.']',
                                        'value' => set_value('key_note['.$key->id.']', $key->note),
                                        'class' => 'txt small'
                                )); ?></td>
                                <td><?php echo $key->key.form_hidden('key_key['.$key->id.']', $key->key); ?></td>
                                <td>
                                        <?php echo format_date($key->date_created); ?>
                                </td>
                                <td>
                                        <a href="#" class="delete-key"><img src="../app/modules/apikey/img/cancel_24.png" /></a>
                                </td>
                        </tr>
                <?php endforeach; ?>
                </tbody>
        </table><br />
        <a href="#" id="add-key" class="btn btn-warning"><span>Add Another Key</span></a>
    </div><!--/api keys-->        
<br />
<input type="submit" class="btn btn-sucess" />

<?php echo form_close(); ?>

</div>
<?php echo asset::js('module::jquery.history.js'); ?>
<script type="text/javascript">
$(document).ready(function () {

	$('#add-key').click(function () {
		
		key = random_string(40);
		
		$(this).parent().children('table').children('tbody').append('<tr><td><?php echo form_input(array(
			'name' => 'new_key_note[]',
			'value' => '',
			'class' => 'txt small'
		)); ?></td>'
		+ '<td>' + key + '<input type="hidden" name="new_key[]" value="' + key + '" /></td>'
		+ '<td><?php echo format_date(now()); ?></td>'
		+ '<td>'
		+ '	<a class="delete-key" href="#">'
		+ '		<img src="../app/modules/apikey/img/cancel_24.png">'
		+ '	</a>'
		+ '</td>'
		+ '</tr>');

		return false;
	});
	
	$('.delete-key').on('click', function () {
		$(this).closest('tr').fadeOut().find('input').val('');
		return false;
	});
	
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