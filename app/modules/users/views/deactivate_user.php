<div class="no_object_notification super-warning">

    <h4>Deactivate User</h4>
    <?php echo form_open('admin/users/deactivate/' . $user['id'], 'id="delete-ananas-form"'); ?>
    <?php echo form_hidden($csrf); ?>
    <p>Are you sure you want to deactivate the user '<?php echo $user['username']; ?>'?</p>
    <p class="confirm-btn"><a href="#" class="asc-button small green" onclick="$('#delete-ananas-form').submit();"><span>&nbsp;&nbsp;Deactivate User&nbsp;&nbsp;</span></a></p>

    <?php echo form_close(); ?>

</div><!-- /no_object_notification warning-->