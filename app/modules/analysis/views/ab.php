
<div class="container">
<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#getluminoso"><?php echo __('analysis:luminoso_correlation') ?></button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#getalchemy"><?php echo __('analysis:alchemy_sentiment') ?></button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#getaltest"><?php echo __('analysis:altesting') ?></button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#getcontentscrape"><?php echo __('analysis:contentscrape') ?></button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#getalchemynews"><?php echo __('analysis:searchalchemynewsdata') ?></button>

<!-- Modal -->
<!--
    Luminoso Correlation Score
-->
<!-- Modal -->
<div class="modal fade" id="getluminoso" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="addModalLabel">Enter your text string</h4>
            </div>
            <div class="modal-body">                        
                <form id="luminoso" name="luminoso" action="#" method="post">
                    <input type="hidden" name="mode" value="get_luminoso">
                    <fieldset>
                        <legend></legend>
                        
                        <label for="title"><span class="required">*</span><?php echo __('analysis:luminoso_project') ?></label>
                         <select name="project" class="form-control">
                            <?php
                            foreach ($projects as $project) {
                                    echo '<option value="' . $project['name'] . '">' . $project['name'] . '</option>';
                            }
                            ?>
                        </select>   
                        <br/>
                        <label for="url"><span class="required">*</span><?php echo __('analysis:texttoscore') ?></label>
                        <br>
                        <input name="article_text" rows="10" type="text" id="article_text" class="input_text">
                        <textarea class="form-control" rows="10" id="article_text"></textarea>
                        <br/>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="send" type="button" class="btn btn-primary" >Send</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="resultip"></div>

<script type="text/javascript">
//
// Modal to add item
//
$(".modalbox").fancybox();
$("#send").on("click", function(){
    var $form = $(this);
    $("#send").replaceWith("<em>Getting...</em>");
    $.ajax({
        type: 'post',
        url: 'get_corralation',
        crossDomain: true,
        data: $("#luminoso").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
                setTimeout("$.fancybox.close()", 2000);
            }           
                alert('Failed error - contact support');
                setTimeout("$.fancybox.close()", 2000);
         },
        success: function(data) 
        {
            $("#luminoso").fadeOut("fast", function()
            {
                $(this).before("<p><strong>Success! Your have received correlation data</strong></p>");
//                setTimeout("$.fancybox.close()", 2000);
                setTimeout(function(){ $.fancybox.close();}, 1000);
                $('#resultip').html(data);
            });
        },
        timeout: 3000 // sets timeout to 3 seconds
    });
});
</script>

<!--
     Luminoso Correlation A/L Test
-->

<!-- Modal -->
<div class="modal fade" id="getaltest" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="addModalLabel">Add URL</h4>
            </div>
            <div class="modal-body">                        
                <form id="altest" name="altest" action="#" method="post">
                    <input type="hidden" name="mode" value="get_altest">
                    <fieldset>
                        <legend></legend>
                        
                        <label for="title"><span class="required">*</span><?php echo __('analysis:luminoso_project') ?></label>
                         <select name="project" class="form-control">
                            <?php
                            foreach ($projects as $project) {
                                    echo '<option value="' . $project['name'] . '">' . $project['name'] . '</option>';
                            }
                            ?>
                        </select>   
                        <br/>
                        <label for="url"><span class="required">*</span><?php echo __('analysis:texttoscore') ?></label>
                        <br>
                        <input name="article_text" type="text" id="article_text" class="input_text">
                        <br>
                        <label for="title"><span class="required">*</span><?php echo __('analysis:luminoso_project') ?></label>
                         <select name="project1" class="form-control">
                            <?php
                            foreach ($projects as $project) {
                                    echo '<option value="' . $project['name'] . '">' . $project['name'] . '</option>';
                            }
                            ?>
                        </select>   
                        <br/>
                        <label for="url1"><span class="required">*</span><?php echo __('analysis:texttoscore') ?></label>
                        <br>
                        <input name="article_text1" type="text" id="article_text1" class="input_text">

 <!--                       <textarea class="form-control" rows="10" id="article_text"></textarea>
 -->
                        <br/>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="sendaltest" type="button" class="btn btn-primary" >Send</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="luminosoaltest"></div>

