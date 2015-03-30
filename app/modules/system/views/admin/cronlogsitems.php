<div class="container">
<section class="title">
    <h4><?php echo lang('cronlogs:item_list'); ?></h4>
</section>

<section class="item">
    <?php echo form_open('admin/system/deletecronlog'); ?>

    <?php if (!empty($items)): ?>
    <div class="scrollable">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th><?php echo form_checkbox(array('name' => 'action_to_all', 'class' => 'check-all')); ?></th>
                        <th><?php echo lang('cronlogs:name'); ?></th>
                        <th><?php echo lang('cronlogs:size'); ?></th>
                        <th><?php echo lang('cronlogs:mod'); ?></th>
                        <th></th>
                    </tr>
                </thead>
                <tfoot>
                    <tr>
                        <td colspan="4">
                            <div class="inner"><?php $this->load->view('partials/pagination'); ?></div>
                        </td>
                    </tr>
                </tfoot>
                <tbody>
                    <?php for ($i = 0; $i < count($items); $i++): ?>
                        <tr>
                            <td><?php echo form_checkbox('action_to[]', $items[$i]); ?></td>
                            <td><?php echo $items[$i]; ?></td>
                            <td><?php echo filesize($folder.$items[$i]); ?></td>
                            <td><?php echo format_date(filemtime($folder.$items[$i])); ?></td>
                            <td class="actions">
                                <?php
                                echo
                                anchor('admin/system/viewcronlog/' . $items[$i], lang('cronlogs:view'), 'class="btn btn-success"') . ' ' .
                                anchor('admin/system/deletecronlog/' . $items[$i], lang('cronlogs:delete'), array('class' => 'btn btn-danger'));
                                ?>
                            </td>
                        </tr>
                    <?php endfor; ?>
                </tbody>
            </table>
        </div>

        <div class="table_action_buttons">
            <?php $this->load->view('partials/buttons', array('buttons' => array('delete'))); ?>
        </div>

    <?php else: ?>
        <div class="no_data"><?php echo lang('cronlogs:no_items'); ?></div>
    <?php endif; ?>

    <?php echo form_close(); ?>
</section>
</div>