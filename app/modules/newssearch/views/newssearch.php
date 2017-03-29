<div class="container">
<form class="form-horizontal" role="form" id="alchemynews" name="alchemynews" action="#">
  <div class="form-group">
    <label class="control-label col-sm-2" for="title"><?php echo __('analysis:title') ?></label>
    <div class="col-sm-10">
      <input name="title" type="text" class="form-control" id="title" placeholder="Enter a search title">
      <span id="helpBlock" class="help-block"><?php echo __('analysis:searchtitlehelp') ?></span>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label col-sm-2" for="textstring"><?php echo __('analysis:textstring') ?></label>
    <div class="col-sm-10"> 
      <input name="textstring" type="text" class="form-control" id="textstring" placeholder="Enter search string for article">
      <span id="helpBlock" class="help-block"><?php echo __('analysis:searchtextstringhelp') ?></span>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label col-sm-2" for="start"><?php echo __('analysis:start') ?></label>
    <div class="col-sm-10"> 
      <input name="start" type="text" class="form-control" id="start" placeholder="Enter start date for search">
       <span id="helpBlock" class="help-block"><?php echo __('analysis:searchstartdatehelp') ?></span>
     </div>
  </div>
  <div class="form-group">
    <label class="control-label col-sm-2" for="end"><?php echo __('analysis:end') ?></label>
    <div class="col-sm-10"> 
      <input name="end" type="text" class="form-control" id="end" placeholder="Enter end date for search">
      <span id="helpBlock" class="help-block"><?php echo __('analysis:searchenddatehelp') ?></span>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label col-sm-2" for="maxresults"><?php echo __('analysis:maxresults') ?></label>
    <div class="col-sm-10"> 
      <input name="maxresults" type="text" class="form-control" id="maxresults" placeholder="Enter number of records returned">
      <span id="helpBlock" class="help-block"><?php echo __('analysis:searchmaxresultshelp') ?></span>
    </div>
  </div>
  <div class="form-group"> 
    <div class="col-sm-offset-2 col-sm-10">
      <button class="btn btn-primary" id="newssearch"><?php echo __('analysis:newssearch') ?></button>
    </div>
  </div>

  <?php echo __('analysis:details') ?>
  
    <div class="row">
        <div class="col-md-6">
        <label for="descriptionss"><?php echo __('analysis:showdescription') ?></label>                  
        </div>
        <div class="col-md-6">
        <input name="descriptionss" type="checkbox" id="descriptionss" checked>                 
        </div>
    </div>
    <div class="row">
        <div class="col-md-6">
        <label for="authorss"><?php echo __('analysis:showauthor') ?></label>                  
        </div>
        <div class="col-md-6">
        <input name="authorss" type="checkbox" id="authorss" checked>                 
        </div>
    </div>            
    <div class="row">
        <div class="col-md-6">
        <label for="imagess"><?php echo __('analysis:showimage') ?></label>                  
        </div>
        <div class="col-md-6">
        <input name="imagess" type="checkbox" id="imagess" checked>                 
        </div>
    </div>

    <div class="row">
        <div class="col-md-6">
        <label for="keywordss"><?php echo __('analysis:showkeywords') ?></label>                  
        </div>
        <div class="col-md-6">
        <input name="keywordss" type="checkbox" id="keywordss" checked>                 
        </div>
    </div>
</form>
</div>


<div class="container" id="output"></div>

<script>
$.fn.bootstrapSwitch.defaults.size = 'small';
$.fn.bootstrapSwitch.defaults.onColor = 'success';
$("[name='descriptionss']").bootstrapSwitch('state', false);
$("[name='authorss']").bootstrapSwitch('state', false);
$("[name='imagess']").bootstrapSwitch('state', false);
$("[name='keywordss']").bootstrapSwitch('state', false);

$("#newssearch").on("click", function() {
    var $form = $(this);
    $.ajax({
        type: 'get',
        url: 'newssearch/get_alchemy_news',
        crossDomain: true,
        data: $("#alchemynews").serialize(),
        error: function(jqXHR, textStatus) {
            if(textStatus == 'timeout')
            {     
                alert('Failed due to timeout try later'); 
            }           
                alert('Failed error - contact support');
         },
        success: function(data) 
        {
 //           alert(data);
              //Show HTML
            $('#output').html(data);
            //Show HTML code
        },
//        timeout: 10000 // sets timeout to 10 seconds
    });
    return false;
});

</script>