<script type="text/javascript">
//
// Modal to add item
//

$("#sendaltest").on("click", function(){
    var $form = $(this);
    $("#sendaltest").replaceWith("<em>Getting...</em>");
    $.ajax({
        type: 'post',
        url: 'luminoso_altest',
        crossDomain: true,
        data: $("#altest").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
                setTimeout("$.fancybox.close()", 1000);
            }           
                alert('Failed error - contact support');
                setTimeout("$.fancybox.close()", 1000);
         },
        success: function(data) 
        {
            $("#altest").fadeOut("fast", function()
            {
                $(this).before("<p><strong>Success! Your have received sentiment score</strong></p>");
                setTimeout("$.fancybox.close()", 1000);
                $('#luminosoaltest').html(data);
            });
        },
        timeout: 6000 // sets timeout to 6 seconds
    });
});
</script>

<!--
   Alchemy Sentement by url
-->

<!-- Modal -->
<div class="modal fade" id="getalchemy" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="addModalLabel">Add URL</h4>
            </div>
            <div class="modal-body">                        
                <form id="alchemy" name="alchemy" action="#" method="post">
                    <input type="hidden" name="mode" value="get_alchemy">
                    <fieldset>
                        <label for="url"><span class="required">*</span><?php echo __('analysis:url') ?></label>
                        <br>
                        <input name="url" type="text" id="url" class="input_text">
                        <br/>
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="sendalchemy" type="button" class="btn btn-primary" >Send</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="alchemysentiment"></div>

<script type="text/javascript">
//
// Modal to add item
//

$("#sendalchemy").on("click", function(){
    var $form = $(this);
    $("#sendalchemy").replaceWith("<em>Getting...</em>");
    $.ajax({
        type: 'post',
        url: 'get_alchemy_sentiment',
        crossDomain: true,
        data: $("#alchemy").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
                setTimeout("$.fancybox.close()", 2000);
            }           
                alert('Failed error - contact support');
                setTimeout("$.fancybox.close()", 2000);
         },
        success: function(data) 
        {
            $("#alchemy").fadeOut("fast", function()
            {
                $(this).before("<p><strong>Success! Your have received sentiment score</strong></p>");
                setTimeout("$.fancybox.close()", 1000);
                $('#alchemysentiment').html(data);
            });
        },
        timeout: 3000 // sets timeout to 3 seconds
    });
});
</script>

<!--
   Alchemy Content Scrape
-->

<!-- Modal -->
<div class="modal fade" id="getcontentscrape" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="addModalLabel">Type the URL to scrape</h4>
            </div>
            <div class="modal-body">                        
                <form id="contentscrape" name="contentscrape" action="#" method="post">
                    <input type="hidden" name="mode" value="get_alchemy_contentscrape">
                    <fieldset>
                        <label for="url"><span class="required">*</span><?php echo __('analysis:url') ?></label>
                        <br>
                        <input name="url" type="text" id="url" class="input_text">
                        <br/>
                        <label for="cquery"><span class="required">*</span><?php echo __('analysis:querystring') ?></label>
                        <br>
                        <input name="cquery" type="text" id="cquery" class="input_text">
                        <br/>                        
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="sendcontentscrape" type="button" class="btn btn-primary" >Send</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="alchemycontentscrape"></div>

<script type="text/javascript">
//
// Modal to add item
//

$("#sendcontentscrape").on("click", function(){
    var $form = $(this);
//    $("#sendcontentscrape").replaceWith("<em>Getting...</em>");
    $.ajax({
        type: 'post',
        url: 'get_alchemy_contentscrape',
        crossDomain: true,
        data: $("#contentscrape").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
                setTimeout("$.fancybox.close()", 2000);
            }           
                alert('Failed error - contact support');
                setTimeout("$.fancybox.close()", 2000);
         },
        success: function(data) 
        {
            $("#contentscrape").fadeOut("fast", function()
            {
                $(this).before("<p><strong>Success! Your have received text elements</strong></p>");
 //               setTimeout("$.fancybox.close()", 1000);
                setTimeout(function(){ $.fancybox.close();}, 1000);
                $('#alchemycontentscrape').html(data);
//                setTimeout('closeMyFancyBox', 1000);
//               $(document).on("hidden.bs.modal", function (e) {
//                  $(e.target).removeData("bs.modal").find(".modal-content").empty();
//                });
//                $('body').on('hidden.bs.modal', '.modal', function () {
//                       $(this).removeData('bs.modal');
//                });
            });
        },
        timeout: 6000 // sets timeout to 6 seconds
    });
});

