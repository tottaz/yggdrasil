<div class="container">
<ul class="nav nav-tabs">
  <li class="active"><a href="#"><?php echo lang('appsdb:database'); ?></a></li>
  <li><a href="tables"><?php echo lang('appsdb:optimize_repair'); ?></a></li>
  <li><a href="query"><?php echo lang('appsdb:query'); ?></a></li>
  <li><a href="export"><?php echo lang('appsdb:export'); ?></a></li>  
</ul>

<section class="item">
		
	<table class="table table-striped">
		<tbody>
			<tr>
				<td><?php echo lang('appsdb:mysql_version'); ?></td>
				<td><?php echo mysqli_get_client_info(); ?></td>
			</tr>
			<tr>
				<td><?php echo lang('appsdb:mysql_host'); ?></td>
				<td><?php echo mysqli_get_host_info($connection); ?></td>
			</tr>
			<tr>
				<td><?php echo lang('appsdb:db_encoding'); ?></td>
				<td><?php echo mysqli_character_set_name($connection); ?></td>
			</tr>
			<tr>
				<td><?php echo lang('appsdb:mysql_protocol'); ?></td>
				<td><?php echo mysqli_get_proto_info($connection); ?></td>
			</tr>
			<?php foreach( $stats as $stat => $value ): ?>
			<tr>
				<td><?php echo $stat; ?></td>
				<td><?php echo $stat == 'Uptime' ? gmdate('H:i:s', $value) : $value; ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	
</section><!--item-->

<section class="title">
	<h4><?php echo lang('appsdb:db_processes'); ?></h4>
</section>
	
<section class="item">

	<table class="table table-striped">
		<thead>
			<tr>
				<th><?php echo lang('appsdb:user');?></th>
				<th><?php echo lang('appsdb:host');?></th>
				<th><?php echo lang('appsdb:command');?></th>
				<th><?php echo lang('appsdb:time');?></th>
				<th><?php echo lang('appsdb:state');?></th>
				<th><?php echo lang('appsdb:info');?></th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($processes as $process ): ?>
			<tr>
				<td><?php echo $process->User; ?></td>
				<td><?php echo $process->Host; ?></td>
				<td><?php echo $process->Command; ?></td>
				<td><?php echo gmdate('H:i:s', $process->Time); ?></td>
				<td><?php echo $process->State; ?></td>
				<td><?php echo $process->Info; ?></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	
</section><!--.item-->
</div>