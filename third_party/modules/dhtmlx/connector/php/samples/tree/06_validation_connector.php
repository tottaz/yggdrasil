<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);

   require("../../codebase/tree_connector.php");
   $tree = new TreeConnector($res);
//   
   function my_check($action){
		if (strlen($action->get_value("taskName"))<5)
			$action->invalid();
   }
   $tree->event->attach("beforeProcessing",my_check);
   $tree->render_table("tasks","taskId","taskName","","parentId");
?>