function closeMyFancyBox() {
    $.fancybox.close();
}
</script>

<!--
   Alchemy News
-->

<!-- Modal -->
<div class="modal fade" id="getalchemynews" tabindex="-1" role="dialog" aria-labelledby="addModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                <h4 class="modal-title" id="addModalLabel">Type the title and text to search</h4>
            </div>
            <div class="modal-body">                        
                <form id="alchemynews" name="alchemynews" action="#" method="post">
                    <input type="hidden" name="mode" value="get_alchemy_news">
                    <fieldset>
                        <label for="title"><span class="required"></span><?php echo __('analysis:title') ?></label>
                        <br>
                        <input name="title" type="text" id="title" class="input_text">
                        <br/>
                        <label for="textstring"><span class="required"></span><?php echo __('analysis:textstring') ?></label>
                        <br>
                        <input name="textstring" type="text" id="textstring" class="input_text">
                        <br/>
                        <label for="start"><span class="required"></span><?php echo __('analysis:start') ?></label>
                        <br>
                        <input name="start" type="text" id="start" class="input_text">
                        <br/>   
                        <br/>
                        <label for="end"><span class="required"></span><?php echo __('analysis:end') ?></label>
                        <br>
                        <input name="end" type="text" id="end" class="input_text">
                        <br/>   
                        <br/>
                        <label for="maxresults"><span class="required"></span><?php echo __('analysis:maxresults') ?></label>
                        <br>
                        <input name="maxresults" type="text" id="maxresults" class="input_text">
                        <br/>                        
                    </fieldset>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button id="sendalchemynews" type="button" class="btn btn-primary" >Send</button>
            </div>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="output"></div>

<script type="text/javascript">
//
// Modal to add item
//

$("#sendalchemynews").on("click", function(){
    var $form = $(this);
//    $("#sendalchemynews").replaceWith("<em>Getting...</em>");
    $.ajax({
        type: 'get',
        url: 'analysis/get_alchemy_news',
        crossDomain: true,
        data: $("#alchemynews").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
                setTimeout("$.fancybox.close()", 2000);
            }           
                alert('Failed error - contact support');
                setTimeout("$.fancybox.close()", 2000);
         },
        success: function(data) 
        {
            $("#alchemynews").fadeOut("fast", function()
            {
                $(this).before("<p><strong>Success! Your have received text elements</strong></p>");
                setTimeout(function(){ $.fancybox.close();}, 1000);
                $('#output').html(data);
            });
        },
        timeout: 6000 // sets timeout to 6 seconds
    });
});

function closeMyFancyBox() {
    $.fancybox.close();
}
</script>


</div>

<!--
<div class="container">
    <div id="form">
        <h2>Submit Text String to Get Luminoso Correlation score</h2> 
        <h3>Fill In details Information !</h3>
        <div>
            <label>Url :</label>
            <input id="url" type="text">
            <label>Text :</label>
            <input id="text" type="text">
            <input id="submit" class="btn btn-primary" type="button" value="<?php echo __('general:submit') ?>">
            <input id="submit" class="btn btn-primary" type="button" value="Submit">
        </div>
    </div>
</div>



<div id="resultip"></div>

<script type="text/javascript">

$(document).ready(function() {
    $("#submit").click(function() {
        var url = $("#url").val();
        var text = $("#text").val();
        // Returns successful data submission message when the entered information is stored in database.
        var dataString = 'url1='+ name + '&text1='+ email;
        if(url==''||text=='')
        {
            alert("Please Fill All Fields");
        }
        else
        {
            // AJAX Code To Submit Form.
            $.ajax({
                type: "GET",
                url: "analysis/get_corralation",
                data: dataString,
                cache: false,
                success: function(result) {
                    $('#resultip').html(result);

                    alert(result);
                }
            });
        }
    return false;
    });
});
-->