<div class="container">
    <div class="top">
        <br class="clear" />
        <h2 class="ttl ttl1"><?php echo random_element(lang('global:greetings')) . ' ' . $current_user->first_name; ?></h2>		
    </div>
    <!-- /top end -->

    <ul class="counters">
        <li class="collect">
            <div class="head-box">
                <strong class="cell"><?php echo lang('dashboard:peopleonboard') ?>:</strong>
                <strong class="count"><span><?php echo anchor('whois', $onboard); ?></span></strong>
            </div><!-- /head-box end -->
            <strong class="box"><?php echo anchor('whois', $onboard); ?></strong>                        
        </li>

        <!--	<li class="outstanding">
                        <div class="head-box">
                                <strong class="cell"><?php //echo lang('dashboard:expectedcrue')  ?>:</strong>
                                <strong class="count"><span><?php //echo anchor('people', $expected);  ?></span></strong>
                        </div>
                        <strong class="box"><?php //echo anchor('people', $expected);  ?></strong>
                </li> -->
    </ul><!-- /counters end -->

    <div class="dashlist"><h1><?php echo lang('dashboard:birthdays') ?>:</h1><br/>
        <?php foreach ($birthdays as $row): ?>
            <?php echo $row['name']; ?>&nbsp;&nbsp;&nbsp;
            <?php echo $row['date_of_birth']; ?><br/>
        <?php endforeach; ?></div>                        

</div> 

<div id="wrapper">
    <div id="divForGraph"></div>
</div>