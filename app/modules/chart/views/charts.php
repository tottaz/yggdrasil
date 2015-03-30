    <!-- The HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

<!-- start: Header -->
    <!-- start: Header -->    
        <div class="container-fluid">
        <div class="row-fluid">
                
            <!-- start: Main Menu -->
            <div class="span2 main-menu-span">
                <div class="nav-collapse sidebar-nav">
                    <ul class="nav nav-tabs nav-stacked main-menu">
                        <li class="nav-header hidden-tablet">Navigation</li>
                        <li><a href="index.html"><i class="icon-home"></i><span class="hidden-tablet"> Dashboard</span></a></li>
                        <li><a href="ui.html"><i class="icon-eye-open"></i><span class="hidden-tablet"> UI Features</span></a></li>
                        <li><a href="form.html"><i class="icon-edit"></i><span class="hidden-tablet"> Forms</span></a></li>
                        <li><a href="chart.html"><i class="icon-list-alt"></i><span class="hidden-tablet"> Charts</span></a></li>
                        <li><a href="typography.html"><i class="icon-font"></i><span class="hidden-tablet"> Typography</span></a></li>
                        <li><a href="gallery.html"><i class="icon-picture"></i><span class="hidden-tablet"> Gallery</span></a></li>
                        <li><a href="table.html"><i class="icon-align-justify"></i><span class="hidden-tablet"> Tables</span></a></li>
                        <li><a href="calendar.html"><i class="icon-calendar"></i><span class="hidden-tablet"> Calendar</span></a></li>
                        <li><a href="grid.html"><i class="icon-th"></i><span class="hidden-tablet"> Grid</span></a></li>
                        <li><a href="file-manager.html"><i class="icon-folder-open"></i><span class="hidden-tablet"> File Manager</span></a></li>
                        <li><a href="icon.html"><i class="icon-star"></i><span class="hidden-tablet"> Icons</span></a></li>
                        <li><a href="login.html"><i class="icon-lock"></i><span class="hidden-tablet"> Login Page</span></a></li>
                    </ul>
                </div><!--/.well -->
            </div><!--/span-->
            <!-- end: Main Menu -->
            
            <noscript>
                <div class="alert alert-block span10">
                    <h4 class="alert-heading">Warning!</h4>
                    <p>You need to have <a href="http://en.wikipedia.org/wiki/JavaScript" target="_blank">JavaScript</a> enabled to use this site.</p>
                </div>
            </noscript>
            
            <div id="content" class="span10">


            <div class="row-fluid sortable">
                
                <div class="box">
                    <div class="box-header">
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Chart with points</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                        <div id="sincos"  class="center" style="height:300px;" ></div>
                        <p id="hoverdata">Mouse position at (<span id="x">0</span>, <span id="y">0</span>). <span id="clickdata"></span></p>
                    </div>
                </div>
                
                <div class="box">
                    <div class="box-header">
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Flot</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                        <div id="flotchart" class="center" style="height:300px"></div>
                    </div>
                </div>
                
                <div class="box">
                    <div class="box-header">
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Stack Example</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                         <div id="stackchart" class="center" style="height:300px;"></div>

                        <p class="stackControls center">
                            <input class="btn" type="button" value="With stacking">
                            <input class="btn" type="button" value="Without stacking">
                        </p>

                        <p class="graphControls center">
                            <input class="btn-primary" type="button" value="Bars">
                            <input class="btn-primary" type="button" value="Lines">
                            <input class="btn-primary" type="button" value="Lines with steps">
                        </p>
                    </div>
                </div>

            </div><!--/row-->
            
            <div class="row-fluid sortable">
                <div class="box span4">
                    <div class="box-header">
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Pie</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                            <div id="piechart" style="height:300px"></div>
                    </div>
                </div>
                
                <div class="box span4">
                    <div class="box-header">
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Realtime</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                         <div id="realtimechart" style="height:190px;"></div>
                         <p>You can update a chart periodically to get a real-time effect by using a timer to insert the new data in the plot and redraw it.</p>
                         <p>Time between updates: <input id="updateInterval" type="text" value="" style="text-align: right; width:5em"> milliseconds</p>
                    </div>
                </div>
                    
                <div class="box span4">
                    <div class="box-header" data-original-title>
                        <h2><i class="icon-list-alt"></i><span class="break"></span>Donut</h2>
                        <div class="box-icon">
                            <a href="#" class="btn-setting"><i class="icon-wrench"></i></a>
                            <a href="#" class="btn-minimize"><i class="icon-chevron-up"></i></a>
                            <a href="#" class="btn-close"><i class="icon-remove"></i></a>
                        </div>
                    </div>
                    <div class="box-content">
                         <div id="donutchart" style="height: 300px;">
                    </div>
                </div>
            </div>  
        </div><!--/row-->
        
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
        <hr>
                
    </div><!--/.fluid-container-->

    <!-- start: JavaScript-->
        <script src="../../app/modules/chart/../../app/modules/chart/js/jquery-1.9.1.min.js"></script>
        <script src="../../app/modules/chart/js/jquery-migrate-1.0.0.min.js"></script>
        <script src="../../app/modules/chart/js/jquery-ui-1.10.0.custom.min.js"></script>
        <script src="../../app/modules/chart/js/bootstrap.js"></script>
        <script src="../../app/modules/chart/js/jquery.cookie.js"></script>
        <script src='../../app/modules/chart/js/fullcalendar.min.js'></script>
        <script src='../../app/modules/chart/js/jquery.dataTables.min.js'></script>
        <script src="../../app/modules/chart/js/excanvas.js"></script>
        <script src="../../app/modules/chart/js/jquery.flot.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.flot.pie.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.flot.stack.js"></script>
        <script src="../../app/modules/chart/js/jquery.flot.resize.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.chosen.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.uniform.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.cleditor.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.noty.js"></script>
        <script src="../../app/modules/chart/js/jquery.elfinder.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.raty.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.iphone.toggle.js"></script>
        <script src="../../app/modules/chart/js/jquery.uploadify-3.1.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.gritter.min.js"></script>
        <script src="../../app/modules/chart/js/jquery.imagesloaded.js"></script>
        <script src="../../app/modules/chart/js/jquery.masonry.min.js"></script>
        <script src="../../app/modules/chart/js/custom.js"></script>
        <!-- end: JavaScript-->