<div class="container">
 <ul class="nav nav-tabs">
  <li><a href="database"><?php echo lang('appsdb:database'); ?></a></li>
  <li><a href="tables"><?php echo lang('appsdb:optimize_repair'); ?></a></li>
  <li><a href="query"><?php echo lang('appsdb:query'); ?></a></li>
  <li class="active"><a href="#"><?php echo lang('appsdb:export'); ?></a></li>  
</ul>

<section class="item">

	<?php echo form_open('admin/system/export'); ?>

	<form action="<?php echo site_url('admin/system/export'); ?>" method="post">

	<table class="table table-striped">

		<tr>
			<td><strong><?php echo lang('appsdb:file_format'); ?></strong></td>
			<td><?php echo form_dropdown('format', $file_formats,'','class=form-control'); ?></td>
		</tr>

		<tr>
			<td><strong><?php echo lang('appsdb:filename'); ?></strong><br><small><?php echo lang('pryodb:filename_instructions'); ?><small></td>
			<td><input class="form-control" type="text" name="filename" /></td>
		</tr>

		<tr>
			<td><strong><?php echo lang('appsdb:include_drop'); ?></strong></td>
			<td><?php echo form_dropdown('add_drop', $true_false,'','class=form-control'); ?></td>
		</tr>

		<tr>
			<td><strong><?php echo lang('appsdb:include_insert'); ?></strong></td>
			<td><?php echo form_dropdown('add_insert', $true_false,'','class=form-control'); ?></td>
		</tr>		

		<tr>
			<td><strong><?php echo lang('appsdb:newline'); ?></strong></td>
			<td><?php echo form_dropdown('newline', $newlines,'','class=form-control'); ?></td>
		</tr>		

	</table>

	<h4><?php echo lang('appsdb:tables'); ?></h4>

	<table class="table table-striped">
		<thead>
			<tr>
				<th><?php echo form_checkbox('tables_all', '', '', 'class="check-all"');?>&nbsp;&nbsp;<?php echo lang('appsdb:table_name'); ?></th>
				<th><?php echo lang('appsdb:rows'); ?></th>
				<th><?php echo lang('appsdb:size'); ?></th>
				<th><?php echo lang('appsdb:comment'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($tables as $table): ?>
			<tr>
				<td><label><?php echo form_checkbox('action_to[]', $table->Name);?>&nbsp;&nbsp;<?php echo $table->Name; ?></td>
				<td><?php echo number_format($table->Rows); ?></td>
				<td><?php echo byte_format($table->Data_length);?></td>
				<td><?php echo $table->Comment; ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<p><input type="submit" class="btn btn-primary" value="<?php echo lang('appsdb:export'); ?>" /></p>

	</form>

</section>
</div>