     <script type="text/javascript" src="http://www.google.com/jsapi"></script>
      <script type="text/javascript">
         google.load('visualization', '1', {packages: ['corechart', 'linechart', 'columnchart', 'table']});
      </script>
      <script type="text/javascript">

         var query, visualization;
         var query1, visualization1;
         var query2, visualization2;
         var query3, visualization3;
         var query4, visualization4;
         var query5, visualization5;
         var query6, visualization6;
         

//table:{cols:[
//        {id:'rdate',label:'Date',type:'string',pattern:''},
//        {id:'num_accounts',label:'Total accounts',type:'number',pattern:'#,##0.###'},
//        {id:'count_1d_actives',label:'Active last day',type:'number',pattern:'#,##0.###'},
//        {id:'count_7d_actives',label:'Active last week',type:'number',pattern:'#,##0.###'},
//        {id:'count_14d_actives',label:'Active last two weeks',type:'number',pattern:'#,##0.###'},
//        {id:'count_30d_actives',label:'Active last 30 days',type:'number',pattern:'#,##0.###'},
//        {id:'count_30d_idle',label:'Idle for 30 days',type:'number',pattern:'#,##0.###'},
//        {id:'count_60d_idle',label:'Idle for 60 days',type:'number',pattern:'#,##0.###'},
//        {id:'count_90d_idle',label:'Idle for 90 days',type:'number',pattern:'#,##0.###'},
//        {id:'usage_in_mb',label:'Total Usage (MB)',type:'number',pattern:'#,##0.###'},
//        {id:'avg_usage_in_mb',label:'Average Usage (MB)',type:'number',pattern:'#,##0.###'},
//        {id:'quota_in_mb',label:'Total Quota (MB) - Deprecated',type:'number',pattern:'#,##0.###'},
//        {id:'avg_quota_in_mb',label:'Average Quota (MB) - Deprecated',type:'number',pattern:'#,##0.###'}]

         function initialize() {
//            visualization = new google.visualization.ColumnChart(document.getElementById('visualization'));
//            query = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
//            query.setRefreshInterval(5);
//            query.send(drawVisualization);
            
            visualization1 = new google.visualization.LineChart(document.getElementById('visualization1'));
            query1 = new google.visualization.Query('https://www.google.com/a/cpanel/greenpeace.org/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query1.setRefreshInterval(5);
            query1.setQuery('select rdate, num_accounts');                        
            query1.send(drawVisualization1);
            
            visualization2 = new google.visualization.LineChart(document.getElementById('visualization2'));
            query2 = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query2.setRefreshInterval(5);
            query2.setQuery('select rdate, count_1d_actives, count_7d_actives, count_14d_actives, count_30d_actives ');                        
            query2.send(drawVisualization2);
            
            visualization3 = new google.visualization.LineChart(document.getElementById('visualization3'));            
            query3 = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query3.setRefreshInterval(5);
            query3.setQuery('select rdate, count_30d_idle, count_60d_idle, count_90d_idle');                        
            query3.send(drawVisualization3);
            
            visualization4 = new google.visualization.ColumnChart(document.getElementById('visualization4'));            
            query4 = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query4.setRefreshInterval(5);
            query4.setQuery('select rdate, usage_in_mb');                        
            query4.send(drawVisualization4);
            
            visualization5 = new google.visualization.ColumnChart(document.getElementById('visualization5'));            
            query5 = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query5.setRefreshInterval(5);
            query5.setQuery('select rdate, avg_usage_in_mb');                        
            query5.send(drawVisualization5);
            
            visualization6 = new google.visualization.ColumnChart(document.getElementById('visualization6'));          
            query6 = new google.visualization.Query('https://www.google.com/a/cpanel/thunderbeardesign.com/ReportGviz?reportKey=c7740adf30bffd060dda0b7315b2badd');
            query6.setRefreshInterval(5);
            query6.setQuery('select rdate, avg_quota_in_mb');                        
            query6.send(drawVisualization6);            
         }

//         function drawVisualization(response) {
//            if (response.isError()) {
//               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
//               return;
//            }
//            var visualization = new google.visualization.Table(document.getElementById('visualization'));
//            visualization.draw(response.getDataTable(), {showRowNumber: true});
//         }
         
         function drawVisualization1(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }
                        
            visualization1.draw(response.getDataTable(), {legend: 'bottom', title: 'Total Accounts'});
         }
         
         function drawVisualization2(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }
                        
            visualization2.draw(response.getDataTable(), {legend: 'bottom', title: 'Account Active'});
         }
         
         function drawVisualization3(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }
                        
            visualization3.draw(response.getDataTable(), {legend: 'bottom', title: 'Account Idle'});
         }
         
         function drawVisualization4(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }
                        
            visualization4.draw(response.getDataTable(), {legend: 'bottom', title: 'Total Usage (MB)'});
         }
         
         function drawVisualization5(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }
                        
            visualization5.draw(response.getDataTable(), {legend: 'bottom', title: 'Average Usage (MB'});
         }
         
         function drawVisualization6(response) {
            if (response.isError()) {
               alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
               return;
            }                        
            visualization6.draw(response.getDataTable(), {legend: 'bottom', title: 'Average Quota (MB) - Deprecated'});
         }
         

         google.setOnLoadCallback(initialize);
      </script>
<!--
      <div>
          <div id='visualization'></div>
      </div>    
-->
    <div class="container">
     <h1 style='width:95%; padding:20px; font-family:Tahoma;font-weight:normal;background:#f2f3f4;'>Google Apps Statistics</h1>      

         <div id="visualization1" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
          
         <div id="visualization2" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
          
         <div id="visualization3" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
          
         <div id="visualization4" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
          
         <div id="visualization5" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
          
         <div id="visualization6" style="height: 250px; width: 350px; border: 1px solid; float: left;" />         
      </div>
      </div>       