<?php

	require_once("../config.php");
	$res=mysql_connect($mysql_server,$mysql_user,$mysql_pass);
	mysql_select_db($mysql_db);
	
	require("../../codebase/treemultitable_connector.php");
	
	
	$tree = new TreeMultitableConnector($res);
	//
	$tree->setMaxLevel(3);
	$level = $tree->get_level();

	switch ($level) {
		case 0:
			$tree->render_table("projects","project_id","project_name","","");
			break;
		case 1:
			$tree->render_sql("SELECT teams.team_id, teams.team_name, project_team.project_id FROM teams INNER JOIN project_team ON teams.team_id=project_team.team_id", "team_id", "team_name", "", "project_id");
			break;
		case 2:
			$tree->render_table("developers", "developer_id", "developer_name", "", "developer_team");
			break;
		case 3:
			$tree->render_table("phones", "phone_id", "phone", "", "phone_developer");
			break;
	}

?>