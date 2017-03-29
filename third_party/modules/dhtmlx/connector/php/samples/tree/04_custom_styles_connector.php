<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	
	require_once("../../codebase/tree_connector.php");
	$tree = new TreeConnector($res);
//	
	function custom_format($item){
			if ($item->get_value("duration")>10)
				$item->set_image("lock.gif");
			if ($item->get_value("complete")>75) 
				$item->set_check_state(1);
	}
	$tree->event->attach("beforeRender",custom_format);
	$tree->render_sql("SELECT taskId,taskName,duration,complete from tasks WHERE complete>49","taskId","taskName","","parentId");
?>