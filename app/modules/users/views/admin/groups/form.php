
<div class="container">
	
	<div class="head-box">
	<?php if ($this->method == 'edit'): ?>
		<h3 class="group_action ttl4"><?php echo sprintf(lang('groups:edit_title'), $group->name); ?></h3>
	<?php else: ?>
		<h3 class="group_action"><?php echo lang('groups:add_title'); ?></h3>
	<?php endif; ?>
	</div><!-- /head-box end -->
	
		<?php echo form_open(uri_string()); ?>

		<fieldset class="add_client">

		    <div class="row">
				<label for="description"><?php echo lang('groups:name');?> <span>*</span></label>
				<?php echo form_input('description', $group->description, ' class="txt text"');?>
			</div>
	
			<div class="row">
				<label for="name"><?php echo lang('groups:short_name');?> <span>*</span></label>
		
				<?php if ( ! in_array($group->name, array('user', 'admin'))): ?>
					<?php echo form_input('name', $group->name, ' class="txt text"');?>
				<?php else: ?>
					<p><?php echo $group->name; ?></p>
				<?php endif; ?>
			</div>	
		</fieldset>
	    
		<fieldset class="permissions">			
			<legend><?php echo lang('permissions:permissions') ?></legend>			
			
<?php if ($group->name !== 'admin'): ?>

<div class="table-area">
	<table cellspacing="0" class="table table-striped">
		<thead>
		<tr>
			<th class="cell1">Module</th>
			<th class="cell5">Rules</th>
			<th class="cell5">Status</th>
		</tr>
		</thead>
		<tbody>
			<?php foreach ($permission_modules as $module): ?>								
				<tr class="on_off">
					
					<td style="width:140px;" valign="top">
						<label class="inline" style="font-size:18px; font-weight:bold" for="<?php echo $module['slug']; ?>"><?php echo $module['name']; ?></label>
					</td>
					
					<td>
						<div class="rules row" style="<?php echo array_key_exists($module['slug'], $edit_permissions) ? '' : 'display:none' ?>" valign="top">
						<?php if ( ! empty($module['roles'])): ?>
							<?php foreach ($module['roles'] as $role): ?>
								<label>
								<?php echo form_checkbox(array(
									'name' => 'module_roles[' . $module['slug'] . ']['.$role.']',
									'value' => TRUE,
									'checked' => isset($edit_permissions[$module['slug']]) AND array_key_exists($role, (array) $edit_permissions[$module['slug']]),
								 )); ?>
								 <?php echo lang($module['slug'].':role_'.$role); ?></label>
							<?php endforeach; ?>
						<?php endif; ?>
						</div><!-- /rules -->
					</td>
					
					<td style="width: 180px" valign="top">
						<?php echo form_checkbox(array(
							'name' => 'modules[' . $module['slug'] . ']', 
							'value' => TRUE,
							'checked' => array_key_exists($module['slug'], $edit_permissions),
							'id' => $module['slug'],
							'class' => 'on_off',
						)); ?>
					</td>

				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div><!-- /table-area -->

<?php endif ?>			
		</fieldset>
		<div id="submit-holder">
			<p><a href="#" class="btn btn-success btn-sm" onclick="$(this).closest('form').submit();"><span><?php echo lang('global:save'); ?>&rarr;</span></a></p>
<!--			<input type="submit" class="hidden-submit" /> -->
		</div><!-- /submit-holder -->		
	<?php echo form_close(); ?>
</div>
<script type="text/javascript">
	jQuery(function($) {
		$('form input[name="description"]').keyup($.debounce(300, function(){

			var slug = $('input[name="name"]');

			$.post(siteURL + 'ajax/url_title', { title : $(this).val() }, function(new_slug){
				slug.val( new_slug );
			});
		}));
	});
</script>


<script src="<?php echo Asset::get_src('chkb-style/script/chkb-style.js');?>"></script>
<link media="all" rel="stylesheet" type="text/css" href="<?php echo Asset::get_src('chkb-style/style.css');?>" />


<script type="text/javascript" charset="utf-8">
	$(function() {
		$('.on_off :checkbox.on_off').each(function() {
		
			var $checkbox = $(this);

			$checkbox.iphoneStyle({
				onChange : function(){ 
					$div = $checkbox.closest('tr').find('.rules');
					
					$checkbox.prop('checked') ? $div.show() : $div.hide();
				}
			});
		});
	});
 </script>