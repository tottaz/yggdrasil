<div class="container">
<ul class="nav nav-tabs">
  <li><a href="database"><?php echo lang('appsdb:database'); ?></a></li>
  <li class="active"><a href="#"><?php echo lang('appsdb:optimize_repair'); ?></a></li>
  <li><a href="query"><?php echo lang('appsdb:query'); ?></a></li>
  <li><a href="export"><?php echo lang('appsdb:export'); ?></a></li>  
</ul>


<section class="item">
	
	<?php echo form_open('admin/system/tables'); ?>
		
	<table class="table table-striped">
		<thead>
			<tr>
				<th width="15"><?php echo form_checkbox('tables_all', '', '', 'class="check-all"');?></th>
				<th><?php echo lang('appsdb:table_name'); ?></th>
				<th><?php echo lang('appsdb:engine'); ?></th>
				<th><?php echo lang('appsdb:rows'); ?></th>
				<th><?php echo lang('appsdb:size'); ?></th>
				<th><?php echo lang('appsdb:comment'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($tables as $table): ?>
			<tr>
				<td><?php echo form_checkbox('action_to[]', $table->Name);?></td>
				<td><?php echo anchor('admin/system/tables/table/'.$table->Name, $table->Name); ?></td>
				<td><?php echo $table->Engine; ?></td>
				<td><?php echo number_format($table->Rows); ?></td>
				<td><?php echo byte_format($table->Data_length);?></td>
				<td><?php echo $table->Comment; ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
		
	<div class="table_action_buttons">

		<br>
		
		<button type="submit" name="repair" value="Repair Tables" class="btn btn-primary" /><span>Repair Tables</span></button>
		<button type="submit" name="optimize" value="Optimize Tables" class="btn btn-primary" /><span>Optimize Tables</span></button>
		
	</div><!--.table_action_buttons-->

	</form>

</section><!--.item-->
</div>
