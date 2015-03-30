<div class="container">
<section class="title">
	<h4><?php echo lang('system:export_data'); ?></h4>
</section>

<section class="item">

	<?php if ( ! empty($tables)): ?>
		<table border="0" class="table table-striped">
			<thead>
				<tr>
					<th><?php echo lang('system:table_label'); ?></th>
					<th class="align-center"><?php echo lang('system:record_label'); ?></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($tables as $table): ?>
				<tr>
					<td><?php echo $table['name']; ?></td>
					<td class="align-center"><?php echo $table['count']; ?></td>
					<td class="align-center actions">
						<?php if ($table['count'] > 0):
							echo anchor('admin/system/exportfile/'.$table['name'].'/xml', lang('system:export_xml'), array('class'=>'btn btn-primary')).' ';
							echo anchor('admin/system/exportfile/'.$table['name'].'/csv', lang('system:export_csv'), array('class'=>'btn btn-primary')).' ';
							echo anchor('admin/system/exportfile/'.$table['name'].'/json', lang('system:export_json'), array('class'=>'btn btn-primary')).' ';
						endif; ?>
					</td>
				</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php endif;?>

</section>
</div>