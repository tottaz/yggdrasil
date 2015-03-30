<div class="container">
  
  <div class="hidden_iframe">
	<iframe name="hidden_form_frame" class="hidden_form_frame"></iframe>
  </div>

  <h2 class="green_title"><?php echo __('department:add_a_new_department') ?></h2>
  
  <form role="form" class="admin_form_oneline create_department" method="post" action="<?php echo current_url(); ?>">
	<input type="hidden" name="mode" value="add_department">
        <div class="form-group">        
            <input type="text" class="form-control" name="department">
        </div>
        <input type="submit" class="btn btn-success" value="<?php echo __('department:add_department') ?>">
  </form>
    
  <h2 class="green_title"><?php echo $count; ?> departments in the database</h2>

	<table cellspacing="0" class="table table-striped">  
		<thead>
			<th class="cell2"><?php echo __('general:title') ?></th>
			<th class="cell2"><?php echo __('general:status') ?></th>
			<th class="cell5"><?php echo __('general:actions') ?></th>
		</thead>
		<tbody>
	  	<?php
		
		foreach ($departments as $department) {
			
			$id = $department['department_id'];
			$url = current_url();
			
			echo '<tr id="iframe_save_item_' . $id . '">';
			echo '  <form role="form" action="' . $url . '" method="post" target="hidden_form_frame" onsubmit="iframeSave(' . $id . ')">';
			echo '    <input type="hidden" name="mode" value="ajaxedit">';
			echo '    <input type="hidden" name="id" value="' . $id . '">';
			echo '    <td><input type="text" class="form-control" name="department_name" value="' . $department['department_name'] . '"></td>';
			echo '    <td><span class="iframe_save_status" id="save_status_' . $id . '"></span></td>';
			echo '    <td>';
				?>
				<input type="submit" class="btn btn-success" value="<?php echo __('general:save') ?>">
				<input type="button" class="btn btn-danger" value="<?php echo __('general:delete') ?>"
			<?php
			echo '    onclick="onAjaxDelete(' . $id . ', \'' . $url . '?mode=delete_department&delete=' . $id . '\')">';
			echo '    </td>';
			echo '  </form>';
			echo ' </tr>';
		}
		?>
	  	</tbody>
  </table>
  
   <?php $this->load->view('partials/pagination'); ?>
   
</div>