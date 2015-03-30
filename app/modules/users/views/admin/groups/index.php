<div class="container">
	<?php if ($groups): ?>
		<table class="table table-striped">
			<thead>
				<tr>
					<th class="cell1"><?php echo lang('groups:name');?></th>
					<th class="cell5"><?php echo lang('groups:short_name');?></th>
					<th class="cell5"><?php echo lang('global:actions') ?></th>
				</tr>
			</thead>
			<tbody>
			<?php foreach ($groups as $group):?>
				<tr>
					<td><?php echo $group->description; ?></td>
					<td><?php echo $group->name; ?></td>
					<td class="cell5 actions">
					<?php echo anchor('admin/users/groups/edit/'.$group->id, lang('global:edit'), 'class="btn btn-success btn-sm"'); ?>
					<?php if ( ! in_array($group->name, array('user', 'admin'))): ?>
						<?php echo anchor('admin/users/groups/delete/'.$group->id, lang('global:delete'), 'class="btn btn-danger btn-sm"'); ?>
					<?php endif; ?>
					</td>
				</tr>
			<?php endforeach;?>
			</tbody>
		</table>
		

	
	<?php else: ?>
		<div class="title">
			<p><?php echo lang('groups:no_groups');?></p>
		</div><!-- /title -->
	<?php endif;?>

</div><!-- /table-area -->