<?php if ($message = $this->session->flashdata('success')): ?>
	<div class="alert alert-success alert-dismissable"><?php echo $message; ?>
        <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
        </div>
<?php endif; ?>
<?php if (isset($messages['success'])): ?>
	<div class="alert alert-success alert-dismissable"><?php echo $messages['success']; ?>            
        <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
        </div>
<?php endif; ?>

<?php if ( $message = $this->session->flashdata('error')): ?>
	<div class="alert alert-danger alert-dismissable"><b><?php echo __('global:error');?>:</b> <?php echo $message; ?>
        <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
        </div>        
<?php endif; ?>
<?php if (isset($messages['error'])): ?>
	<div class="alert alert-danger alert-dismissable"><b><?php echo __('global:error');?>:</b> <?php echo $messages['error']; ?>
        <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
        </div>
<?php endif; ?>
<?php if ($errors = validation_errors('<p>', '</p>')): ?>
	<div class="alert alert-danger alert-dismissable"><?php echo $errors; ?>
        <a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>
        </div>
<?php endif; ?>