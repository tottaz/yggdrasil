<?php
	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	
	require_once("../../codebase/treegrid_connector.php");
	$tree = new TreeGridConnector($res);
	
	function custom_format($item){
			$item->set_row_color($item->get_value("complete")<75?"#AAFFFF":"#FFAAFF");
			if ($item->get_value("duration")>10)
				$item->set_image("true.gif");
			else
				$item->set_image("false.gif");
	}
	$tree->event->attach("beforeRender",custom_format);
	$tree->render_sql("SELECT * from tasks WHERE complete>49","taskId","taskName,duration,complete","","parentId");
?>