<?php
	require("../../codebase/db_filesystem.php");
	require("../../codebase/grid_connector.php");
	
	$grid = new GridConnector("c:/", "FileSystem");
	$grid->render_table("../","safe_name","filename,full_filename,size,name,extention,date,is_folder");
?>