<div class="container"> 

<script type='text/javascript' src='https://www.google.com/jsapi'></script>;
    <script type='text/javascript'>
    google.load('visualization', '1', {'packages': ['geochart']});
    google.setOnLoadCallback(drawRegionsMap);

    function drawRegionsMap() { 
      var data = google.visualization.arrayToDataTable([
      ['Country', 'Media Hits'],
      <?php foreach ($graph as $graphs) { ?>
       ['<?php echo $graphs['country']; ?>', <?php echo $graphs['mediahits']; ?>],
    <?php } ?>
    ]);
    var options = {};
    var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
    chart.draw(data, options);
};
</script>        

<div id="chart_div" style="width: 100%; height: 500px;"></div>

</div>