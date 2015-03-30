<div class="container">
<section class="title">
	<h4><?php echo lang('system:list_label'); ?></h4>
</section>

<section class="item">

	<?php if ( ! empty($folders)): ?>
		<table border="0" class="table table-striped">
			<thead>
				<tr>
					<th><?php echo lang('name_label'); ?></th>
					<th class="align-center"><?php echo lang('system:count_label'); ?></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($folders as $folder): ?>
				<tr>
					<td><?php echo $folder['name']; ?></td>
					<td class="align-center"><?php echo $folder['count']; ?></td>
					<td class="align-center actions">
						<?php if ($folder['count'] > 0) echo anchor('admin/system/cleanup/'.$folder['name'], lang('system:empty'), array('class'=>'btn btn-success')) ?>
						<?php if ( ! $folder['cannot_remove']) echo anchor('admin/system/cleanup/'.$folder['name'].'/1', lang('system:remove'), array('class'=>'btn btn-danger ')) ?>
					</td>
				</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php else: ?>
		<div class="blank-slate">
			<h2><?php echo lang('system:no_items'); ?></h2>
		</div>
	<?php endif;?>

</section>
</div>