<div class="container">
  
  <div class="hidden_iframe">
	<iframe name="hidden_form_frame" class="hidden_form_frame"></iframe>
  </div>
  
  <h2 class="green_title"><?php echo __('people:add_a_new_people') ?></h2>
  
  <form role="form" class="admin_form_oneline create_contacts" method="post" action="<?php echo current_url(); ?>">
	<input type="hidden" name="mode" value="add_people">
      <div class="form-group">        
	<input type="text" class="form-control" name="people">
      </div>  
        <input type="submit" class="btn btn-success" value="<?php echo __('people:add_people') ?>">
  </form>
    
  <h2 class="green_title"><?php echo $count; ?> - <?php echo __('people:people_in_the_database') ?></h2>
  
  <table cellspacing="0" class="table table-striped">  
    <thead>
	  <th class="cell1"><?php echo __('general:id') ?></th>
	  <th class="cell2"><?php echo __('general:title') ?></th>
	  <th class="cell2"><?php echo __('general:status') ?></th>
	  <th class="cell5"><?php echo __('general:actions') ?></th>
	</thead>
	<tbody>
  	<?php
	
	foreach ($peoples as $people) {
		
		$id = $people['id'];
		$url = current_url();
		
		echo '<tr id="iframe_save_item_' . $id . '">';
		echo '  <form action="' . $url . '" method="post" target="hidden_form_frame" onsubmit="iframeSave(' . $id . ')">';
		echo '    <input type="hidden" name="mode" value="ajaxedit">';
		echo '    <input type="hidden" name="id" value="' . $id . '">';
		echo '    <td>' . $people['id'] . '</td>';
		echo '    <td><input type="text" class="save_input_text" style="width: 300px;" name="title" value="' . $people['title'] . '"></td>';                
		echo '    <td><span class="iframe_save_status" id="save_status_' . $id . '"></span></td>';
		echo '    <td>';
			?>
			<input type="submit" class="btn btn-success" value="<?php echo __('general:save') ?>">
			<input type="button" class="btn btn-danger" value="<?php echo __('general:delete') ?>"
		<?php
		echo '    onclick="onAjaxDelete(' . $id . ', \'' . $url . '?mode=delete_people&delete=' . $id . '\')">';
		echo '    </td>';
		echo '  </form>';
		echo ' </tr>';
	}
	?>
  	</tbody>
  </table>    
  
    <div class="pagination">
            <?php echo $this->pagination->create_links(); ?>
    </div>  
</div>