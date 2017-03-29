<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

   require("../../codebase/combo_connector.php");
   $combo = new ComboConnector($res);
//   $combo->enable_log("temp.log");
   $combo->render_table("country_data","country_id","name");
?>