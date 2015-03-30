<div class="container">
    
  <div class="hidden_iframe">
	<iframe name="hidden_form_frame" class="hidden_form_frame"></iframe>
  </div>
    
  <h2 class="green_title">Add a new vendor</h2>
  <table cellspacing="0" class="table table-striped">  

  <form role="form" class="admin_form_oneline create_vendor" method="post" action="<?php echo current_url(); ?>">
	<input type="hidden" name="mode" value="add_vendor">
      <div class="form-group">
	<input type="text" class="form-control" name="vendor">
      </div>        
	<input type="submit" class="btn btn-success" value="add vendor">
  </form>
  </table>
  
  <h2 class="green_title"><?php echo $count; ?> Vendors in the database</h2>
  
    <table cellspacing="0" class="table table-striped">
        <thead>
        <tr>
                <th class="cell1">Vendor</th>
                <th class="cell1">Actions</th>
        </tr>
        </thead>
	<tbody>
  	<?php
	
	foreach ($vendors as $vendor) {
		
		$id = $vendor['vendor_id'];
		$url = current_url();

		echo '<tr id="iframe_save_item_' . $id . '">';
		echo '  <form role="form" action="' . $url . '" method="post" target="hidden_form_frame" onsubmit="iframeSave(' . $id . ')">';
		echo '    <input type="hidden" name="mode" value="ajaxedit">';
		echo '    <input type="hidden" name="id" value="' . $id . '">';

		echo '    <td><input type="text" class="form-control" name="vendor_name" value="' . $vendor['vendor_name'] . '"></td>';
		echo '    <td>';
		echo '      <span class="iframe_save_status" id="save_status_' . $id . '"></span>';
		echo '      <input type="submit" class="btn btn-success" value="save">';
		echo '      <input type="button" class="btn btn-danger" value="delete" onclick="onAjaxDelete(' . $id . ', \'' . $url . '?mode=delete_vendor&delete=' . $id . '\')">';                
		echo '    </td>';
		echo '  </form>';
		echo ' </tr>';
	}
	
	?>
  	</tbody>
  </table>

  <?php $this->load->view('partials/pagination'); ?>
  
</div>