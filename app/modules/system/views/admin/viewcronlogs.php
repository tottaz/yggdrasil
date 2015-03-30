<div class="container">
<section class="title">
    <h4><?php echo lang('global:' . $this->method) . ' ' . $filename; ?> </h4>
</section>

<section class="item">

    <pre class="scrollable">
        <?php echo htmlspecialchars($content); ?>
    </pre>
    <div class="buttons">
        <?php $this->load->view('partials/buttons', array('buttons' => array('cancel'))); ?>
    </div>
</section>
</div>