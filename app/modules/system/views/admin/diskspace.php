<div class="container">
<section class="title">
	<h4><?php echo lang('disk:diskspace'); ?></h4>
</section>
	
<section class="item">

	<table class="table table-striped">
		<thead>
			<tr>
				<th><?php echo lang('disk:thedisk');?></th>
				<th><?php echo lang('disk:rawsize');?></th>
				<th><?php echo lang('disk:rawfree');?></th>
				<th><?php echo lang('disk:readablesize');?></th>
				<th><?php echo lang('disk:readablefree');?></th>
				<th><?php echo lang('disk:percentagefree');?></th>
				<th><?php echo lang('disk:percentageused');?></th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td><?php echo $disk ?></td>
				<td><?php echo $rawsize; ?></td>
				<td><?php echo $rawfree; ?></td>
				<td><?php echo $readablesize; ?></td>
				<td><?php echo $readablefree; ?></td>
				<td><?php echo $perentagefree; ?></td>
				<td><?php echo $percentageused; ?></td>
			</tr>
		</tbody>
		<tr>
				<th><?php echo lang('disk:memoryusage');?></th>
				<td><?php echo $memoryusage; ?></td>
		</tr>
		<tr>
				<th><?php echo lang('disk:serverload')?></th>
				<td><?php //echo $serverload ?></td>
		</tr>
		<tr>
				<th><?php echo lang('disk:serveruptime')?></th>
				<td><?php //echo $serveruptime ?></td>
		</tr>
	</table>
	
</section><!--.item-->
</div>