<div class="container">
<section class="title">
	<h4><a href="<?php echo site_url('admin/system/tables'); ?>"><?php echo lang('appsdb:tables'); ?></a> &rarr; <?php echo $table_name; ?></h4>
</section>

<section class="item">

<table class="table table-striped">
	<thead>
		<tr>
			<th><?php echo lang('appsdb.col_name'); ?></th>
			<th><?php echo lang('appsdb.col_type'); ?></th>
			<th><?php echo lang('appsdb.constraint'); ?></th>
			<th><?php echo lang('appsdb.notes'); ?></th>
		</tr>
	</thead>
	<tbody>
		<?php foreach($fields as $field): ?>
		<tr>
			<td><?php echo $field->name; ?></td>
			<td><?php echo $field->type; ?></td>
			<td><?php echo $field->max_length; ?></td>
			<td><?php if($field->primary_key == "1") { echo lang('appsdb.primary_key'); } ?></td>
		</tr>
		<?php endforeach; ?>
	</tbody>
</table>
	
</section><!--.item-->
</div>