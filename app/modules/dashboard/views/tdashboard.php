<!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
  <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
<![endif]-->

    <div class="container-fluid">
    <div class="row-fluid">
        
        <noscript>
            <div class="alert alert-block span10">
                <h4 class="alert-heading">Warning!</h4>
                <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p>
            </div>
        </noscript>
        
        <div id="content" class="span10">
        <!-- start: Content -->
        
        <div class="sortable row-fluid">
            
            <div class="box-small span2">
                <a data-rel="tooltip" title="55% visits growth." class="box-small-link" href="#">
                    <div id="visits-count">1.998.746</div>
                </a>
                <div class="box-small-title">Visits</div>
                <span id="visits-count-n"class="notification">+ 55%</span>
            </div>
                
            <div class="box-small span2">
                <a data-rel="tooltip" title="1586 new members." class="box-small-link" href="#">
                    <div id="members-count">794.278</div>
                </a>
                <div class="box-small-title">Members</div>
                <span id="members-count-n" class="notification green">+ 1.586</span>
            </div>
            
            <div class="box-small span2">
                <a data-rel="tooltip" title="$29.875 income." class="box-small-link" href="#">
                    <div id="income-count">$519.879</div>
                </a>
                <div class="box-small-title">Income</div>
                <span id="income-count-n" class="notification yellow">+ $29.875</span>
            </div>
            
            <div class="box-small span2">
                <a data-rel="tooltip" title="1.296 new items have been sold." class="box-small-link" href="#">
                    <div id="sales-count">11.976</div>
                </a>
                <div class="box-small-title">Sales</div>
                <span id="sales-count-n" class="notification red">+ 1.296</span>
            </div>
        
        </div>
        
        <hr>
        
        <div class="row-fluid">
            
            <div class="box span8">
                <div class="box-header">
                    <h2><i class="icon-signal"></i><span class="break"></span>Site Statistics</h2>
                    <div class="box-icon">
                        <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                        <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                        <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                    </div>
                </div>
                <div class="box-content">
                    <div id="sincos"  class="center" style="height:300px" ></div>
                    <p id="hoverdata">Mouse position at (<span id="x">0</span>, <span id="y">0</span>). <span id="clickdata"></span></p>
                </div>
            </div>
            
            <div class="box span4">
                <div class="box-header">
                    <h2><i class="icon-list-alt"></i><span class="break"></span>Realtime Traffic</h2>
                    <div class="box-icon">
                        <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                        <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                    </div>
                </div>
                <div class="box-content">
                    <div id="realtimechart" style="height:190px;"></div>
                        <br/>
                        <p class="clearfix">You can update a chart periodically to get a real-time effect by using a timer to insert the new data in the plot and redraw it.</p>
                        <p>Time between updates: <input id="updateInterval" type="text" value="" style="text-align: right; width:5em"> milliseconds</p>
                </div>
            </div><!--/span-->
            
        </div>
        
        <hr>
        
        <div class="row-fluid">
            
            <div class="box span9">
                <div class="box-header">
                    <h2><i class="icon-calendar"></i><span class="break"></span>Calendar</h2>
                </div>
                <div class="box-content">
                    <div id="main_calendar" class="hidden-phone"></div>
                    <div id="main_calendar_phone" class="hidden-desktop hidden-tablet"></div>
                    <div class="clearfix"></div>
                </div>  
            </div><!--/span-->
            
            <div class="box span3">
                <div class="box-header">
                    <h2><i class="icon-list"></i><span class="break"></span>Weekly Stat</h2>
                    <div class="box-icon">
                        <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                        <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                    </div>
                </div>
                <div class="box-content">
                    <ul class="dashboard-list">
                        <li>
                            <a href="#">
                                <i class="icon-arrow-up"></i>                               
                                <span class="green">92</span>
                                New Comments                                    
                            </a>
                        </li>
                      <li>
                        <a href="#">
                          <i class="icon-arrow-down"></i>
                          <span class="red">15</span>
                          New Registrations
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-minus"></i>
                          <span class="blue">36</span>
                          New Articles                                    
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-comment"></i>
                          <span class="yellow">45</span>
                          User reviews                                    
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-arrow-up"></i>                               
                          <span class="green">112</span>
                          New Comments                                    
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-arrow-down"></i>
                          <span class="red">31</span>
                          New Registrations
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-minus"></i>
                          <span class="blue">93</span>
                          New Articles                                    
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i class="icon-comment"></i>
                          <span class="yellow">254</span>
                          User reviews                                    
                        </a>
                      </li>
                    </ul>
                </div>
            </div><!--/span-->
            
            <div class="box span3">
                <div class="box-header">
                    <h2><i class="icon-user"></i><span class="break"></span>Last Users</h2>
                    <div class="box-icon">
                        <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                        <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                    </div>
                </div>
                <div class="box-content">
                    <ul class="dashboard-list">
                        <li>
                            <a href="#">
                                <img class="dashboard-avatar" alt="Lucas" src="img/avatar.jpg">
                            </a>
                            <strong>Name:</strong> <a href="#">Lucas</a><br>
                            <strong>Since:</strong> 17/05/2012<br>
                            <strong>Status:</strong> <span class="label label-success">Approved</span>                                  
                        </li>
                        <li>
                            <a href="#">
                                <img class="dashboard-avatar" alt="Bill" src="img/avatar.jpg">
                            </a>
                            <strong>Name:</strong> <a href="#">Bill</a><br>
                            <strong>Since:</strong> 17/05/2012<br>
                            <strong>Status:</strong> <span class="label label-warning">Pending</span>                                 
                        </li>
                        <li>
                            <a href="#">
                                <img class="dashboard-avatar" alt="Jane" src="img/avatar.jpg">
                            </a>
                            <strong>Name:</strong> <a href="#">Jane</a><br>
                            <strong>Since:</strong> 17/05/2012<br>
                            <strong>Status:</strong> <span class="label label-important">Banned</span>                                  
                        </li>
                        <li>
                            <a href="#">
                                <img class="dashboard-avatar" alt="Kate" src="img/avatar.jpg">
                            </a>
                            <strong>Name:</strong> <a href="#">Kate</a><br>
                            <strong>Since:</strong> 17/05/2012<br>
                            <strong>Status:</strong> <span class="label label-info">Updates</span>                                  
                        </li>
                    </ul>
                </div>
            </div><!--/span-->
                    
        </div>
        
   
                <!-- end: Content -->
        </div><!--/#content.span10-->
            </div><!--/fluid-row-->
            
    <div class="modal hide fade" id="myModal">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal">×</button>
            <h3>Settings</h3>
        </div>
        <div class="modal-body">
            <p>Here settings can be configured...</p>
        </div>
        <div class="modal-footer">
            <a href="#" class="btn" data-dismiss="modal">Close</a>
            <a href="#" class="btn btn-primary">Save changes</a>
        </div>
    </div>
    
    <div class="clearfix"></div>
            
