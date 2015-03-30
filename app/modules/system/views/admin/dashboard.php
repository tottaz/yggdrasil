<div class="layout">
           <div class="header-text">Web Server Health Monitoring</div>
           <div class="img-theme" data-bind="click:toggleTheme"></div>
           <div class="content helth">
               <div class="slide-button right-button" data-bind="click:goto"></div>
               <div class="row">
                   <div class="legend-row">
                       <div class="legend">Requests per second</div>
                       <div class="hr"></div>
                   </div>
                   <div class="clear"></div>
                   <div class="col1">
                       <div class="text">View the number of requests completed at the moment and for the selected range within the last day.</div>
                       <label id="requestNumber" class="label-value" data-bind="text: requestsNumber"></label>
                   </div>
                   <div class="col2" data-bind="dxCircularGauge: gaugeRequestsNumberOptions"></div>
                   <div class="col3" id="RequestChartContainer" data-bind="dxChart: chartRequestsNumberOptions" ></div>
               </div>
               <div class="row">
                    <div class="legend-row">
                       <div class="legend">CPU, %</div>
                       <div class="hr"></div>
                   </div>
                   <div class="clear"></div>
                   <div class="col1">
                       <div class="text">View how much CPU is being used at the moment and for the selected range within the last day.</div>
                       <label id="CPU" class="label-value" data-bind="text:CPU"></label>
                   </div>
                    <div class="col2" data-bind="dxCircularGauge: true" data-dx_circular_gauge="gaugeCPUOptions"></div>
                   <div class="col3" id="CPUChartContainer" data-bind="dxChart: chartCPUOptions"></div>
               </div>
               <div class="row">
                    <div class="legend-row">
                       <div class="legend">Memory Consumption, Mb</div>
                       <div class="hr"></div>
                   </div>
                   <div class="clear"></div>
                   <div class="col1">
                       <div class="text">View how much memory is used at the moment and for the selected range within the last day.</div>
                       <label id="memoryConsumption" class="label-value" data-bind="text:memoryConsumpiton"></label>
                   </div>
                   <div class="col2" data-bind="dxCircularGauge: gaugeMemoryConsumptionOptions"></div>
                   <div class="col3" data-bind="dxChart: chartMemoryConsumptionOptions" id="memoryChartContainer"></div>
               </div>
               <div class="row">
                   <div class="col1"></div>
                   <div class="col2"></div>
                   <div class="col3" id="rangeSelectorContainer"></div>
               </div>
           </div>
       </div>

   <script src="../app/modules/system/js//WebServerMonitor.js"></script>
    <script src="../app/modules/system/js/index.js"></script>
