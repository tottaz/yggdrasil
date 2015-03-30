<div class="container">
<div class="content">
  
  	<table class="table table-striped">
	  <thead>
	    <tr>
                  <th><?php echo lang('system:uri'); ?></th>
		  <th><?php echo lang('system:method'); ?></th>
		  <th><?php echo lang('system:apikey'); ?></th>
		  <th><?php echo lang('system:ipaddress'); ?></th>
		  <th><?php echo lang('system:time'); ?></th>
		  <th><?php echo lang('system:authorized'); ?></th>
		</tr>
	  </thead>
	  <tbody>
		<?php
		if ($log_items) {
			foreach ($log_items as $item) {
				echo '<tr>';
				echo '<td>' . $item['uri'] . '</td>';
				echo '<td>' . $item['method'] . '</td>';
                                echo '<td>' . $item['api_key'] . '</td>';                                
				echo '<td>' . $item['ip_address'] . '</td>';
                                echo '<td>' . date('Y-m-d H:i', $item['time']) . '</td>';
				echo '<td>' . ($item['authorized'] == 1 ? 'Succes' : 'Error') . '</td>';
				echo '</tr>';
			}
		}
		?>
	  </tbody>
	</table>
</div>
</div>