</div><!--/.fluid-container-->

<!-- start: JavaScript-->
    <script src="../../app/modules/dashboard/js/jquery-migrate-1.0.0.min.js"></script>
    <script src="../../app/modules/dashboard/js/jquery-ui-1.10.0.custom.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.cookie.js"></script>

    <script src='../../app/modules/dashboard/js/fullcalendar.min.js'></script>

    <script src='../../app/modules/dashboard/js/jquery.dataTables.min.js'></script>

    <script src="../../app/modules/dashboard/js/excanvas.js"></script>
    <script src="../../app/modules/dashboard/js/jquery.flot.min.js"></script>
    <script src="../../app/modules/dashboard/js/jquery.flot.pie.min.js"></script>
    <script src="../../app/modules/dashboard/js/jquery.flot.stack.js"></script>
    <script src="../../app/modules/dashboard/js/jquery.flot.resize.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.chosen.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.uniform.min.js"></script>
    
    <script src="../../app/modules/dashboard/js/jquery.cleditor.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.noty.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.elfinder.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.raty.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.iphone.toggle.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.uploadify-3.1.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.gritter.min.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.imagesloaded.js"></script>

    <script src="../../app/modules/dashboard/js/jquery.masonry.min.js"></script>

    <script src="../../app/modules/dashboard/js/custom.js"></script>

    <script type="text/javascript" language="JavaScript">

function message_welcome1(){
    var unique_id = $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'Welcome to Dashboard',
        // (string | mandatory) the text inside the notification
        text: 'Here you can check the latest items',
        // (string | optional) the image to display on the left
//        image: 'img/avatar.jpg',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: '',
        // (string | optional) the class name you want to apply to that specific message
        class_name: 'my-sticky-class'
    });
}

function message_welcome2(){
    var unique_id = $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'You have a task',
        // (string | mandatory) the text inside the notification
        text: 'Please complete your task',
        // (string | optional) the image to display on the left
//        image: 'img/avatar.jpg',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: '',
        // (string | optional) the class name you want to apply to that specific message
        class_name: 'my-sticky-class'
    });
}

function message_welcome3(){
    var unique_id = $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'New data loaded',
        // (string | mandatory) the text inside the notification
        text: 'New Data has been loaded.',
        // (string | optional) the image to display on the left
//        image: 'img/avatar.jpg',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: false,
        // (int | optional) the time you want it to be alive for before fading out
        time: '',
        // (string | optional) the class name you want to apply to that specific message
        class_name: 'gritter-light'
    });
}

$(document).ready(function(){
    
    setTimeout("message_welcome1()",5000);
    setTimeout("message_welcome2()",10000); 
    setTimeout("message_welcome3()",15000);
    setInterval(f_visits, 100);
    setInterval(f_members, 2000);
    setInterval(f_income, 5000);
    setInterval(f_sales, 5000);
    setInterval(live_notifications_center, 5000);    
});         
</script>