<div class="container">
  
  <div class="hidden_iframe">
	<iframe name="hidden_form_frame" class="hidden_form_frame"></iframe>
  </div>
  
  <h2 class="green_title">Add a new office</h2>
  <form role="form" class="admin_form create_feed" method="post" action="<?php echo current_url(); ?>">
	<input type="hidden" name="mode" value="add_office">
      <div class="form-group">      
        <input type="text" class="form-control" name="title">
      </div>        
	<input type="submit" value="add office" class="btn btn-success">
  </form>
  
  <h2 class="green_title">Offices in the database</h2>
  <table class="table table-striped">
    <thead>
	  <th>Id</th>
	  <th>Title</th>
	  <th>Actions</th>
	</thead>
	<tbody>
	<?php
	foreach ($offices as $office) {
		
		$id = $office['id'];
		$url = current_url();
		
		echo '<tr id="iframe_save_item_' . $id . '">';
		echo '  <form action="' . $url . '" method="post" target="hidden_form_frame" onsubmit="iframeSave(' . $id . ')">';
		echo '    <input type="hidden" name="mode" value="ajaxedit">';
		echo '    <input type="hidden" name="id" value="' . $id . '">';
		
		echo '    <td>' . $office['id'] . '</td>';
		
		//echo '    <td>' . $office['title'] . '</td>';
		echo '    <td><input type="text" class="save_input_text" style="width: 200px;" name="title" value="' . $office['title'] . '"></td>';		
		
		echo '    <td>';
		echo '      <input type="submit" class="btn btn-success" value="save">';
		echo '      <input type="button" class="btn btn-danger" value="delete" onclick="onAjaxDelete(' . $id . ', \'' . $url . '?mode=delete_office&delete=' . $id . '\')">';
		echo '      <span class="iframe_save_status" id="save_status_' . $id . '"></span>';
		echo '    </td>';
		
		//echo '    <td><a href="' . current_url() . '?mode=edit_office&edit=' . $office['id'] . '" class="edit">edit</a> | <a href="' . current_url() . '?mode=delete_office&delete=' . $office['id'] . '" class="delete" onclick="return confirm(\'Are you sure you want to delete this office?\')">delete</a></td>';
		
		echo '  </form>';
		echo '</tr>';
	}
	?>
	</tbody>
  </table>
      <div class="pagination">
            <?php echo $this->pagination->create_links(); ?>
    </div>  
</div>