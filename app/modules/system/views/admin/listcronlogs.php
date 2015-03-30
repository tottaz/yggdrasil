<div class="container">
<div class="content">
  
  	<table class="table table-striped">
	  <thead>
	    <tr>
		  <th>Feed</th>
		  <th>Items</th>
		  <th>New items</th>
		  <th>Status</th>
		  <th>Loadtime</th>
		  <th>Processtime</th>
		  <th>Updatetime</th>
		  <th>Date read</th>
		</tr>
	  </thead>
	  <tbody>
		<?php
		if ($log_items) {
			foreach ($log_items as $item) {
				echo '<tr>';
				echo '<td>' . $item['feed_title'] . '</td>';
				echo '<td>' . $item['items'] . '</td>';
				echo '<td>' . $item['new_items'] . '</td>';
				echo '<td>' . ($item['status'] == 2 ? 'Succes' : 'Error') . '</td>';
				echo '<td>' . number_format($item['loadtime'] / 1000, 1) . ' ms</td>';
				echo '<td>' . number_format($item['processtime'] / 1000, 1) . ' ms</td>';
				echo '<td>' . number_format($item['updatetime'] / 1000, 1) . ' ms</td>';
				echo '<td>' . date('Y-m-d H:i', $item['date_checked']) . '</td>';
				echo '</tr>';
			}
		}
		?>
	  </tbody>
	</table>
</div>
</div>