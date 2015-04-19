<?php echo $_GET["callback"]; 
echo "(";
if (($handle = fopen("http://ichart.finance.yahoo.com/table.csv?s=AB&a=06&b=05&c=2012&d=06&e=06&f=2014&g=d&ignore=.csv", "r")) !== FALSE) {
    $row = 0;
    $days_array = array();
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        if ($row > 0) {
            $time_epoch = strtotime($data[0]) * 1000;
            $day_array = array($time_epoch, $data[4]);
            array_push($days_array, $day_array);
        }
        $row++;
    }
    $days_array_asc = array_reverse($days_array);
    print json_encode($days_array_asc, JSON_NUMERIC_CHECK);
    fclose($handle);
}
echo ");";
?>