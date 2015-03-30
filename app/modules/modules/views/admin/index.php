<div class="container">
<section class="title">
	<h4><?php echo lang('modules.core_list');?></h4>
</section>

<section class="item">
		<p><?php echo lang('modules.core_introduction'); ?></p>

		<table class="table table-striped">
			<thead>
				<tr>
					<th><?php echo lang('name_label');?></th>
					<th><span><?php echo lang('desc_label');?></span></th>
					<th><?php echo lang('version_label');?></th>
					<th></th>
				</tr>
			</thead>	
			<tbody>
			<?php foreach($all_modules as $module): ?>
			<?php if ( ! $module['is_core']) continue; ?>
				<tr>
					<td><?php echo $module['is_backend'] ? anchor('admin/' .$module['slug'], $module['name']) : $module['name']; ?></td>
					<td><?php echo $module['description']; ?></td>
					<td class="align-center"><?php echo $module['version']; ?></td>
					<td class="actions">
					<?php if ($module['enabled']): ?>
					<?php echo anchor('admin/modules/disable/'.$module['slug'], lang('global:disable'), array('class'=>'btn btn-success', 'title'=>lang('modules.confirm_disable'))); ?>
					<?php else: ?>
						<?php echo anchor('admin/modules/enable/'.$module['slug'], lang('global:enable'), array('class'=>'btn btn-danger', 'title'=>lang('modules.confirm_enable'))); ?>
					<?php endif; ?>
					</td>
				</tr>
			<?php endforeach; ?>
			</tbody>	
		</table>
</section>
</div>