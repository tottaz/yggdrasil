<div class="container">

<section class="title">
    <h4><?php echo lang('logs:item_list'); ?></h4>
</section>

<section class="item">
    <?php echo form_open('admin/system/deletelog'); ?>

    <?php if (!empty($items)): ?>
    <div class="scrollable">
            <table class="table table-stripped">
                <thead>
                    <tr>
                        <th><?php echo form_checkbox(array('name' => 'action_to_all', 'class' => 'check-all')); ?></th>
                        <th><?php echo lang('logs:name'); ?></th>
                        <th><?php echo lang('logs:size'); ?></th>
                        <th><?php echo lang('logs:mod'); ?></th>
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
                                anchor('admin/system/viewlog/' . $items[$i], lang('logs:view'), 'class="btn btn-success"') . ' ' .
                                anchor('admin/system/deletelog/' . $items[$i], lang('logs:delete'), array('class' => 'btn btn-danger'));
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
        <div class="no_data"><?php echo lang('logs:no_items'); ?></div>
    <?php endif; ?>

    <?php echo form_close(); ?>
</section>
</div>