        <div class="layout">
            <div class="header-text">Web Server Health Monitor</div>
            <div class="img-theme" data-bind="click:toggleTheme"></div>
            <div class="content traffic">
               <div class="slide-button left-button" data-bind="click:goto"></div>
                <div class="row">
                    <div class="col1">
                        <div class="legend-row">
                        <div class="legend">Traffic Distribution in Percent (Yesterday)</div>
                        <div class="hr"></div>
                    </div>
                        <div class="clear"></div>
                        <div class="chart-container pie-chart" data-bind="dxPieChart: pieChartOptions"></div>
                    </div>
                    <div class="col2">
                        <div class="legend-row">
                        <div class="legend">Traffic Distribution in TBytes (Yesterday)</div>
                        <div class="hr"></div>
                    </div>
                        <div class="clear"></div>
                        <div class="chart-container bar-chart-traffic" data-bind="dxChart: barChartOptions"></div>
                    </div>
                </div>
                <div class="row">
                <div class="col1">
                    <div class="legend-row">
                        <div class="legend">Traffic per Hours (Yesterday)</div>
                        <div class="hr"></div>
                    </div>
                    <div class="clear"></div>
                    <div class="chart-container" data-bind="dxChart: lineChartOptions"></div>
                </div>

                <div class="col2">
                    <div class="legend-row">
                        <div class="legend">Traffic per Days (Last Six Days)</div>
                        <div class="hr"></div>
                    </div>
                    <div class="clear"></div>
                    <div class="chart-container" data-bind="dxChart: stackedBarChartOptions"></div>
                </div>
            </div>
            </div>
        </div>

   <script src="../app/modules/system/js//WebServerMonitor.js"></script>
    <script src="../app/modules/system/js/traffic.js"></script>
