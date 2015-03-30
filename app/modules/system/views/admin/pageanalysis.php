
<div class="page-header">
	<h3>Please enter the url to analyse the Page ex. "http://www.example.com"</h3>
</div>
<form role="form" class="admin_form_online create_type" method="post" action="<?php echo current_url(); ?>">
	<div class="display-center">
		<div style="width: 455px">
			<div class="form-group">
				<input name="option" value="pageanalysis" type="hidden" />
				<input type="text" class="form-control" name="urlcheck" id="urlcheck" maxlength="255" value="http://" size="140" />
			</div>
			<input type="submit" class="btn btn-success" value="<?php echo __('system:submit') ?>">
		</div>
	</div>
</form>