<div class="container">
 <ul class="nav nav-tabs">
  <li><a href="database"><?php echo lang('appsdb:database'); ?></a></li>
  <li><a href="tables"><?php echo lang('appsdb:optimize_repair'); ?></a></li>
  <li class="active"><a href="#"><?php echo lang('appsdb:query'); ?></a></li>
  <li><a href="export"><?php echo lang('appsdb:export'); ?></a></li>  
</ul>

<section class="row">

<?php echo form_open(uri_string()); ?>

	<p><textarea id="html_editor" cols="150" rows="10" name="query_window"><?php echo $query_string;?></textarea></p>

	<div class="buttons">
		<button type="submit" name="query" value="Query" class="btn btn-primary" /><span><?php echo lang('appsdb:run_query'); ?></span></button>
	</div><!--.buttons-->

	</form>

<?php if( $query_run ): ?>

</section>

<section class="title">
	<h4><?php echo lang('appsdb:query_results'); ?></h4>
</section>

<section class="item">
	
<?php if ($mysqli_result_error): ?>	

<p><?php echo $mysqli_result_error; ?></p>
	
<?php elseif( $results ): ?>
	
<table class="table table-striped">
	<thead>
		<tr>
		<?php $keys = array(); foreach( $results[0] as $key => $result ): ?>
			<th><?php echo $keys[] = $key; ?></th>
		<?php endforeach; ?>
		</tr>
	</thead>
	<tbody>
		<?php foreach ($results as $result): ?>
		<tr>
		<?php foreach ($keys as $key): ?>
			<td><?php echo $result[$key]; ?></td>
		<?php endforeach; ?>
		</tr>			
		<?php endforeach; ?>
	</tbody>
</table>

<?php else: ?>
	<p><?php echo lang('appsdb:no_results'); ?></p>
<?php endif; ?>
	
</section><!--item-->

<?php endif; ?>
</div>
