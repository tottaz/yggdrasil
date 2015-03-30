
<form name="luminoso">
<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#luminoso">
    lumioso correlation
</button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#alchemy">
    alchemy score
</button>

<!-- Button trigger modal -->
<button class="btn btn-primary" data-toggle="modal" data-target="#altest">
    A/L Testing
</button>

<!-- Modal -->
<div class="modal fade" id="luminoso" tabindex="-1" role="dialog" aria-labelledby="luminosoLabel" aria-hidden="false">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="false">
                &times;
            </button>
            <h3 class="modal-title" id="luminosoLabel">add Position</h3>
        </div>
        <div class="modal-body">
            <form name="modal-form" class="form-horizontal">
                <!-- form stuff goes here -->
                <input type="text"  name="job_title" value="" />
                <input type="text"  name="from" value="" />  &ndash; <input type="text" name="to" value="" /> <input type="text"  name="total experience" value="" /> 
                <input type="text"  name="industries" value="" /> 
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
                Close
            </button>
            <button type="button" type="submit" class="btn btn-primary" id="save" data-dismiss="modal">
                Save
            </button>
        </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

<!-- Modal -->
<div class="modal fade" id="alchemy" tabindex="-1" role="dialog" aria-labelledby="alchemyLabel" aria-hidden="false">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="false">
                &times;
            </button>
            <h3 class="modal-title" id="alchemyLabel">add Position</h3>
        </div>
        <div class="modal-body">
            <form name="modal-form" class="form-horizontal">
                <!-- form stuff goes here -->
                <input type="text"  name="job_title" value="" />
                <input type="text"  name="from" value="" />  &ndash; <input type="text" name="to" value="" /> <input type="text"  name="total experience" value="" /> 
                <input type="text"  name="industries" value="" /> 
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
                Close
            </button>
            <button type="button" type="submit" class="btn btn-primary" id="save" data-dismiss="modal">
                Save
            </button>
        </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

<!-- Modal -->
<div class="modal fade" id="altest" tabindex="-1" role="dialog" aria-labelledby="altestLabel" aria-hidden="false">
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="false">
                &times;
            </button>
            <h3 class="modal-title" id="altestLabel">add Position</h3>
        </div>
        <div class="modal-body">
            <form name="modal-form" class="form-horizontal">
                <!-- form stuff goes here -->
                <input type="text"  name="job_title" value="" />
                <input type="text"  name="from" value="" />  &ndash; <input type="text" name="to" value="" /> <input type="text"  name="total experience" value="" /> 
                <input type="text"  name="industries" value="" /> 
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">
                Close
            </button>
            <button type="button" type="submit" class="btn btn-primary" id="save" data-dismiss="modal">
                Save
            </button>
        </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->

    <!-- after save button data entered on modal goes here i.e. -->
     <input type="text" disabled name="job_title[]" value="Software Developer" />
     <input type="text" disabled name="from[]" value="November 2013" />  &ndash; <input type="text" disabled name="to[]" value="present" /> <input type="text" disabled name="total experience[]" value="2 months" /> 
     <input type="text" disabled name="industries[]" value="IT" /> 
</form>

<script>
$('#save').click(function() {
    $( "input[name='job_title[]']" ).val($("input[name='job_title']").val());
    $( "input[name='from[]']" ).val($("input[name='from']").val());
    $( "input[name='to[]']" ).val($("input[name='to']").val());
    $( "input[name='total experience[]']" ).val($("input[name='total experience']").val());
    $( "input[name='industries[]']" ).val($("input[name='industries']").val());
    });
</script>